-- Recreates the Courage to Grow class as a database-only workshop (no blueprint link)
-- and removes the previous row created from the hardcoded blueprint.

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM public.personal_growth_workshops
    WHERE blueprint_id = 'courage-and-persistence-for-growth'
  ) THEN
    RAISE EXCEPTION 'No workshop created from the courage-and-persistence-for-growth blueprint was found';
  END IF;
END
$$;

INSERT INTO public.personal_growth_workshops (
  created_by, blueprint_id, title, creator, track, description, category,
  thumbnail_url, duration, level, learning_outcomes, features, prerequisites,
  target_audience, curriculum, price, currency, status
)
SELECT
  w.created_by,
  NULL::text,
  'Courage to Grow: Honesty, Persistence & Lasting Habits',
  w.creator,
  'Courage & persistence',
  $description$A guided class on the courage and persistence that personal growth requires. Learners begin with an intro talk on vulnerability, examine common self-improvement pitfalls, explore passion and perseverance, and turn effort into repeatable habits. Videos are linked from YouTube and remain the property of their creators. The class is educational and is not a substitute for professional support.$description$,
  'personal-growth',
  'https://i.ytimg.com/vi/iCvmsMzlF7o/hqdefault.jpg',
  '5 sessions · approximately 3 hours',
  'Beginner',
  $outcomes$["Describe how vulnerability and honesty support meaningful growth.","Identify common self-improvement pressures and choose growth goals for the right reasons.","Distinguish productive persistence from rigid effort that ignores feedback.","Turn a long-term interest into a routine with a minimum version and a review point."]$outcomes$::jsonb,
  $features$["Five guided sessions","Linked expert talks","Growth plan worksheet"]$features$::jsonb,
  $prerequisites$No prior experience required. Bring a notebook or digital journal and one area of your life you want to develop.$prerequisites$,
  $audience$Learners who want to grow steadily and honestly, especially when progress feels hard to sustain.$audience$,
  $curriculum${
    "version": 1,
    "introduction": {
      "title": "Introduction: The power of vulnerability",
      "video_url": "https://www.youtube.com/watch?v=iCvmsMzlF7o",
      "description": "Begin with Brené Brown on why honesty and vulnerability are part of growth. Notice where you feel resistance, and carry that question into the sessions that follow.",
      "practice": "Write one area of your life you want to develop and one reason you feel reluctant to be honest about it."
    },
    "resources": [
      {
        "title": "Self-Determination Theory: Basic Psychological Needs",
        "url": "https://selfdeterminationtheory.org/topics/application-basic-psychological-needs/",
        "type": "reference"
      },
      {
        "title": "Implementation Intentions and Goal Achievement: A Meta-analysis",
        "url": "https://doi.org/10.1016/S0065-2601(06)38002-1",
        "type": "reference"
      }
    ],
    "lessons": [
      {
        "title": "Self-improvement without the pressure",
        "video_url": "https://www.youtube.com/watch?v=wljRiAofFJ8",
        "duration": "30 min",
        "description": "Examine common pitfalls of self-improvement, such as chasing an idealized self, comparing yourself with others, and treating growth as a constant demand. Watch the talk, then decide which parts of growth you want to keep and which create pressure without value.",
        "practice": "Write two growth goals you pursue out of pressure and one you pursue out of genuine interest. Note how each one affects your energy over a week."
      },
      {
        "title": "Passion and perseverance over time",
        "video_url": "https://www.youtube.com/watch?v=H14bBuluwB8",
        "duration": "35 min",
        "description": "Look at the difference between short bursts of effort and sustained interest over years. Watch the talk, then distinguish persistence on a goal you value from rigid effort that ignores feedback.",
        "practice": "Pick one long-term interest. Write what has kept your interest over the past year and one sign that would tell you it is time to change direction."
      },
      {
        "title": "Turning effort into a lasting habit",
        "video_url": "https://www.youtube.com/watch?v=1TQ4gezRQh4",
        "duration": "35 min",
        "description": "Translate perseverance into everyday routines by making effort repeatable, connecting it to purpose, and noticing when a plan needs adjusting rather than abandoning. Watch the interview, then consider which habit could support your chosen interest.",
        "practice": "Design a weekly routine for your chosen interest with a fixed time, a minimum version for hard weeks, and a check-in on the last day of the week."
      },
      {
        "title": "The courage to be honest about the hard parts",
        "video_url": "https://www.youtube.com/watch?v=QijH4UAqGD8",
        "duration": "35 min",
        "description": "Growth often requires admitting what is uncomfortable: a habit you avoid, feedback you have not asked for, or a belief that holds you back. Revisit the intro talk on vulnerability, watch Luvvie Ajayi Jones on speaking hard truths, then practice naming the difficulty clearly and without shame.",
        "practice": "Write one uncomfortable truth about your growth area and one small, honest step you can take this week. Share it with one trusted person if that feels safe."
      },
      {
        "title": "Integrate and plan your next cycle",
        "video_url": "https://www.youtube.com/watch?v=_X0mgOOSpLU",
        "duration": "35 min",
        "description": "Watch Carol Dweck on the growth mindset, then bring the course together by reviewing your chosen interest, routine, honest reflections, and the sources of pressure you noticed. Decide how you will continue after the course, including when you will review progress and what support you will ask for.",
        "practice": "Complete a one-page growth plan with your focus area, routine, one courage practice, a support person, and a review date four weeks from now."
      }
    ]
  }$curriculum$::jsonb,
  0,
  'UGX',
  'published'
FROM public.personal_growth_workshops w
WHERE w.blueprint_id = 'courage-and-persistence-for-growth';

DELETE FROM public.personal_growth_workshops
WHERE blueprint_id = 'courage-and-persistence-for-growth';
