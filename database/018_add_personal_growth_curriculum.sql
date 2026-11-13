ALTER TABLE public.masterclass_page_content
  ADD COLUMN IF NOT EXISTS curriculum jsonb NOT NULL DEFAULT '{"version":1,"lessons":[],"resources":[]}'::jsonb,
  ADD COLUMN IF NOT EXISTS learning_format text NOT NULL DEFAULT 'Self-paced course';
