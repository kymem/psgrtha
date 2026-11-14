BEGIN;

CREATE TABLE IF NOT EXISTS public.personal_growth_workshops (
  id uuid PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
  created_by uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  blueprint_id text,
  title text NOT NULL,
  creator text NOT NULL,
  track text NOT NULL,
  description text NOT NULL,
  category text NOT NULL DEFAULT 'personal-growth',
  thumbnail_url text NOT NULL,
  duration text,
  level text,
  learning_outcomes jsonb NOT NULL DEFAULT '[]'::jsonb,
  features jsonb NOT NULL DEFAULT '[]'::jsonb,
  prerequisites text,
  target_audience text,
  curriculum jsonb NOT NULL DEFAULT '{"version":1,"lessons":[],"resources":[]}'::jsonb,
  starts_at timestamptz,
  ends_at timestamptz,
  timezone text,
  location_type text NOT NULL DEFAULT 'online' CHECK (location_type IN ('online', 'in-person', 'hybrid')),
  location_details text,
  registration_capacity integer CHECK (registration_capacity IS NULL OR registration_capacity > 0),
  price numeric NOT NULL DEFAULT 0 CHECK (price >= 0),
  currency text NOT NULL DEFAULT 'UGX',
  status text NOT NULL DEFAULT 'published' CHECK (status IN ('draft', 'published', 'archived')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (created_by, blueprint_id),
  CHECK (starts_at IS NULL OR ends_at IS NULL OR ends_at > starts_at)
);

CREATE TABLE IF NOT EXISTS public.personal_growth_workshop_registrations (
  id uuid PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
  workshop_id uuid NOT NULL REFERENCES public.personal_growth_workshops(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  status text NOT NULL DEFAULT 'registered' CHECK (status IN ('registered', 'cancelled', 'attended')),
  payment_status text NOT NULL DEFAULT 'pending' CHECK (payment_status IN ('pending', 'completed', 'failed')),
  price_paid numeric NOT NULL DEFAULT 0,
  currency text NOT NULL DEFAULT 'UGX',
  payment_method text,
  transaction_id text,
  legacy_enrollment_id uuid UNIQUE REFERENCES public.student_enrollments(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (workshop_id, user_id)
);

CREATE TABLE IF NOT EXISTS public.personal_growth_mentorship_programs (
  id uuid PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
  created_by uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  blueprint_id text,
  title text NOT NULL,
  creator text NOT NULL,
  track text NOT NULL,
  description text NOT NULL,
  category text NOT NULL DEFAULT 'personal-growth',
  thumbnail_url text NOT NULL,
  duration text,
  level text,
  learning_outcomes jsonb NOT NULL DEFAULT '[]'::jsonb,
  features jsonb NOT NULL DEFAULT '[]'::jsonb,
  prerequisites text,
  target_audience text,
  curriculum jsonb NOT NULL DEFAULT '{"version":1,"lessons":[],"resources":[]}'::jsonb,
  price numeric NOT NULL DEFAULT 0 CHECK (price >= 0),
  currency text NOT NULL DEFAULT 'UGX',
  status text NOT NULL DEFAULT 'published' CHECK (status IN ('draft', 'published', 'archived')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (created_by, blueprint_id)
);

CREATE TABLE IF NOT EXISTS public.personal_growth_mentorship_applications (
  id uuid PRIMARY KEY DEFAULT extensions.uuid_generate_v4(),
  program_id uuid NOT NULL REFERENCES public.personal_growth_mentorship_programs(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  goals text NOT NULL,
  availability text,
  message text,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'declined', 'withdrawn')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (program_id, user_id)
);

CREATE INDEX IF NOT EXISTS personal_growth_workshops_status_idx ON public.personal_growth_workshops(status, created_at DESC);
CREATE INDEX IF NOT EXISTS personal_growth_workshop_registrations_workshop_idx ON public.personal_growth_workshop_registrations(workshop_id, status);
CREATE INDEX IF NOT EXISTS personal_growth_mentorship_programs_status_idx ON public.personal_growth_mentorship_programs(status, created_at DESC);
CREATE INDEX IF NOT EXISTS personal_growth_mentorship_applications_program_idx ON public.personal_growth_mentorship_applications(program_id, status);

ALTER TABLE public.personal_growth_workshops ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.personal_growth_workshop_registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.personal_growth_mentorship_programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.personal_growth_mentorship_applications ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Published personal growth workshops are visible" ON public.personal_growth_workshops;
CREATE POLICY "Published personal growth workshops are visible"
  ON public.personal_growth_workshops FOR SELECT TO anon, authenticated
  USING (status = 'published' OR created_by = auth.uid());

DROP POLICY IF EXISTS "Users can create their own personal growth workshops" ON public.personal_growth_workshops;
CREATE POLICY "Users can create their own personal growth workshops"
  ON public.personal_growth_workshops FOR INSERT TO authenticated
  WITH CHECK (created_by = auth.uid());

DROP POLICY IF EXISTS "Workshop creators can update their workshops" ON public.personal_growth_workshops;
CREATE POLICY "Workshop creators can update their workshops"
  ON public.personal_growth_workshops FOR UPDATE TO authenticated
  USING (created_by = auth.uid()) WITH CHECK (created_by = auth.uid());

DROP POLICY IF EXISTS "Workshop creators can delete their workshops" ON public.personal_growth_workshops;
CREATE POLICY "Workshop creators can delete their workshops"
  ON public.personal_growth_workshops FOR DELETE TO authenticated
  USING (created_by = auth.uid());

DROP POLICY IF EXISTS "Users and workshop creators can view registrations" ON public.personal_growth_workshop_registrations;
CREATE POLICY "Users and workshop creators can view registrations"
  ON public.personal_growth_workshop_registrations FOR SELECT TO authenticated
  USING (
    user_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM public.personal_growth_workshops w
      WHERE w.id = workshop_id AND w.created_by = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Published mentorship programs are visible" ON public.personal_growth_mentorship_programs;
CREATE POLICY "Published mentorship programs are visible"
  ON public.personal_growth_mentorship_programs FOR SELECT TO anon, authenticated
  USING (status = 'published' OR created_by = auth.uid());

DROP POLICY IF EXISTS "Users can create their own mentorship programs" ON public.personal_growth_mentorship_programs;
CREATE POLICY "Users can create their own mentorship programs"
  ON public.personal_growth_mentorship_programs FOR INSERT TO authenticated
  WITH CHECK (created_by = auth.uid());

DROP POLICY IF EXISTS "Mentorship program creators can update their programs" ON public.personal_growth_mentorship_programs;
CREATE POLICY "Mentorship program creators can update their programs"
  ON public.personal_growth_mentorship_programs FOR UPDATE TO authenticated
  USING (created_by = auth.uid()) WITH CHECK (created_by = auth.uid());

DROP POLICY IF EXISTS "Mentorship program creators can delete their programs" ON public.personal_growth_mentorship_programs;
CREATE POLICY "Mentorship program creators can delete their programs"
  ON public.personal_growth_mentorship_programs FOR DELETE TO authenticated
  USING (created_by = auth.uid());

DROP POLICY IF EXISTS "Applicants and program creators can view mentorship applications" ON public.personal_growth_mentorship_applications;
CREATE POLICY "Applicants and program creators can view mentorship applications"
  ON public.personal_growth_mentorship_applications FOR SELECT TO authenticated
  USING (
    user_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM public.personal_growth_mentorship_programs p
      WHERE p.id = program_id AND p.created_by = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Users can apply to published mentorship programs" ON public.personal_growth_mentorship_applications;
CREATE POLICY "Users can apply to published mentorship programs"
  ON public.personal_growth_mentorship_applications FOR INSERT TO authenticated
  WITH CHECK (
    user_id = auth.uid()
    AND status = 'pending'
    AND EXISTS (
      SELECT 1 FROM public.personal_growth_mentorship_programs p
      WHERE p.id = program_id AND p.status = 'published'
    )
  );

DROP POLICY IF EXISTS "Mentorship program creators can review applications" ON public.personal_growth_mentorship_applications;

GRANT SELECT ON public.personal_growth_workshops, public.personal_growth_mentorship_programs TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.personal_growth_workshops, public.personal_growth_mentorship_programs TO authenticated;
GRANT SELECT ON public.personal_growth_workshop_registrations, public.personal_growth_mentorship_applications TO authenticated;
GRANT INSERT ON public.personal_growth_mentorship_applications TO authenticated;

CREATE OR REPLACE FUNCTION public.register_for_personal_growth_workshop(p_workshop_id uuid)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  v_user_id uuid := auth.uid();
  v_capacity integer;
  v_registration_id uuid;
  v_registered_count integer;
BEGIN
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'Authentication required';
  END IF;

  SELECT w.registration_capacity INTO v_capacity
  FROM public.personal_growth_workshops w
  WHERE w.id = p_workshop_id AND w.status = 'published'
  FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Workshop is not available';
  END IF;

  SELECT count(*) INTO v_registered_count
  FROM public.personal_growth_workshop_registrations r
  WHERE r.workshop_id = p_workshop_id AND r.status = 'registered';

  IF v_capacity IS NOT NULL AND v_registered_count >= v_capacity
     AND NOT EXISTS (
       SELECT 1 FROM public.personal_growth_workshop_registrations r
       WHERE r.workshop_id = p_workshop_id AND r.user_id = v_user_id AND r.status = 'registered'
     ) THEN
    RAISE EXCEPTION 'Workshop registration is full';
  END IF;

  INSERT INTO public.personal_growth_workshop_registrations (workshop_id, user_id, status, payment_status)
  VALUES (p_workshop_id, v_user_id, 'registered', 'completed')
  ON CONFLICT (workshop_id, user_id)
  DO UPDATE SET status = 'registered', updated_at = now()
  RETURNING id INTO v_registration_id;

  RETURN v_registration_id;
END;
$$;

REVOKE ALL ON FUNCTION public.register_for_personal_growth_workshop(uuid) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.register_for_personal_growth_workshop(uuid) TO authenticated;

CREATE OR REPLACE FUNCTION public.review_personal_growth_mentorship_application(p_application_id uuid, p_status text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  v_user_id uuid := auth.uid();
BEGIN
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'Authentication required';
  END IF;
  IF p_status NOT IN ('approved', 'declined') THEN
    RAISE EXCEPTION 'Invalid application decision';
  END IF;

  UPDATE public.personal_growth_mentorship_applications a
  SET status = p_status, updated_at = now()
  FROM public.personal_growth_mentorship_programs p
  WHERE a.id = p_application_id
    AND p.id = a.program_id
    AND p.created_by = v_user_id
    AND a.status = 'pending';

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Application not found or already reviewed';
  END IF;
END;
$$;

REVOKE ALL ON FUNCTION public.review_personal_growth_mentorship_application(uuid, text) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.review_personal_growth_mentorship_application(uuid, text) TO authenticated;

INSERT INTO public.personal_growth_workshops (
  id, created_by, blueprint_id, title, creator, track, description, category,
  thumbnail_url, duration, level, learning_outcomes, features, prerequisites,
  target_audience, curriculum, price, currency, status
)
SELECT DISTINCT ON (mcc.user_id, mcc.title)
  mcc.id,
  mcc.user_id,
  CASE mcc.title
    WHEN 'Emotional Resilience: Respond with Clarity' THEN 'emotional-resilience-practice'
    WHEN 'The Habits & Goals Lab' THEN 'habits-and-goals-lab'
    WHEN 'Clear Thinking: Decisions, Creativity & Problem-Solving' THEN 'clear-thinking-and-decisions'
  END,
  mcc.title,
  mcc.creator,
  CASE mcc.title
    WHEN 'Emotional Resilience: Respond with Clarity' THEN 'Emotional awareness & coping'
    WHEN 'The Habits & Goals Lab' THEN 'Habits, focus & goal execution'
    WHEN 'Clear Thinking: Decisions, Creativity & Problem-Solving' THEN 'Critical thinking & decision-making'
  END,
  COALESCE(mcc.description, ''),
  mcc.category,
  COALESCE(mcc.thumbnail_url, ''),
  mcc.duration,
  mcc.level,
  COALESCE(to_jsonb(mcc)->'learning_outcomes', '[]'::jsonb),
  COALESCE(mcc.features, '[]'::jsonb),
  mcc.prerequisites,
  mcc.target_audience,
  COALESCE(mcc.curriculum, '{"version":1,"lessons":[],"resources":[]}'::jsonb),
  COALESCE(NULLIF(to_jsonb(mcc)->>'course_price', '')::numeric, 0),
  COALESCE(to_jsonb(mcc)->>'course_currency', 'UGX'),
  CASE WHEN mcc.status = 'published' THEN 'published' ELSE 'draft' END
FROM public.masterclass_page_content mcc
WHERE mcc.category = 'personal-growth'
  AND mcc.status IN ('published', 'draft')
  AND mcc.learning_format IN ('Applied workshop', 'Guided class')
  AND mcc.title IN (
    'Emotional Resilience: Respond with Clarity',
    'The Habits & Goals Lab',
    'Clear Thinking: Decisions, Creativity & Problem-Solving'
  )
ORDER BY mcc.user_id, mcc.title, (mcc.status = 'published') DESC, mcc.created_at DESC
ON CONFLICT DO NOTHING;

INSERT INTO public.personal_growth_mentorship_programs (
  id, created_by, blueprint_id, title, creator, track, description, category,
  thumbnail_url, duration, level, learning_outcomes, features, prerequisites,
  target_audience, curriculum, price, currency, status
)
SELECT DISTINCT ON (mcc.user_id)
  mcc.id,
  mcc.user_id,
  'communication-and-connection',
  mcc.title,
  mcc.creator,
  'Communication & relationships',
  COALESCE(mcc.description, ''),
  mcc.category,
  COALESCE(mcc.thumbnail_url, ''),
  mcc.duration,
  mcc.level,
  COALESCE(to_jsonb(mcc)->'learning_outcomes', '[]'::jsonb),
  COALESCE(mcc.features, '[]'::jsonb),
  mcc.prerequisites,
  mcc.target_audience,
  COALESCE(mcc.curriculum, '{"version":1,"lessons":[],"resources":[]}'::jsonb),
  COALESCE(NULLIF(to_jsonb(mcc)->>'course_price', '')::numeric, 0),
  COALESCE(to_jsonb(mcc)->>'course_currency', 'UGX'),
  CASE WHEN mcc.status = 'published' THEN 'published' ELSE 'draft' END
FROM public.masterclass_page_content mcc
WHERE mcc.category = 'personal-growth'
  AND mcc.status IN ('published', 'draft')
  AND mcc.learning_format = 'Mentorship series'
  AND mcc.title = 'Communication & Meaningful Connection'
ORDER BY mcc.user_id, (mcc.status = 'published') DESC, mcc.created_at DESC
ON CONFLICT DO NOTHING;

INSERT INTO public.personal_growth_workshop_registrations (
  workshop_id, user_id, status, payment_status, price_paid, currency,
  payment_method, transaction_id, legacy_enrollment_id
)
SELECT
  w.id,
  e.user_id,
  CASE e.status WHEN 'completed' THEN 'attended' WHEN 'dropped' THEN 'cancelled' ELSE 'registered' END,
  e.payment_status,
  e.price_paid,
  COALESCE(to_jsonb(e)->>'currency', 'UGX'),
  e.payment_method,
  e.transaction_id,
  e.id
FROM public.student_enrollments e
JOIN public.masterclass_page_content mcc ON mcc.id = e.course_id
JOIN public.personal_growth_workshops w
  ON w.created_by = mcc.user_id
  AND w.blueprint_id = CASE mcc.title
    WHEN 'Emotional Resilience: Respond with Clarity' THEN 'emotional-resilience-practice'
    WHEN 'The Habits & Goals Lab' THEN 'habits-and-goals-lab'
    WHEN 'Clear Thinking: Decisions, Creativity & Problem-Solving' THEN 'clear-thinking-and-decisions'
  END
WHERE mcc.category = 'personal-growth'
  AND mcc.status IN ('published', 'draft')
  AND mcc.learning_format IN ('Applied workshop', 'Guided class')
  AND mcc.title IN (
    'Emotional Resilience: Respond with Clarity',
    'The Habits & Goals Lab',
    'Clear Thinking: Decisions, Creativity & Problem-Solving'
  )
  AND e.payment_status = 'completed'
  AND e.status IN ('active', 'completed')
ON CONFLICT DO NOTHING;

UPDATE public.masterclass_page_content
SET status = 'draft'
WHERE category = 'personal-growth'
  AND (
    (learning_format IN ('Applied workshop', 'Guided class') AND title IN (
      'Emotional Resilience: Respond with Clarity',
      'The Habits & Goals Lab',
      'Clear Thinking: Decisions, Creativity & Problem-Solving'
    ))
    OR (learning_format = 'Mentorship series' AND title = 'Communication & Meaningful Connection')
  )
  AND status = 'published';

COMMIT;
