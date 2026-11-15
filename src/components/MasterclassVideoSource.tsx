import { useCallback, useEffect, useState } from 'react';
import { AlertCircle, Check, ExternalLink, Loader, X } from 'lucide-react';
import VideoUploadWithMuxForMasterclass from './VideoUploadWithMuxForMasterclass';
import { ingestVideoUrl, type ProcessedVideo } from '../lib/masterclassVideo';

interface MasterclassVideoSourceProps {
  userId: string;
  initialUrl?: string;
  processingSlot?: string;
  onReady: (video: ProcessedVideo) => void;
  onCleared: () => void;
  onProcessingChange?: (slot: string, isProcessing: boolean) => void;
}

export default function MasterclassVideoSource({
  userId,
  initialUrl,
  processingSlot,
  onReady,
  onCleared,
  onProcessingChange,
}: MasterclassVideoSourceProps) {
  const [mode, setMode] = useState<'upload' | 'url'>(initialUrl ? 'url' : 'upload');
  const [url, setUrl] = useState(initialUrl ?? '');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isUrlReady, setIsUrlReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!processingSlot || !onProcessingChange) return;
    onProcessingChange(processingSlot, isProcessing);
    return () => onProcessingChange(processingSlot, false);
  }, [isProcessing, processingSlot, onProcessingChange]);

  function switchMode(nextMode: 'upload' | 'url') {
    setMode(nextMode);
    setUrl('');
    setIsUrlReady(false);
    setError(null);
    onCleared();
  }

  const processUrl = useCallback(async (rawUrl: string) => {
    let parsed: URL;
    try {
      parsed = new URL(rawUrl.trim());
    } catch {
      setError('Enter a valid video URL.');
      return;
    }
    if (parsed.protocol !== 'https:') {
      setError('Use a link that starts with https://');
      return;
    }

    setError(null);
    setIsProcessing(true);
    try {
      const video = await ingestVideoUrl(parsed.toString());
      setIsUrlReady(true);
      onReady(video);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Processing failed');
    } finally {
      setIsProcessing(false);
    }
  }, [onReady]);

  function clearUrl() {
    setUrl('');
    setIsUrlReady(false);
    setError(null);
    onCleared();
  }

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => switchMode('upload')}
          className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
            mode === 'upload' ? 'bg-purple-500 text-white' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
          }`}
        >
          Upload File
        </button>
        <button
          type="button"
          onClick={() => switchMode('url')}
          className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
            mode === 'url' ? 'bg-blue-500 text-white' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
          }`}
        >
          Use URL
        </button>
      </div>

      {mode === 'upload' ? (
        <VideoUploadWithMuxForMasterclass
          userId={userId}
          onVideoSelected={(playbackId, videoUploadId, duration) =>
            onReady({ playbackId, videoUploadId, duration })
          }
          onVideoCleared={onCleared}
        />
      ) : isUrlReady ? (
        <div className="flex items-center gap-2 p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
          <Check className="w-5 h-5 text-green-400" />
          <p className="flex-1 text-sm text-green-300">Video ready. It will attach when you save the course.</p>
          <button type="button" onClick={clearUrl} className="p-2" aria-label="Remove video">
            <X className="w-4 h-4 text-green-300" />
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          <p className="text-xs text-gray-400">
            Paste a direct https link to a video file (for example, one stored in B2). It will be sent to Mux for playback only after you click Process.
          </p>
          <div className="flex gap-2">
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://..."
              disabled={isProcessing}
              className="flex-1 px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all disabled:opacity-50"
            />
            <button
              type="button"
              onClick={() => processUrl(url)}
              disabled={isProcessing || !url.trim()}
              className="px-4 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 text-sm transition-all disabled:opacity-50 flex items-center gap-2"
            >
              {isProcessing && <Loader className="w-4 h-4 animate-spin" />}
              {isProcessing ? 'Processing' : 'Process'}
            </button>
          </div>
          {url.trim().startsWith('https://') && (
            <a
              href={url.trim()}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-xs text-blue-400 hover:underline break-all"
            >
              <ExternalLink className="w-3 h-3 shrink-0" />
              {url.trim()}
            </a>
          )}
        </div>
      )}

      {error && (
        <div className="flex items-start gap-2 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
          <AlertCircle className="w-4 h-4 mt-0.5 text-red-400 shrink-0" />
          <p className="text-red-400 text-sm">{error}</p>
        </div>
      )}
    </div>
  );
}
