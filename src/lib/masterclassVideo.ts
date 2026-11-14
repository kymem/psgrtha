import { supabase } from './supabase';

export interface ProcessedVideo {
  playbackId: string;
  videoUploadId: string;
  duration?: string;
}

const MAX_STATUS_CHECKS = 300;
const STATUS_CHECK_INTERVAL_MS = 2000;

export const toMuxStreamUrl = (playbackId: string) => `https://stream.mux.com/${playbackId}.m3u8`;

export async function getAccessToken(): Promise<string> {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) throw new Error('Sign in to upload videos');
  return session.access_token;
}

export async function ingestVideoUrl(videoUrl: string): Promise<ProcessedVideo> {
  const res = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/process-masterclass-video`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${await getAccessToken()}`,
    },
    body: JSON.stringify({ videoUrl }),
  });

  const body = await res.json().catch(() => null);
  const assetId: string | undefined = body?.data?.id;

  if (!res.ok || !assetId) {
    throw new Error(body?.error || 'Could not start processing this video URL');
  }

  return waitForPlayback(assetId);
}

async function waitForPlayback(assetId: string, attempt = 0): Promise<ProcessedVideo> {
  const { data, error } = await supabase
    .from('masterclass_video_uploads')
    .select('id, playback_id, status')
    .eq('asset_id', assetId)
    .single();

  if (error) throw new Error('Failed to check video status');
  if (data.status === 'failed') throw new Error('Mux could not process this video');
  if (data.playback_id && data.status === 'ready') {
    return { playbackId: data.playback_id, videoUploadId: data.id };
  }
  if (attempt >= MAX_STATUS_CHECKS) {
    throw new Error('Video processing is taking too long. Try again shortly.');
  }

  await new Promise((resolve) => setTimeout(resolve, STATUS_CHECK_INTERVAL_MS));
  return waitForPlayback(assetId, attempt + 1);
}
