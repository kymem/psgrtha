export interface CourseLesson {
  title: string;
  duration: string;
  description: string;
  practice: string;
  video_url?: string;
  content_url?: string;
  thumbnail_url?: string;
  video_upload_id?: string;
}

export interface CourseResource {
  title: string;
  url: string;
  type: 'reference' | 'document' | 'course';
}

export interface CourseCurriculum {
  version: 1;
  introduction?: {
    title: string;
    description: string;
    practice: string;
    video_url?: string;
    content_url?: string;
    video_upload_id?: string;
  };
  lessons: CourseLesson[];
  resources: CourseResource[];
}

export interface PersonalGrowthBlueprint {
  id: string;
  title: string;
  track: string;
  learning_format: string;
  description: string;
  duration: string;
  level: string;
  learning_outcomes: string[];
  features: string[];
  prerequisites: string;
  target_audience: string;
  thumbnail_url: string;
  intro_video_url?: string;
  curriculum: CourseCurriculum;
}

const legacyFlourishHosts = new Set(['flourishtalents.com', 'www.flourishtalents.com']);

export const isPersonalGrowthEnabled = () =>
  typeof window === 'undefined' || !legacyFlourishHosts.has(window.location.hostname.toLowerCase());

export const shouldShowPersonalGrowthCategory = (category?: string | null) =>
  isPersonalGrowthEnabled() || category?.trim().toLowerCase() !== 'personal-growth';

export const isStandalonePersonalGrowthFormat = (category?: string | null, format?: string | null) =>
  category?.trim().toLowerCase() === 'personal-growth'
  && ['guided class', 'applied workshop', 'mentorship series'].includes(format?.trim().toLowerCase() || '');

const lifeSkillsReference = {
  title: 'WHO life-skills education guide',
  url: 'https://iris.who.int/bitstream/handle/10665/331948/9789240004849-eng.pdf',
  type: 'reference' as const,
};

const motivationReference = {
  title: 'Self-Determination Theory: Basic Psychological Needs',
  url: 'https://selfdeterminationtheory.org/topics/application-basic-psychological-needs/',
  type: 'reference' as const,
};

const goalPlanningReference = {
  title: 'Implementation Intentions and Goal Achievement: A Meta-analysis',
  url: 'https://doi.org/10.1016/S0065-2601(06)38002-1',
  type: 'reference' as const,
};

const yaleWellbeingCourse = {
  title: 'Yale: The Science of Well-Being (Coursera)',
  url: 'https://www.coursera.org/learn/the-science-of-well-being',
  type: 'course' as const,
};

const hkustPersonalGrowthCourse = {
  title: 'HKUST: Psychology of Personal Growth (edX)',
  url: 'https://www.edx.org/learn/personal-development/the-hong-kong-university-of-science-and-technology-psychology-of-personal-growth',
  type: 'course' as const,
};

const learningHowToLearnCourse = {
  title: 'Learning How to Learn (Coursera)',
  url: 'https://www.coursera.org/learn/learning-how-to-learn',
  type: 'course' as const,
};

// Placeholder test clip; replace with real lesson videos before publishing.
const placeholderLessonVideoUrl = 'https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/360/Big_Buck_Bunny_360_10s_1MB.mp4';

const protesilaosSelfImprovementVideoUrl = 'https://archive.org/download/prot-books-2022-10-21-self-improvement/prot-books-2022-10-21-self-improvement-EJOoBWcFdio.mp4';
const navyMindfulnessStressVideoUrl = 'https://archive.org/download/22-0005-063-dod-108974779/22-0005-063%20%28DOD_108974779%29.mp4';
const npsThreeMinutesMindfulnessVideoUrl = 'https://archive.org/download/nps-video-tuma-three-minutes-of-mindfulness/tuma-ThreeMinutesofMindfulnessFINAL1_1280x720.mp4';

const protesilaosVideoCredit = {
  title: 'Video: "On self-improvement" by Protesilaos Stavrou (CC BY-SA 4.0, Internet Archive)',
  url: 'https://archive.org/details/prot-books-2022-10-21-self-improvement',
  type: 'reference' as const,
};

const navyVideoCredit = {
  title: 'Video: "U.S. Navy Surgeon General Discusses Mindfulness and Stress" (U.S. Navy, public domain, Internet Archive)',
  url: 'https://archive.org/details/22-0005-063-dod-108974779',
  type: 'reference' as const,
};

const npsVideoCredit = {
  title: 'Video: "Three Minutes of Mindfulness" (National Park Service, public domain, Internet Archive)',
  url: 'https://archive.org/details/nps-video-tuma-three-minutes-of-mindfulness',
  type: 'reference' as const,
};

const tqlCredit = (id: string, title: string) => ({
  title: `Video: "${title}" by Boyd Martin (CC BY 4.0, Internet Archive)`,
  url: `https://archive.org/details/${id}`,
  type: 'reference' as const,
});

const tqlMastersVideoUrl = 'https://archive.org/download/tql-masters-r-c/TQL-Masters-r-c.mp4';
const tqlLadderVideoUrl = 'https://archive.org/download/tql-ladder-r-c/TQL-Ladder-r-c.mp4';
const tqlResolutionsVideoUrl = 'https://archive.org/download/tql-resolutions-fail-r-c/TQL-Resolutions-Fail-r-c.mp4';
const tqlPatienceVideoUrl = 'https://archive.org/download/tql-patience-r-c/TQL-Patience-r-c.mp4';
const tqlSetbacksVideoUrl = 'https://archive.org/download/tql-setbacks-r-c/TQL-Setbacks-r-c.mp4';
const tqlRelaxingVideoUrl = 'https://archive.org/download/tql-relaxing-falling-r-c/TQL-Relaxing-Falling-r-c.mp4';
const tqlTriggersVideoUrl = 'https://archive.org/download/tql-triggers-r-c/TQL-Triggers-r-c.mp4';
const tqlStoryVideoUrl = 'https://archive.org/download/tql-story-not-aware-r-c/TQL-Story-Not-Aware-r-c.mp4';
const tqlChoiceTrapVideoUrl = 'https://archive.org/download/tql-choice-trap-r-c/TQL-Choice-Trap-r-c.mp4';
const tqlSilenceVideoUrl = 'https://archive.org/download/tql-silence-c/TQL-Silence-c.mp4';

export const PERSONAL_GROWTH_BLUEPRINTS: PersonalGrowthBlueprint[] = [
  {
    id: 'self-leadership-foundations',
    title: 'Self-Leadership: Know Yourself, Choose Your Direction',
    track: 'Self-awareness & purpose',
    learning_format: 'Self-paced course',
    description: 'A practical foundation for understanding your values, strengths, needs, and patterns, then turning that insight into a direction you choose. Learners build a personal operating guide through short lessons, reflection, and low-risk experiments. This original course is educational and is not a substitute for mental-health care.',
    duration: '6 lessons · approximately 3 hours',
    level: 'Beginner',
    learning_outcomes: [
      'Name the values and needs that shape meaningful choices.',
      'Describe personal strengths and recurring patterns using specific evidence.',
      'Write a grounded personal direction statement and test it with a small action.',
      'Create a weekly reflection routine that supports autonomy, competence, and connection.',
    ],
    features: ['Six guided lessons', 'Reflection prompts', 'Personal direction worksheet', 'Seven-day action experiment'],
    prerequisites: 'No prior experience required. Bring a notebook or digital journal.',
    target_audience: 'Anyone who wants more self-understanding and a practical, self-directed next step.',
    thumbnail_url: 'https://images.pexels.com/photos/7984912/pexels-photo-7984912.jpeg',
    curriculum: {
      version: 1,
      resources: [lifeSkillsReference, motivationReference, hkustPersonalGrowthCourse],
      lessons: [
        {
          title: 'Start with the life you are actually living',
          duration: '25 min',
          description: 'Establish a kind, evidence-based snapshot of your present life. Separate observations from judgments, notice where energy and attention go, and choose one area you want to understand better. Self-awareness is a skill built through observation, not a verdict about who you are.',
          practice: 'Keep a three-day energy log. Note one moment that felt engaging, one that felt draining, what happened, and what you needed in each moment.',
        },
        {
          title: 'Values, needs, and meaningful choice',
          duration: '30 min',
          description: 'Distinguish values (qualities you want to bring to life) from goals (outcomes you can pursue). Explore autonomy, competence, and relatedness as useful lenses for noticing whether a goal feels self-endorsed, achievable through learning, and connected to people who matter.',
          practice: 'Choose five values from a list you create, narrow them to three, and write one recent example of each value in action. Identify one unmet need without blaming yourself.',
        },
        {
          title: 'Strengths as behaviors, not labels',
          duration: '30 min',
          description: 'Treat strengths as repeatable behaviors that help in a particular context, rather than fixed identity labels. Gather examples from work, relationships, and everyday challenges. Also identify the conditions that let a strength help and the conditions where it can be overused.',
          practice: 'Write three short evidence stories: a challenge, what you did, and the useful behavior it demonstrates. Ask one trusted person what they see you doing well.',
        },
        {
          title: 'Patterns, triggers, and choice points',
          duration: '35 min',
          description: 'Map a recurring situation using a simple sequence: context, thought, feeling, action, and consequence. The purpose is curiosity and choice, not self-diagnosis. Look for the moment where a small pause, clearer request, or changed environment could make a different response possible.',
          practice: 'Map one low-stakes recurring situation. Add two possible responses and predict the likely short- and long-term effects of each.',
        },
        {
          title: 'Write a direction, not a perfect life plan',
          duration: '30 min',
          description: 'Turn values and strengths into a flexible direction statement. A useful direction is specific enough to guide a decision and open enough to evolve as you learn. Pair it with one observable behavior so progress does not depend on waiting for certainty.',
          practice: 'Draft a one-sentence direction statement, then translate it into one action you can complete within seven days. Ask whether it is chosen, doable, and meaningful.',
        },
        {
          title: 'Run a seven-day personal experiment',
          duration: '30 min',
          description: 'Use a short experiment to learn rather than to prove your worth. Define a small behavior, a realistic cue, and a way to record what happens. Review the result without all-or-nothing scoring; keep, adapt, or stop the experiment based on what you learned.',
          practice: 'Complete a one-page experiment plan with a cue, action, likely obstacle, support person, and review date. At the review, record one insight and one next adjustment.',
        },
      ],
    },
  },
  {
    id: 'emotional-resilience-practice',
    title: 'Emotional Resilience: Respond with Clarity',
    track: 'Emotional awareness & coping',
    learning_format: 'Guided class',
    description: 'A skills-based class in noticing emotions, responding to everyday stress, and choosing supportive next actions. Learners practice emotional vocabulary, a pause-and-choose routine, perspective-taking, and a personal support map. The content is educational, non-clinical, and does not promise to prevent or treat mental-health conditions.',
    duration: '6 lessons · approximately 3.5 hours',
    level: 'Beginner to Intermediate',
    learning_outcomes: [
      'Identify emotions, body cues, and common stressors without judging them.',
      'Use a brief grounding and response-planning routine for everyday situations.',
      'Reframe an unhelpful interpretation while retaining the facts.',
      'Create a practical support and recovery plan, including when to seek professional help.',
    ],
    features: ['Six skills lessons', 'Pause-and-choose practice', 'Stress map', 'Personal support plan'],
    prerequisites: 'No prior experience required. Take the practices at a pace that feels appropriate.',
    target_audience: 'Learners who want practical everyday coping, emotional-awareness, and help-seeking skills.',
    thumbnail_url: 'https://images.pexels.com/photos/40080146/pexels-photo-40080146.jpeg',
    curriculum: {
      version: 1,
      resources: [lifeSkillsReference, motivationReference, yaleWellbeingCourse],
      lessons: [
        {
          title: 'Emotions as information',
          duration: '30 min',
          description: 'Build a more precise vocabulary for emotions and distinguish an emotion from the story attached to it. Notice intensity, context, and possible needs. Emotions can offer information, but they are not commands and do not need to be suppressed before a thoughtful response is possible.',
          practice: 'Use an emotion word wheel or your own list to name three moments this week. Record the situation, intensity from 1 to 5, and what the emotion may be signaling.',
        },
        {
          title: 'Recognize your everyday stress pattern',
          duration: '35 min',
          description: 'Map common stressors alongside early cues in attention, body, mood, and behavior. Separate what is within your influence from what is not. This map helps identify a useful next step and a realistic support, rather than implying every stressor can be removed by individual effort.',
          practice: 'Complete a stress map with three common triggers, your early signals, one controllable response, and one person or service you can contact when needed.',
        },
        {
          title: 'Pause, orient, and choose',
          duration: '30 min',
          description: 'Practice a short, optional pause: notice your feet or surroundings, lengthen an exhale if comfortable, name what is happening, and select one next action. Grounding is a general attention skill; stop or adapt it if it feels uncomfortable and choose another safe way to orient.',
          practice: 'Try a 60-second orienting pause during a low-pressure moment. Write down what changed, what did not, and whether you would use a different grounding choice next time.',
        },
        {
          title: 'Check the story against the facts',
          duration: '35 min',
          description: 'Learn to distinguish facts, assumptions, and predictions in a stressful interpretation. Generate a balanced alternative that acknowledges uncertainty without forcing positivity. The goal is a more flexible view and a constructive choice, not denying a real problem.',
          practice: 'Use a three-column note: observable facts, my first interpretation, and another plausible interpretation. Choose one small action that would help you learn more.',
        },
        {
          title: 'Recovery, boundaries, and connection',
          duration: '30 min',
          description: 'Resilience is supported by routines, relationships, and boundaries, not just willpower. Identify a restorative activity, a boundary that protects capacity, and a person you can contact. Practice a clear request that says what is happening and what support would help.',
          practice: 'Write a brief support request using: “I am dealing with…; what would help is…; are you available…?” Choose a realistic recovery action for the next 24 hours.',
        },
        {
          title: 'Build a personal coping and support plan',
          duration: '35 min',
          description: 'Bring the skills together in a plan for ordinary stress: early signs, preferred coping choices, supportive contacts, and a review point. Self-guided learning is not enough for every situation. If distress is intense, persistent, or affects safety or daily functioning, contact a qualified local professional or emergency support.',
          practice: 'Complete a one-page plan with early cues, two coping choices, two support contacts, and a local professional or emergency resource you could use if needed.',
        },
      ],
    },
  },
  {
    id: 'habits-and-goals-lab',
    title: 'The Habits & Goals Lab',
    track: 'Habits, focus & goal execution',
    learning_format: 'Applied workshop',
    description: 'A practical workshop for turning a personally meaningful goal into a small, repeatable behavior. Learners build an if-then plan, redesign cues and friction, and use weekly reviews to adapt rather than abandon a plan. The workshop emphasizes realistic experiments over motivation hacks or guaranteed results.',
    duration: '4 sessions · approximately 3 hours',
    level: 'All Levels',
    learning_outcomes: [
      'Choose a self-endorsed goal and define progress in observable terms.',
      'Break a goal into a small action and a specific if-then plan.',
      'Adjust cues, environment, and accountability to reduce avoidable friction.',
      'Use a weekly review to learn from missed actions and revise the plan.',
    ],
    features: ['Four workshop sessions', 'Goal-to-action canvas', 'If-then planning worksheet', 'Weekly review template'],
    prerequisites: 'Bring one goal you care about; it can be personal, learning-related, or professional.',
    target_audience: 'People who want to make steady progress on a meaningful goal without relying on motivation alone.',
    thumbnail_url: 'https://images.pexels.com/photos/33997/pexels-photo.jpg',
    curriculum: {
      version: 1,
      resources: [motivationReference, goalPlanningReference, learningHowToLearnCourse],
      lessons: [
        {
          title: 'Choose a goal you can own',
          duration: '40 min',
          description: 'Start by checking whether the goal matters to you or is mainly driven by external pressure. Define a direction, the reason it matters, and a measure of progress you can influence. Make room to revise a goal when new information changes what is worthwhile.',
          practice: 'Complete a goal canvas with a values link, a controllable progress measure, a “good enough for now” milestone, and one reason you might adapt the goal.',
        },
        {
          title: 'Make the next action unmistakable',
          duration: '45 min',
          description: 'Break a broad outcome into a behavior that can be started in a specific context. Write an implementation intention in if-then form: when the cue happens, then I will do the small action. Keep the first version achievable enough to repeat and meaningful enough to count.',
          practice: 'Write three if-then plans for your chosen goal. Select the one with the clearest cue and smallest useful action, then schedule its first attempt.',
        },
        {
          title: 'Design the environment and support',
          duration: '45 min',
          description: 'Make the desired action easier to begin by preparing materials, placing cues, and reducing unnecessary steps. Identify likely obstacles and plan a fallback action. Invite accountability as support and information, not surveillance or shame.',
          practice: 'Sketch your current environment, remove one source of friction, add one helpful cue, and choose a person or simple tracking method for a supportive check-in.',
        },
        {
          title: 'Review, learn, and adjust',
          duration: '50 min',
          description: 'Use a brief weekly review to record attempts, notice conditions, and choose one adjustment. A missed action is data about the plan and context, not a character judgment. Preserve what worked, shrink or reschedule what did not, and decide whether the goal still deserves your effort.',
          practice: 'Run a seven-day review: what I tried, what helped, what got in the way, what I learned, and one adjustment for next week. Set a review date before leaving the workshop.',
        },
      ],
    },
  },
  {
    id: 'clear-thinking-and-decisions',
    title: 'Clear Thinking: Decisions, Creativity & Problem-Solving',
    track: 'Critical thinking & decision-making',
    learning_format: 'Guided class',
    description: 'A practical class for framing everyday problems, separating evidence from assumptions, generating alternatives, and making thoughtful decisions under uncertainty. Learners use original scenarios and a repeatable decision canvas. It teaches general reasoning skills rather than professional, financial, legal, or medical advice.',
    duration: '5 lessons · approximately 3 hours',
    level: 'All Levels',
    learning_outcomes: [
      'Define a solvable problem and distinguish it from an initial solution idea.',
      'Separate observations, assumptions, and unanswered questions.',
      'Generate multiple options before evaluating them against relevant values and constraints.',
      'Choose a proportionate next step and review what the outcome teaches.',
    ],
    features: ['Five guided lessons', 'Problem-framing canvas', 'Option-generation practice', 'Decision review worksheet'],
    prerequisites: 'No prior experience required. Bring an everyday, low-stakes decision to use for practice.',
    target_audience: 'Learners who want more deliberate problem-solving and decision-making in everyday life.',
    thumbnail_url: 'https://images.pexels.com/photos/7963840/pexels-photo-7963840.jpeg',
    curriculum: {
      version: 1,
      resources: [lifeSkillsReference, learningHowToLearnCourse],
      lessons: [
        {
          title: 'Frame the challenge before solving it',
          duration: '35 min',
          description: 'Describe the situation in observable terms, identify who is affected, and clarify what a useful outcome would look like. Separate the challenge from the first solution that comes to mind. A well-framed question can reveal options that were hidden by a narrow initial framing.',
          practice: 'Write a one-sentence problem statement for a low-stakes issue, list the people and constraints involved, then rewrite it as a question that allows more than one possible solution.',
        },
        {
          title: 'Check evidence, assumptions, and uncertainty',
          duration: '35 min',
          description: 'Sort what you know into observations, interpretations, and unknowns. Look for missing information and consider whose perspective is absent. This is not about eliminating uncertainty; it is about making its role visible before choosing.',
          practice: 'Create three columns for facts, assumptions, and questions about your scenario. Identify one safe, low-cost way to learn more.',
        },
        {
          title: 'Generate options with curiosity',
          duration: '35 min',
          description: 'Delay evaluation long enough to create several different paths, including a small experiment, asking for help, or changing the environment. Use constraints as prompts for creativity, then check that proposed actions are respectful, feasible, and safe.',
          practice: 'Generate at least five distinct options in five minutes. Combine two, then choose one reversible experiment that could teach you something useful.',
        },
        {
          title: 'Make a values-aware decision',
          duration: '40 min',
          description: 'Compare options against your priorities, time, resources, likely consequences, and reversibility. Identify trade-offs instead of searching for a perfect option. For high-impact specialist decisions, use an appropriately qualified professional rather than treating this framework as expert advice.',
          practice: 'Score three options against three criteria you choose. Record the most important trade-off and explain why one next step is proportionate to the stakes.',
        },
        {
          title: 'Try, reflect, and revise',
          duration: '35 min',
          description: 'Turn the decision into a specific next action and a review point. Decide in advance what you will observe and what evidence would lead you to continue, adapt, or stop. A result that differs from your prediction is information for the next decision.',
          practice: 'Write an action, a review date, one sign of progress, and one condition that would make you revise the plan. After the review, note what you learned without scoring yourself as a success or failure.',
        },
      ],
    },
  },
  {
    id: 'communication-and-connection',
    title: 'Communication & Meaningful Connection',
    track: 'Communication & relationships',
    learning_format: 'Mentorship series',
    description: 'A structured practice series for listening well, expressing needs clearly, setting respectful boundaries, and repairing everyday miscommunication. Sessions use original scenarios and reflection prompts. They support skill-building and are not therapy, mediation, or a substitute for specialist help in unsafe relationships.',
    duration: '5 sessions · approximately 3.5 hours',
    level: 'Beginner to Intermediate',
    learning_outcomes: [
      'Demonstrate active listening through reflection, questions, and checking understanding.',
      'Make a clear request using observable facts and a specific next step.',
      'State a boundary while respecting the other person’s agency.',
      'Use a repair conversation and identify when additional support is appropriate.',
    ],
    features: ['Five facilitated sessions', 'Listening practice', 'Request and boundary scripts', 'Conversation reflection guide'],
    prerequisites: 'No prior experience required. Practice scenarios can be adapted or observed rather than role-played.',
    target_audience: 'Learners who want more thoughtful communication at work, at home, or in their communities.',
    thumbnail_url: 'https://images.pexels.com/photos/27381882/pexels-photo-27381882.jpeg',
    curriculum: {
      version: 1,
      resources: [lifeSkillsReference, motivationReference],
      lessons: [
        {
          title: 'Listen to understand, not to win',
          duration: '40 min',
          description: 'Practice attention, open questions, and concise reflection. Listening does not require agreement; it means checking that you understood the other person’s meaning before deciding what to say. Notice assumptions and give the speaker room to correct your summary.',
          practice: 'In a low-stakes conversation, ask one open question, summarize what you heard in your own words, and ask whether you got it right. Reflect on what changed when you slowed down.',
        },
        {
          title: 'Say what you mean with clarity and care',
          duration: '40 min',
          description: 'Use observable facts, your perspective, and a specific request instead of labels or mind-reading. Direct language can be respectful. A request leaves room for the other person to respond; it is different from a demand or an attempt to control their choices.',
          practice: 'Rewrite a vague or blaming sentence as: “When [observable situation], I feel/notice…; would you be willing to…?” Keep the request specific and negotiable.',
        },
        {
          title: 'Boundaries that protect capacity',
          duration: '40 min',
          description: 'A boundary describes what you will do to protect your time, safety, or values; it does not require the other person to agree. Explore concise language, realistic follow-through, and the difference between a boundary and punishment. Safety concerns require appropriate support beyond a class exercise.',
          practice: 'Draft one boundary with the behavior, your limit, and the action you will take. Practice saying it plainly, without over-explaining or threatening.',
        },
        {
          title: 'Navigate disagreement and repair',
          duration: '45 min',
          description: 'Use a pause, clarify the shared issue, identify each person’s concern, and look for a workable next step. When you contribute to a misunderstanding, acknowledge the impact, take responsibility for your part, and ask what repair would be useful without demanding immediate forgiveness.',
          practice: 'Use a fictional scenario to write a repair statement: what happened, your part, the impact you understand, and a concrete change you will try.',
        },
        {
          title: 'Build a relationship practice plan',
          duration: '45 min',
          description: 'Choose one relationship context where a small communication behavior could help. Plan how to listen, make a request, or follow through on a boundary. Connection is mutual: you can control your conduct, not another person’s response. Seek qualified support if a relationship involves coercion or danger.',
          practice: 'Create a two-week practice plan with one behavior, a low-risk opportunity to try it, a reflection question, and a support option if the conversation becomes difficult.',
        },
      ],
    },
  },
  {
    id: 'digital-focus-practice',
    title: 'Digital Focus: Reclaim Your Attention',
    track: 'Focus & attention',
    learning_format: 'Self-paced course',
    description: 'A practical course for noticing where your attention goes, designing focused work blocks, and shaping a calmer digital environment. Learners audit a typical day, plan protected focus time, handle interruptions with a simple capture routine, and review their patterns each week. The course offers general strategies and is not a diagnosis or treatment for attention or concentration conditions.',
    duration: '6 lessons · approximately 3 hours',
    level: 'Beginner',
    learning_outcomes: [
      'Map where your attention goes across a typical day using specific evidence.',
      'Design a focus block with a clear purpose, length, and finish signal.',
      'Reduce avoidable digital interruptions without relying on willpower alone.',
      'Return to a task quickly after an interruption and review your focus patterns weekly.',
    ],
    features: ['Six guided lessons', 'Attention audit worksheet', 'Focus block planner', 'Seven-day interruption experiment'],
    prerequisites: 'No prior experience required. Bring the phone or computer you use most for work or study.',
    target_audience: 'Students, professionals, and anyone who feels scattered by constant notifications and wants a practical plan for deeper focus.',
    thumbnail_url: 'https://images.pexels.com/photos/33997/pexels-photo.jpg',
    intro_video_url: placeholderLessonVideoUrl,
    curriculum: {
      version: 1,
      resources: [motivationReference, learningHowToLearnCourse, lifeSkillsReference],
      lessons: [
        {
          title: 'Audit where your attention goes',
          video_url: placeholderLessonVideoUrl,
          duration: '30 min',
          description: 'Start with observation rather than judgment. Notice which apps, tabs, messages, and people pull your attention during a typical day, and which of those pulls you chose. The goal is an accurate picture of your current pattern, so later changes are based on evidence instead of guilt.',
          practice: 'Over one ordinary workday, log each time you switch tasks. Write what you were doing, what triggered the switch, and whether you chose it.',
        },
        {
          title: 'Notice the cost of switching',
          video_url: placeholderLessonVideoUrl,
          duration: '30 min',
          description: 'Each switch takes time and mental effort, especially when you return to work that required careful thinking. Examine how long it takes you to get back into a task and what you lose in the process. Small switches can add up even when each one feels harmless.',
          practice: 'Choose one task you do often. After an interruption, note how long it takes before you feel oriented again and write the first step you needed to resume.',
        },
        {
          title: 'Design your focus blocks',
          video_url: placeholderLessonVideoUrl,
          duration: '35 min',
          description: 'A focus block works best with a clear purpose, a realistic length, a defined finish signal, and agreed rules about what can interrupt it. Begin with a block you can protect consistently rather than an ideal day that is hard to repeat. Adjust the length based on what you observe.',
          practice: 'Schedule two 45-minute focus blocks for next week. For each one, write the purpose, the single output you want, the interruption rule, and the signal that tells you it is finished.',
        },
        {
          title: 'Shape the environment, not just the mood',
          video_url: placeholderLessonVideoUrl,
          duration: '35 min',
          description: 'Your surroundings can make focus easier or harder. Review notification settings, device placement, app layout, and shared spaces. Reducing friction is more reliable than repeatedly resisting a tempting cue, so look for changes that make the focused choice the easier one.',
          practice: 'For one day, turn off non-essential notifications, move one distracting app out of your main view, and note which changes helped and which created new problems.',
        },
        {
          title: 'Capture, pause, and re-enter',
          video_url: placeholderLessonVideoUrl,
          duration: '35 min',
          description: 'Interruptions will still happen. A capture note lets you park a thought, request, or idea without acting on it immediately. A short re-entry sentence then helps you pick up the original task. This keeps useful ideas without letting every new thought take over your focus.',
          practice: 'Keep a running capture note during one focus block. When something interrupts you, write it down in a few words, then write a re-entry sentence describing your next step.',
        },
        {
          title: 'Review, protect, and adjust your plan',
          video_url: placeholderLessonVideoUrl,
          duration: '30 min',
          description: 'A weekly review turns focus into a system you can improve. Look at what protected your attention, what broke it, and which adjustment to try next. Communicate your focus times to others when needed. If concentration difficulties significantly affect work, study, or daily life, consider speaking with a qualified professional.',
          practice: 'Complete a one-page focus plan with your two most protected blocks, your top three interruption sources, one environment change, and a date for your next review.',
        },
      ],
    },
  },
  {
    id: 'self-improvement-foundations',
    title: 'Self-Improvement Foundations: Small Steps, Lasting Change',
    track: 'Self-improvement & personal development',
    learning_format: 'Self-paced course',
    description: 'An introduction to self-improvement as a practical, ongoing process: clarifying what you want to change, choosing manageable actions, tracking progress honestly, and adjusting without self-criticism. Learners start with an intro talk on self-improvement and build a personal improvement plan through short lessons and weekly reviews. This original course is educational and is not a substitute for professional help.',
    duration: '6 lessons · approximately 3 hours',
    level: 'Beginner',
    learning_outcomes: [
      'Explain self-improvement in terms of observable, personally meaningful changes.',
      'Identify one area for growth and define it in specific, measurable terms.',
      'Choose small, repeatable actions and track them with a simple weekly review.',
      'Respond to setbacks with learning and adjustment instead of self-criticism.',
    ],
    features: ['Intro video talk on self-improvement', 'Six guided lessons', 'Improvement plan worksheet', 'Four-week tracking routine'],
    prerequisites: 'No prior experience required. Bring a notebook or digital journal.',
    target_audience: 'Anyone who wants a practical, realistic approach to personal growth.',
    thumbnail_url: 'https://images.pexels.com/photos/7963840/pexels-photo-7963840.jpeg',
    intro_video_url: protesilaosSelfImprovementVideoUrl,
    curriculum: {
      version: 1,
      resources: [
        motivationReference,
        goalPlanningReference,
        learningHowToLearnCourse,
        protesilaosVideoCredit,
        tqlCredit('tql-masters-r-c', 'This Quantum Life #51 - We Are All Masters'),
        tqlCredit('tql-ladder-r-c', 'This Quantum Life #39 - Building a Ladder to Infinite Possibilities'),
        tqlCredit('tql-resolutions-fail-r-c', 'This Quantum Life #32 - Why Do Resolutions Fail?'),
        tqlCredit('tql-patience-r-c', 'This Quantum Life #47 - Patience As A Spiritual Practice'),
        tqlCredit('tql-setbacks-r-c', 'This Quantum Life #54 - There Are No Setbacks'),
        tqlCredit('tql-relaxing-falling-r-c', 'This Quantum Life #69 - Relaxing While Falling'),
      ],
      lessons: [
        {
          title: 'What self-improvement means to you',
          video_url: tqlMastersVideoUrl,
          duration: '30 min',
          description: 'Define self-improvement as deliberate change toward things you value, not a pursuit of perfection or a comparison with others. Watch the intro talk, then note which ideas feel useful, which feel unclear, and which you want to test in your own life.',
          practice: 'Write your own one-sentence definition of self-improvement. List two things you would like to be different in six months and one thing you would not change.',
        },
        {
          title: 'Choose one area to focus on',
          video_url: tqlLadderVideoUrl,
          duration: '35 min',
          description: 'Narrow a broad wish like “be better” into one domain, such as sleep, learning, relationships, or work habits. Explain why this area matters now and what a good outcome would look like. A narrow focus makes progress visible and reduces overwhelm.',
          practice: 'Rate five possible areas by importance and readiness. Choose one and write a measurable indicator you can check each week.',
        },
        {
          title: 'Turn a wish into a small behavior',
          video_url: tqlResolutionsVideoUrl,
          duration: '35 min',
          description: 'Large goals become easier when they are broken into specific behaviors you can start within a day. Describe the smallest version of the change that still counts, and keep the first step small enough to repeat on a difficult day.',
          practice: 'Write one behavior using the format: “On [day/time], I will [small action] for [length].” Make it smaller if you doubt you can complete it.',
        },
        {
          title: 'Track progress without self-criticism',
          video_url: tqlPatienceVideoUrl,
          duration: '30 min',
          description: 'Simple tracking shows what is working. Record whether you completed the action, what helped, and what got in the way. Treat the record as information for adjusting the plan rather than a score of your worth.',
          practice: 'Track your chosen behavior for seven days using a yes, partly, or no column and one note about the conditions that day.',
        },
        {
          title: 'Adjust when life gets in the way',
          video_url: tqlSetbacksVideoUrl,
          duration: '35 min',
          description: 'Plans tend to stall for predictable reasons: unclear cues, too much effort, competing priorities, or unrealistic expectations. Identify the most likely reason for a setback and choose one adjustment. Shrinking a habit is often more useful than abandoning it.',
          practice: 'Review your tracking notes and write one adjustment: make the action smaller, change the cue, or change the time. Apply it for the next week.',
        },
        {
          title: 'Build your ongoing improvement routine',
          video_url: tqlRelaxingVideoUrl,
          duration: '35 min',
          description: 'Sustainable self-improvement combines regular reflection, a few protected practices, and realistic patience. Decide how often you will review progress and what you will do when progress is slow. Plan the next cycle before you finish this course.',
          practice: 'Complete a one-page improvement plan with your focus area, behavior, weekly review date, support person, and first adjustment for the next cycle.',
        },
      ],
    },
  },
  {
    id: 'mindfulness-for-everyday-stress',
    title: 'Mindfulness for Everyday Stress: Pause, Focus, and Recover',
    track: 'Stress & mindfulness',
    learning_format: 'Guided class',
    description: 'A short guided class introducing mindfulness as a simple attention skill for everyday stress. Learners begin with an intro talk on mindfulness and stress, practice brief orienting pauses, notice their early stress signals, and build a three-minute routine for work or home. The class is educational and non-clinical; it is not a treatment for anxiety, depression, or other conditions.',
    duration: '5 lessons · approximately 2.5 hours',
    level: 'Beginner',
    learning_outcomes: [
      'Describe how stress shows up in attention, body, mood, and behavior.',
      'Use a brief orienting pause during an ordinary moment of pressure.',
      'Notice wandering attention and return to the present without judgment.',
      'Build a short mindfulness routine and adapt it to your schedule.',
    ],
    features: ['Intro video on mindfulness and stress', 'Five guided lessons', 'Guided three-minute pause video', 'Stress signal log'],
    prerequisites: 'No prior experience required. Choose a quiet, safe place for practice, and stop any exercise that feels uncomfortable.',
    target_audience: 'Busy learners who want simple, practical ways to notice and respond to everyday stress.',
    thumbnail_url: 'https://images.pexels.com/photos/40080146/pexels-photo-40080146.jpeg',
    intro_video_url: navyMindfulnessStressVideoUrl,
    curriculum: {
      version: 1,
      resources: [
        lifeSkillsReference,
        navyVideoCredit,
        npsVideoCredit,
        tqlCredit('tql-triggers-r-c', 'This Quantum Life #119 - Triggers and Our Responses'),
        tqlCredit('tql-story-not-aware-r-c', 'This Quantum Life #28 - Are You Living a Story You\'re Not Aware Of?'),
        tqlCredit('tql-choice-trap-r-c', 'This Quantum Life #13 - The Choice Trap'),
        tqlCredit('tql-silence-c', 'This Quantum Life #128 - The Fortress of Silence'),
      ],
      lessons: [
        {
          title: 'Notice how stress shows up',
          video_url: tqlTriggersVideoUrl,
          duration: '30 min',
          description: 'Stress often appears first as small changes in attention, breathing, muscle tension, mood, or habits. Watch the intro talk, then build a simple map of your own early signals. Noticing them early gives you more options than waiting until stress is overwhelming.',
          practice: 'For three days, note up to three early stress signals and the situation that came before each one.',
        },
        {
          title: 'Pause, orient, and choose',
          duration: '25 min',
          description: 'Watch the guided three-minute pause, then try it yourself. Notice your posture and surroundings, take a slower exhale if that feels comfortable, name what is happening, and choose one next action. Stop or adapt the practice if it feels uncomfortable.',
          practice: 'Try a 60-second orienting pause during a low-pressure moment. Write down what changed and what did not.',
          video_url: npsThreeMinutesMindfulnessVideoUrl,
        },
        {
          title: 'Attention is a skill you can practice',
          video_url: tqlStoryVideoUrl,
          duration: '30 min',
          description: 'Attention wanders, and that is normal. Mindfulness practice involves noticing the drift and gently returning to an anchor, such as sounds, your hands, or your breath. Repetition builds the skill over time; a perfectly calm mind is not required.',
          practice: 'Sit or stand comfortably for two minutes and choose one anchor. Each time your attention drifts, note it kindly and return. Record how many times you returned.',
        },
        {
          title: 'Mindfulness at work and at home',
          video_url: tqlChoiceTrapVideoUrl,
          duration: '30 min',
          description: 'Short practices fit into ordinary routines: before a meeting, after a difficult message, or between tasks. Choose two moments where a brief pause would help and decide in advance what you will do during the pause.',
          practice: 'Plan two specific cues for your pause, such as a time, place, or event. Use each cue at least twice this week.',
        },
        {
          title: 'Build a three-minute routine',
          video_url: tqlSilenceVideoUrl,
          duration: '35 min',
          description: 'A sustainable routine is more useful than an occasional long session. Combine a brief pause, one attention practice, and a short reflection. Plan an easier version for busy or difficult days. If stress is intense or persistent, speak with a qualified professional.',
          practice: 'Write a three-minute routine with a cue, a practice, and a reflection question. Also write your easier version for busy or difficult days.',
        },
      ],
    },
  },
  {
    id: 'courage-and-persistence-for-growth',
    title: 'Courage to Grow: Honesty, Persistence & Lasting Habits',
    track: 'Courage & persistence',
    learning_format: 'Guided class',
    description: 'A guided class on the courage and persistence that personal growth requires. Learners begin with an intro talk on vulnerability, examine common self-improvement pitfalls, explore passion and perseverance, and turn effort into repeatable habits. Videos are linked from YouTube and remain the property of their creators. The class is educational and is not a substitute for professional support.',
    duration: '5 sessions · approximately 3 hours',
    level: 'Beginner',
    learning_outcomes: [
      'Describe how vulnerability and honesty support meaningful growth.',
      'Identify common self-improvement pressures and choose growth goals for the right reasons.',
      'Distinguish productive persistence from rigid effort that ignores feedback.',
      'Turn a long-term interest into a routine with a minimum version and a review point.',
    ],
    features: ['Five guided sessions', 'Linked expert talks', 'Growth plan worksheet'],
    prerequisites: 'No prior experience required. Bring a notebook or digital journal and one area of your life you want to develop.',
    target_audience: 'Learners who want to grow steadily and honestly, especially when progress feels hard to sustain.',
    thumbnail_url: 'https://i.ytimg.com/vi/iCvmsMzlF7o/hqdefault.jpg',
    intro_video_url: 'https://www.youtube.com/watch?v=iCvmsMzlF7o',
    curriculum: {
      version: 1,
      introduction: {
        title: 'Introduction: The power of vulnerability',
        video_url: 'https://www.youtube.com/watch?v=iCvmsMzlF7o',
        description: 'Begin with Brené Brown on why honesty and vulnerability are part of growth. Notice where you feel resistance, and carry that question into the sessions that follow.',
        practice: 'Write one area of your life you want to develop and one reason you feel reluctant to be honest about it.',
      },
      resources: [
        motivationReference,
        goalPlanningReference,
      ],
      lessons: [
        {
          title: 'Self-improvement without the pressure',
          video_url: 'https://www.youtube.com/watch?v=wljRiAofFJ8',
          duration: '30 min',
          description: 'Examine common pitfalls of self-improvement, such as chasing an idealized self, comparing yourself with others, and treating growth as a constant demand. Watch the talk, then decide which parts of growth you want to keep and which create pressure without value.',
          practice: 'Write two growth goals you pursue out of pressure and one you pursue out of genuine interest. Note how each one affects your energy over a week.',
        },
        {
          title: 'Passion and perseverance over time',
          video_url: 'https://www.youtube.com/watch?v=H14bBuluwB8',
          duration: '35 min',
          description: 'Look at the difference between short bursts of effort and sustained interest over years. Watch the talk, then distinguish persistence on a goal you value from rigid effort that ignores feedback.',
          practice: 'Pick one long-term interest. Write what has kept your interest over the past year and one sign that would tell you it is time to change direction.',
        },
        {
          title: 'Turning effort into a lasting habit',
          video_url: 'https://www.youtube.com/watch?v=1TQ4gezRQh4',
          duration: '35 min',
          description: 'Translate perseverance into everyday routines by making effort repeatable, connecting it to purpose, and noticing when a plan needs adjusting rather than abandoning. Watch the interview, then consider which habit could support your chosen interest.',
          practice: 'Design a weekly routine for your chosen interest with a fixed time, a minimum version for hard weeks, and a check-in on the last day of the week.',
        },
        {
          title: 'The courage to be honest about the hard parts',
          video_url: 'https://www.youtube.com/watch?v=QijH4UAqGD8',
          duration: '35 min',
          description: 'Growth often requires admitting what is uncomfortable: a habit you avoid, feedback you have not asked for, or a belief that holds you back. Revisit the intro talk on vulnerability, watch Luvvie Ajayi Jones on speaking hard truths, then practice naming the difficulty clearly and without shame.',
          practice: 'Write one uncomfortable truth about your growth area and one small, honest step you can take this week. Share it with one trusted person if that feels safe.',
        },
        {
          title: 'Integrate and plan your next cycle',
          video_url: 'https://www.youtube.com/watch?v=_X0mgOOSpLU',
          duration: '35 min',
          description: 'Watch Carol Dweck on the growth mindset, then bring the course together by reviewing your chosen interest, routine, honest reflections, and the sources of pressure you noticed. Decide how you will continue after the course, including when you will review progress and what support you will ask for.',
          practice: 'Complete a one-page growth plan with your focus area, routine, one courage practice, a support person, and a review date four weeks from now.',
        },
      ],
    },
  },
  {
    id: 'overcoming-procrastination-workshop',
    title: 'Overcoming Procrastination: Start, Forgive, Follow Through',
    track: 'Action & self-management',
    learning_format: 'Applied workshop',
    description: 'A practical workshop for understanding why important tasks get postponed and how to start again with less self-criticism. Learners begin with an intro talk on procrastination, examine the role of self-compassion and motivation, shrink a stalled task into a first step, and review progress weekly. Videos are linked from YouTube and remain the property of their creators. The workshop is educational and is not a substitute for professional support.',
    duration: '5 sessions · approximately 3 hours',
    level: 'Beginner',
    learning_outcomes: [
      'Describe how avoidance and self-criticism can keep a task stalled.',
      'Respond to a missed step with a kind, realistic restart routine.',
      'Connect a postponed task to choice, skill-building, and purpose.',
      'Break a stalled task into a first step and review follow-through each week.',
    ],
    features: ['Intro talk on procrastination', 'Five facilitated sessions', 'Linked expert talks', 'Weekly follow-through log'],
    prerequisites: 'No prior experience required. Bring one task you have been postponing and a notebook or digital journal.',
    target_audience: 'Students, professionals, and anyone who knows what they want to do but keeps delaying it.',
    thumbnail_url: 'https://i.ytimg.com/vi/arj7oStGLkU/hqdefault.jpg',
    intro_video_url: 'https://www.youtube.com/watch?v=arj7oStGLkU',
    curriculum: {
      version: 1,
      introduction: {
        title: 'Introduction: Why we delay',
        video_url: 'https://www.youtube.com/watch?v=arj7oStGLkU',
        description: 'Begin with Tim Urban’s TED talk on procrastination. Notice which parts describe your own patterns and which parts you want to test in the sessions that follow.',
        practice: 'Write down one task you keep postponing and the story you tell yourself about why it is still not done.',
      },
      resources: [
        motivationReference,
        goalPlanningReference,
        {
          title: 'TED Talk: Inside the mind of a master procrastinator (Tim Urban)',
          url: 'https://www.ted.com/talks/tim_urban_inside_the_mind_of_a_master_procrastinator',
          type: 'reference' as const,
        },
      ],
      lessons: [
        {
          title: 'Replace self-criticism with self-compassion',
          video_url: 'https://www.youtube.com/watch?v=IvtZBUSplr4',
          duration: '30 min',
          description: 'Kristin Neff contrasts self-esteem with self-compassion and explains why treating yourself kindly can be more sustaining than evaluating yourself as good or bad. Harsh self-judgment after a delay can make the next step feel even more threatening, so watch the talk and notice how you speak to yourself when a task slips.',
          practice: 'The next time you postpone something, write the sentence you usually say to yourself, then rewrite it the way you would speak to a good friend.',
        },
        {
          title: 'Find the reason behind the task',
          video_url: 'https://www.youtube.com/watch?v=rrkrvAUbU9Y',
          duration: '30 min',
          description: 'Dan Pink describes autonomy, mastery, and purpose as core drivers of engagement, and explains why external rewards do not always help with complex work. Use the talk to examine whether a delayed task feels self-chosen, meaningful, and a chance to get better at something.',
          practice: 'For one postponed task, write how you could make it more your own choice, which skill it would build, and why it matters to you. Test one change today.',
        },
        {
          title: 'Restart with kindness after a missed step',
          video_url: 'https://www.youtube.com/watch?v=11U0h0DPu7k',
          duration: '35 min',
          description: 'Kristin Neff’s three components of self-compassion are kindness toward yourself, a sense of common humanity, and mindfulness of difficult feelings. Use them as a restart routine when a plan slips, so the next action comes from clarity rather than guilt.',
          practice: 'After a missed step, write one kind sentence to yourself, one line acknowledging that many people struggle with this, and one observation of the feeling without acting on it yet. Then choose the smallest next action.',
        },
        {
          title: 'Shrink the first step',
          duration: '35 min',
          description: 'Large tasks stall when the first action is vague. Break the task into a first step that can begin in five minutes or less, decide where and when it will happen, and plan a smaller backup version for a difficult day. Starting is often easier when the next action is concrete and visible.',
          practice: 'Choose one postponed task. Write a first action that takes five minutes or less, the time and place you will do it, and a smaller backup version you will use if you feel stuck.',
        },
        {
          title: 'Review, adjust, and follow through',
          duration: '40 min',
          description: 'Use a short weekly review to see what helped you start and what delayed you again. Adjust one variable at a time: task size, timing, environment, or support. A missed start is information for the next plan, not proof that you cannot follow through.',
          practice: 'Complete a one-week follow-through log. Record each planned start, whether it happened, the main obstacle, and one adjustment for the following week.',
        },
      ],
    },
  },
  {
    id: 'gratitude-in-everyday-life',
    title: 'Gratitude in Everyday Life: Noticing, Expressing, Sustaining',
    track: 'Gratitude & positive outlook',
    learning_format: 'Applied workshop',
    description: 'A practical workshop on gratitude as a skill you can practice: noticing good things, understanding what the research says, expressing appreciation to others, and sustaining the habit over time. Learners begin with an intro talk from a leading gratitude researcher and complete five sessions that combine short talks with written practice. Videos are linked from YouTube and remain the property of their creators. The workshop is educational and is not a substitute for professional support.',
    duration: '5 sessions · approximately 3 hours',
    level: 'Beginner',
    learning_outcomes: [
      'Explain what gratitude is and how it differs from politeness or obligation.',
      'Connect a gratitude practice to work, study, and everyday energy.',
      'Practice gratitude in both ordinary and difficult moments without forcing positivity.',
      'Express appreciation to people and build a daily gratitude routine you can sustain.',
    ],
    features: ['Intro talk from a leading gratitude researcher', 'Five sessions with linked talks', 'Daily gratitude routine', 'Thank-you practice'],
    prerequisites: 'No prior experience required. Bring a notebook or digital journal.',
    target_audience: 'Anyone who wants a practical, evidence-informed way to feel more appreciation and connection in daily life.',
    thumbnail_url: 'https://i.ytimg.com/vi/RRrnfGf5aWE/hqdefault.jpg',
    intro_video_url: 'https://www.youtube.com/watch?v=RRrnfGf5aWE',
    curriculum: {
      version: 1,
      introduction: {
        title: 'Introduction: What gratitude does',
        video_url: 'https://www.youtube.com/watch?v=RRrnfGf5aWE',
        description: 'Begin with Robert Emmons, one of the leading researchers on gratitude, on how the practice relates to health, happiness, and connection. Notice which claims seem plausible in your own life and which you want to test.',
        practice: 'List three good things from the past week that you received, learned, or noticed without having earned them.',
      },
      resources: [
        lifeSkillsReference,
        {
          title: 'Greater Good Science Center: The Benefits of Gratitude',
          url: 'https://greatergood.berkeley.edu/video/item/the_benefits_of_gratitude',
          type: 'reference' as const,
        },
      ],
      lessons: [
        {
          title: 'What gratitude is',
          video_url: 'https://www.youtube.com/watch?v=pdLRNnrxQAw',
          duration: '30 min',
          description: 'Robert Emmons explains what gratitude is and why it is worth practicing. Use the talk to define gratitude in your own words and notice how it differs from politeness or a sense of obligation.',
          practice: 'Write a definition of gratitude in your own words. Then list one good thing you received this week and the person, situation, or effort that made it possible.',
        },
        {
          title: 'Gratitude at work and in your energy',
          video_url: 'https://www.youtube.com/watch?v=fLJsdqxnZb0',
          duration: '30 min',
          description: 'Shawn Achor argues that happiness can fuel productivity rather than simply following success. Use his argument to examine whether your gratitude practice supports your work, study, and energy.',
          practice: 'Choose one work or study task. Before starting, write one thing you appreciate about the task or the people involved, then note how your focus feels afterward.',
        },
        {
          title: 'Cultivating gratitude in different situations',
          video_url: 'https://www.youtube.com/watch?v=8964envYh58',
          duration: '35 min',
          description: 'Robert Emmons describes how to be grateful across many types of situations, including ordinary days and difficult ones. Choose a gratitude focus that fits the situation rather than forcing a positive feeling.',
          practice: 'Choose one ordinary moment and one difficult moment this week. For each, write a grateful observation that is honest rather than forced.',
        },
        {
          title: 'A personal story of gratitude',
          video_url: 'https://www.youtube.com/watch?v=_fmQ03UELo0',
          duration: '30 min',
          description: 'Jana Shelfer’s TEDxEustis talk, Radical gratitude, offers a personal account of gratitude as a practice. Watch for the concrete moments and choices she describes, then identify which one applies to your life.',
          practice: 'Write a short gratitude story from your own life: the event, what you received, and how you have shown appreciation since.',
        },
        {
          title: 'Turning gratitude into a lasting habit',
          video_url: 'https://www.youtube.com/watch?v=e8HH4XHbEkk',
          duration: '35 min',
          description: 'Shannon Shallcross’s TEDxProvidence talk, What Happens When You Harness The Power of Gratitude, examines what changes when gratitude is practiced deliberately. Use it to plan how you will sustain your practice after the workshop.',
          practice: 'Create a two-minute daily routine with a fixed cue, one written entry, and one person you will thank this week.',
        },
      ],
    },
  },
  {
    id: 'confident-communication-workshop',
    title: 'Confident Communication: Listen, Speak Up, Tell Your Story',
    track: 'Communication & confidence',
    learning_format: 'Applied workshop',
    description: 'A practical workshop for listening well, speaking up when it matters, and shaping your message so people remember it. Learners begin with an intro talk on how we speak, then complete three sessions that combine short talks with speaking and listening practice. Videos are linked from YouTube and remain the property of their creators. The workshop is educational and is not a substitute for professional coaching or therapy.',
    duration: '3 sessions · approximately 2 hours',
    level: 'Beginner to Intermediate',
    learning_outcomes: [
      'Listen in a way that helps the other person feel understood.',
      'Name an idea you have been holding back and take a low-risk step to share it.',
      'Shape an everyday experience into a short, clear story with a point.',
    ],
    features: ['Intro talk on speaking so people listen', 'Three sessions with linked talks', 'Listening and speaking practice', 'Story-shaping exercise'],
    prerequisites: 'No prior experience required. Bring one conversation you would like to handle better and one idea you have been reluctant to share.',
    target_audience: 'Students, professionals, and anyone who wants to be heard more clearly and more confidently.',
    thumbnail_url: 'https://i.ytimg.com/vi/eIho2S0ZahI/hqdefault.jpg',
    intro_video_url: 'https://www.youtube.com/watch?v=eIho2S0ZahI',
    curriculum: {
      version: 1,
      introduction: {
        title: 'Introduction: How we speak and whether people listen',
        video_url: 'https://www.youtube.com/watch?v=eIho2S0ZahI',
        description: 'Begin with Julian Treasure on the habits that make people stop listening and the vocal qualities that help them stay engaged. Notice one habit from the talk that you use often.',
        practice: 'Record a short voice note describing one idea. Listen back and write down one word or habit you would like to change.',
      },
      resources: [
        lifeSkillsReference,
        {
          title: 'TED Talk: How to speak so that people want to listen (Julian Treasure)',
          url: 'https://www.ted.com/talks/julian_treasure_how_to_speak_so_that_people_want_to_listen',
          type: 'reference' as const,
        },
      ],
      lessons: [
        {
          title: 'Listen so people feel heard',
          video_url: 'https://www.youtube.com/watch?v=R1vskiVDwl4',
          duration: '40 min',
          description: 'Celeste Headlee offers practical tips for having a better conversation. Use the talk to notice where your attention drifts during a conversation and what you do instead of listening.',
          practice: 'In your next conversation, ask one open question and summarize what you heard before responding. Note how the other person reacts.',
        },
        {
          title: 'Speak up even when you do not want to',
          video_url: 'https://www.youtube.com/watch?v=fkOMupkw5D8',
          duration: '40 min',
          description: 'Sarah Crawford-Bohl’s talk, How to Speak Up, addresses sharing your view when it feels uncomfortable. Use it to identify the idea you have been holding back and the thought that keeps you quiet.',
          practice: 'Write the idea you have been holding back, the fear connected to it, and one low-risk sentence you could say in your next meeting or conversation.',
        },
        {
          title: 'Shape your message as a story',
          video_url: 'https://www.youtube.com/watch?v=enzuCJNA3Qg',
          duration: '40 min',
          description: 'Matthew Dicks’s TEDxBerkshires talk, What is a Story?, explores what makes a story work and why stories help ideas stick. Use it to turn an everyday experience into a clear narrative with a point.',
          practice: 'Tell one true two-minute story from your week with a clear moment of change. Then cut any detail that does not serve the point.',
        },
      ],
    },
  },
  {
    id: 'sleep-and-energy-for-everyday-life',
    title: 'Sleep and Energy for Everyday Life: Rest, Recover, Renew',
    track: 'Wellbeing & energy',
    learning_format: 'Applied workshop',
    description: 'A practical workshop on how sleep shapes mood, focus, and energy, and what you can change in your routine. Learners begin with an intro talk on the science of sleep, then complete four sessions that combine short talks with a sleep log, a wind-down routine, daytime recovery breaks, and a plan for stress that keeps you awake. Videos are linked from YouTube and remain the property of their creators. The workshop is educational and is not a substitute for medical care; speak with a clinician about persistent sleep problems.',
    duration: '5 sessions · approximately 3 hours',
    level: 'Beginner',
    learning_outcomes: [
      'Describe how short or irregular sleep affects mood, patience, and emotional reactions.',
      'Set a consistent target bedtime and a wind-down routine you can keep most nights.',
      'Plan short recovery breaks that help keep energy steady through the day.',
      'Name the stress or worry that interferes with rest and choose one supportive next step.',
    ],
    features: ['Intro talk on the science of sleep', 'Four sessions with linked talks', 'Seven-day sleep and mood log', 'Daytime recovery break practice'],
    prerequisites: 'No prior experience required. Bring a notebook or phone notes app and an honest estimate of your sleep over the past week.',
    target_audience: 'Students, office and shift workers, and anyone who feels tired or irritable more often than they would like.',
    thumbnail_url: 'https://i.ytimg.com/vi/5MuIMqhT8DM/hqdefault.jpg',
    intro_video_url: 'https://www.youtube.com/watch?v=5MuIMqhT8DM',
    curriculum: {
      version: 1,
      introduction: {
        title: 'Introduction: Why sleep shapes how you feel',
        video_url: 'https://www.youtube.com/watch?v=5MuIMqhT8DM',
        description: 'Begin with the TED talk Sleep Is Your Superpower by sleep scientist Matt Walker. Notice which effects of sleep you already see in your own days and which you want to examine more closely in the sessions.',
        practice: 'Write down how you slept last night and how you felt at 3 p.m. yesterday. Note whether any pattern repeats across the week.',
      },
      resources: [
        lifeSkillsReference,
      ],
      lessons: [
        {
          title: 'How sleep shapes your emotions',
          video_url: 'https://www.youtube.com/watch?v=6F8wFkScnME',
          duration: '30 min',
          description: 'This TED Sleeping with Science episode explains how sleep affects the brain’s emotional centers, which can make irritability and stress feel stronger after a short night. Use it to connect your mood with how much you slept.',
          practice: 'For the next seven days, log your bedtime, wake time, and a one-word mood rating each morning. Look for a link between short nights and difficult days.',
        },
        {
          title: 'Making sleep a priority',
          video_url: 'https://www.youtube.com/watch?v=nncY-MA1Iu8',
          duration: '30 min',
          description: 'Arianna Huffington argues that sleep improves productivity, happiness, and decision-making, and that treating it as optional costs more than it saves. Use her argument to examine whether your schedule reflects what you say matters to you.',
          practice: 'Choose one target bedtime for the coming week and set a reminder 30 minutes before it. Write what you expect to gain from keeping that time.',
        },
        {
          title: 'Rest and recovery during the day',
          video_url: 'https://www.youtube.com/watch?v=MklZJprP5F0',
          duration: '30 min',
          description: 'Sara Mednick, a sleep researcher, makes the case for deliberate rest and restorative breaks during the day rather than pushing through fatigue. Use the talk to find where short recovery periods could fit into your schedule.',
          practice: 'Schedule two five-minute recovery breaks tomorrow without a screen. Rate your energy before and after each one.',
        },
        {
          title: 'Stress and worry that keep you awake',
          video_url: 'https://www.youtube.com/watch?v=RcGyVTAoXEU',
          duration: '35 min',
          description: 'Kelly McGonigal reframes stress as something that can help you meet challenges, and describes how reaching out to others can change how stress affects you. Use her framing when worry is cutting into your rest or your energy.',
          practice: 'Write one worry that is affecting your sleep, one more helpful way to see it, and one person you could talk to about it this week.',
        },
      ],
    },
  },
  {
    id: 'self-awareness-for-clearer-choices',
    title: 'Self-Awareness for Clearer Choices: See Yourself More Accurately',
    track: 'Self-awareness & emotions',
    learning_format: 'Applied workshop',
    description: 'A practical workshop on seeing yourself more accurately: how your inner voice shapes your thinking, how to name emotions precisely, and how to notice the feelings behind reactions that seem out of proportion. Learners begin with an intro talk on why self-awareness is harder than it looks, then complete five sessions that combine short talks with written reflection and a one-week practice. Videos are linked from YouTube and remain the property of their creators. The workshop is educational and is not a substitute for therapy or counselling; speak with a qualified professional if shame or distress is affecting your daily life.',
    duration: '5 sessions · approximately 2.5 hours',
    level: 'Beginner',
    learning_outcomes: [
      'Explain why reflecting on yourself does not always produce accurate self-knowledge.',
      'Notice when your inner voice gets stuck in a loop and turn it into a more useful question.',
      'Name emotions precisely and treat them as information about what matters to you.',
      'Recognize the fear or shame behind a reaction and respond to it with honesty.',
    ],
    features: [
      'Intro talk on the limits of introspection',
      'Five sessions with linked TED talks',
      'Written reflection prompts each session',
      'One-week practice for each session',
    ],
    prerequisites: 'No prior experience required. Bring a notebook or notes app and be ready to write honest, private reflections.',
    target_audience: 'Students, new managers, and anyone who wants a clearer picture of their reactions, habits, and priorities.',
    thumbnail_url: 'https://i.ytimg.com/vi/tGdsOXZpyWE/hqdefault.jpg',
    intro_video_url: 'https://www.youtube.com/watch?v=tGdsOXZpyWE',
    curriculum: {
      version: 1,
      introduction: {
        title: 'Introduction: Why self-awareness is harder than it looks',
        video_url: 'https://www.youtube.com/watch?v=tGdsOXZpyWE',
        description: 'Begin with organizational psychologist Tasha Eurich’s TEDx talk on self-awareness. She argues that most people overestimate how well they see themselves and suggests a simple shift in how to reflect. Notice where you feel most confident about your own picture and where you might be less certain.',
        practice: 'Write two sentences describing how you think others see you at work or school, and one situation where you suspect your view of yourself may differ from theirs.',
      },
      resources: [lifeSkillsReference],
      lessons: [
        {
          title: 'Your inner voice and the loops it creates',
          video_url: 'https://www.youtube.com/watch?v=xb0nLpdWttA',
          duration: '30 min',
          description: 'Psychologist Ethan Kross explains how the inner voice helps us reflect and plan, and how it can trap us in negative thought loops he calls chatter. He shares ways to quiet unhelpful self-talk and use it to regain focus and confidence. Use his framing to notice when your own inner commentary is helping and when it is circling.',
          practice: 'For three days, write down one moment when your inner voice got stuck. Then rewrite the question you were asking yourself as a “what” question, such as “What can I do next?” instead of “Why am I like this?”',
        },
        {
          title: 'Naming emotions accurately',
          video_url: 'https://www.youtube.com/watch?v=NDQ1Mi5I4rg',
          duration: '30 min',
          description: 'Psychologist Susan David describes emotional agility: staying curious about your emotions and choosing actions that match your values. She explains that labeling emotions accurately helps you identify their causes, and that emotions are data rather than directives. Use her approach to see how vague feelings can become clearer.',
          practice: 'Each evening this week, name the strongest emotion you felt that day in one precise word. Next to it, write one value-based step that emotion might point you toward.',
        },
        {
          title: 'Shame and the reactions behind them',
          video_url: 'https://www.youtube.com/watch?v=psN1DORYYV0',
          duration: '30 min',
          description: 'Researcher Brené Brown discusses shame as an often unspoken force behind harmful behavior, and explores how people can confront it directly rather than hide from it. Use her perspective to examine reactions that seem bigger than the situation.',
          practice: 'Choose one reaction this week that felt out of proportion. Write what you feared others would think of you, then write one honest, compassionate sentence you could say to yourself about it.',
        },
        {
          title: 'Remembering an experience versus living it',
          video_url: 'https://www.youtube.com/watch?v=XgRlrBl-7Yg',
          duration: '30 min',
          description: 'Nobel laureate Daniel Kahneman shows that the way we judge an experience afterward can differ from how it felt as it happened. He looks at how memory summarizes a stretch of time and how that summary can steer decisions about our own lives. Use his examples to question whether your verdict on a past event matches what you actually lived through.',
          practice: 'After each significant day this week, rate how it felt while it was happening and separately how you would sum it up later. Note where the two differ and what you think shaped the memory.',
        },
        {
          title: 'Traits, goals, and the self you choose',
          video_url: 'https://www.youtube.com/watch?v=qYvXk_bqlBk',
          duration: '30 min',
          description: 'Psychologist Brian Little explores how traits describe personality while people still step outside their usual patterns when a goal or situation calls for it. He points out that personality is more flexible than many of us assume. Use his perspective to test whether a trait you consider fixed is really as rigid as you think.',
          practice: 'Pick one trait you believe describes you and one recent situation where you acted against it. Write what the situation asked of you and what that suggests about your flexibility.',
        },
      ],
    },
  },
];
