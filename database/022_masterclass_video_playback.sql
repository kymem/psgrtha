-- Let course owners read the status of their own Masterclass video uploads.
-- The authoring form polls this table from the browser to get the Mux playback ID.
DROP POLICY IF EXISTS "Users can view their own masterclass video uploads" ON public.masterclass_video_uploads;
CREATE POLICY "Users can view their own masterclass video uploads"
  ON public.masterclass_video_uploads
  FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_masterclass_video_uploads_asset_id
  ON public.masterclass_video_uploads(asset_id);
