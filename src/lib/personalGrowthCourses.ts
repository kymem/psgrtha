export interface CourseLesson {
  title: string;
  duration: string;
  description: string;
  practice: string;
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
];
