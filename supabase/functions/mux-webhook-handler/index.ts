import { createClient } from 'npm:@supabase/supabase-js';

const MUX_WEBHOOK_SECRET = Deno.env.get("MUX_WEBHOOK_SECRET");
const SIGNATURE_TOLERANCE_SECONDS = 300;

const supabaseAdmin = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
);

function toHex(buffer: ArrayBuffer): string {
  return Array.from(new Uint8Array(buffer), (b) => b.toString(16).padStart(2, '0')).join('');
}

function constantTimeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

async function hasValidMuxSignature(rawBody: string, header: string | null, secret: string): Promise<boolean> {
  if (!header) return false;

  const fields = new Map(header.split(',').map((part) => part.split('=', 2) as [string, string]));
  const timestamp = fields.get('t');
  const signature = fields.get('v1');
  if (!timestamp || !signature) return false;

  const ageSeconds = Math.abs(Date.now() / 1000 - Number(timestamp));
  if (!Number.isFinite(ageSeconds) || ageSeconds > SIGNATURE_TOLERANCE_SECONDS) return false;

  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  const mac = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(`${timestamp}.${rawBody}`));

  return constantTimeEqual(toHex(mac), signature);
}

Deno.serve(async (req) => {
  if (req.method !== 'POST') {
    return new Response('Method Not Allowed', { status: 405 });
  }

  if (!MUX_WEBHOOK_SECRET) {
    console.error('MUX_WEBHOOK_SECRET is not set');
    return new Response('Server misconfigured', { status: 500 });
  }

  const rawBody = await req.text();

  if (!(await hasValidMuxSignature(rawBody, req.headers.get('mux-signature'), MUX_WEBHOOK_SECRET))) {
    return new Response('Invalid signature', { status: 401 });
  }

  const data = JSON.parse(rawBody);

  if (data.type === 'video.asset.ready') {
    const assetId = data.data.id;
    const playbackId = data.data.playback_ids?.[0]?.id;

    if (!playbackId) {
      return new Response(JSON.stringify({ error: 'Missing playback ID' }), { status: 400 });
    }

    const results = await Promise.all([
      supabaseAdmin.from('video_uploads').update({ playback_id: playbackId, status: 'ready' }).eq('asset_id', assetId),
      supabaseAdmin.from('masterclass_video_uploads').update({ playback_id: playbackId, status: 'ready' }).eq('asset_id', assetId),
    ]);

    const error = results.find((result) => result.error)?.error;
    if (error) {
      console.error("Database update error:", error);
      return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }

    console.log(`Video Asset ${assetId} is ready with playback ID ${playbackId}.`);

    return new Response(JSON.stringify({
      status: 'success',
      assetId,
      playbackId
    }), { status: 200 });
  }

  if (data.type === 'video.asset.errored') {
    const assetId = data.data.id;

    const results = await Promise.all([
      supabaseAdmin.from('video_uploads').update({ status: 'failed' }).eq('asset_id', assetId),
      supabaseAdmin.from('masterclass_video_uploads').update({ status: 'failed' }).eq('asset_id', assetId),
    ]);

    const error = results.find((result) => result.error)?.error;
    if (error) {
      console.error("Database update error:", error);
      return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }

    return new Response(JSON.stringify({ status: 'marked failed', assetId }), { status: 200 });
  }

  return new Response(JSON.stringify({ status: `ignored event type: ${data.type}` }), { status: 200 });
});
