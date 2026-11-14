import { createClient } from 'npm:@supabase/supabase-js';

const B2_BUCKET_NAME = Deno.env.get("B2_BUCKET_NAME");
const B2_PUBLIC_URL = Deno.env.get("B2_PUBLIC_URL");
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
    const { filename, userId, videoUrl } = await req.json();

    if (!userId || (!filename && !videoUrl)) {
      return new Response(JSON.stringify({ error: 'Missing filename/videoUrl or userId' }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    let sourceUrl: string;
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
      sourceName = parsed.pathname.split('/').pop() || 'video-url';
    } else {
      // Construct public B2 URL directly (no signed URL needed for public bucket)
      if (B2_PUBLIC_URL && B2_PUBLIC_URL.trim()) {
        const publicBase = B2_PUBLIC_URL.replace(/\/$/, '');
        sourceUrl = `${publicBase}/${B2_BUCKET_NAME}/${filename}`;
      } else {
        // Fallback: construct S3 path-hosted style URL
        sourceUrl = `https://s3.eu-central-003.backblazeb2.com/${B2_BUCKET_NAME}/${filename}`;
      }
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
        input: { url: sourceUrl },
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
          user_id: userId,
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
