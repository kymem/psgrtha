import { S3Client, GetObjectCommand } from "npm:@aws-sdk/client-s3";
import { getSignedUrl } from "npm:@aws-sdk/s3-request-presigner";
import { createClient } from 'npm:@supabase/supabase-js';

const B2_KEY_ID = Deno.env.get("B2_KEY_ID");
const B2_PUBLIC_URL = Deno.env.get("B2_PUBLIC_URL");
const B2_APPLICATION_KEY = Deno.env.get("B2_APPLICATION_KEY");
const B2_S3_ENDPOINT = Deno.env.get("B2_S3_ENDPOINT");
const B2_BUCKET_NAME = Deno.env.get("B2_BUCKET_NAME");
const MUX_TOKEN_ID = Deno.env.get("MUX_TOKEN_ID");
const MUX_TOKEN_SECRET = Deno.env.get("MUX_TOKEN_SECRET");

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type'
};

const supabaseAdmin = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
);

const s3 = new S3Client({
  region: "eu-central-003",
  endpoint: B2_S3_ENDPOINT,
  credentials: {
    accessKeyId: B2_KEY_ID!,
    secretAccessKey: B2_APPLICATION_KEY!
  }
});

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  if (req.method !== 'POST') {
    return new Response('Method Not Allowed', {
      status: 405,
      headers: corsHeaders
    });
  }

  try {
    const token = req.headers.get('authorization')?.replace(/^Bearer\s+/i, '');
    if (!token) {
      return new Response(JSON.stringify({ error: 'Sign in to process videos' }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token);
    if (authError || !user) {
      return new Response(JSON.stringify({ error: 'Invalid session' }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    const { filename, videoUrl } = await req.json();

    if (!filename && !videoUrl) {
      return new Response(JSON.stringify({ error: 'Missing filename or videoUrl' }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    let sourceUrl: string;
    let muxInputUrl: string;
    let sourceName: string;

    if (videoUrl) {
      let parsed: URL;
      try {
        parsed = new URL(videoUrl);
      } catch {
        return new Response(JSON.stringify({ error: 'Invalid video URL' }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        });
      }
      if (parsed.protocol !== 'https:') {
        return new Response(JSON.stringify({ error: 'Video URL must use https' }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        });
      }
      sourceUrl = parsed.toString();
      muxInputUrl = sourceUrl;
      sourceName = parsed.pathname.split('/').pop() || 'video-url';
    } else {
      const ownPrefix = `masterclass_videos/${user.id}/`;
      if (typeof filename !== 'string' || !filename.startsWith(ownPrefix) || filename.includes('..')) {
        return new Response(JSON.stringify({ error: 'File does not belong to this account' }), {
          status: 403,
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        });
      }
      if (B2_PUBLIC_URL && B2_PUBLIC_URL.trim()) {
        const publicBase = B2_PUBLIC_URL.replace(/\/$/, '');
        sourceUrl = `${publicBase}/${B2_BUCKET_NAME}/${filename}`;
      } else {
        sourceUrl = `https://s3.eu-central-003.backblazeb2.com/${B2_BUCKET_NAME}/${filename}`;
      }
      muxInputUrl = await getSignedUrl(
        s3,
        new GetObjectCommand({ Bucket: B2_BUCKET_NAME!, Key: filename }),
        { expiresIn: 900 }
      );
      sourceName = filename;
    }

    if (sourceUrl.includes('undefined') || sourceUrl.includes('null')) {
      console.error('Invalid URL constructed:', sourceUrl);
      return new Response(
        JSON.stringify({
          error: 'Failed to construct valid public URL. Configuration may be incomplete.'
        }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        }
      );
    }

    const muxResponse = await fetch("https://api.mux.com/video/v1/assets", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Basic " + btoa(`${MUX_TOKEN_ID}:${MUX_TOKEN_SECRET}`)
      },
      body: JSON.stringify({
        input: { url: muxInputUrl },
        playback_policy: ["public"]
      })
    });

    const muxData = await muxResponse.json();

    if (!muxData.data || !muxData.data.id) {
      return new Response(JSON.stringify({ error: 'Failed to create Mux asset' }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    const assetId = muxData.data.id;

    const { error: dbError } = await supabaseAdmin
      .from('masterclass_video_uploads')
      .insert([
        {
          user_id: user.id,
          filename: sourceName,
          b2_url: sourceUrl,
          asset_id: assetId,
          status: 'processing'
        }
      ]);

    if (dbError) {
      console.error("Database insert error:", dbError);
      return new Response(JSON.stringify({ error: dbError.message }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    return new Response(JSON.stringify(muxData), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  } catch (error) {
    console.error('Process masterclass video error:', error);
    return new Response(JSON.stringify({
      error: error instanceof Error ? error.message : 'Failed to process video'
    }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  }
});
