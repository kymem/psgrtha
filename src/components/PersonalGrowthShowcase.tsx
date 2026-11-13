import { ArrowRight, BookOpen, CheckCircle, Clock3, Sparkles } from 'lucide-react';
import { PERSONAL_GROWTH_BLUEPRINTS, type PersonalGrowthBlueprint } from '../lib/personalGrowthCourses';

interface PersonalGrowthShowcaseProps {
  onPrepare: (blueprint: PersonalGrowthBlueprint) => void;
}

export default function PersonalGrowthShowcase({ onPrepare }: PersonalGrowthShowcaseProps) {
  return (
    <section className="mb-10 overflow-hidden rounded-3xl border border-purple-300/15 bg-gradient-to-br from-purple-950/80 via-slate-900 to-rose-950/60">
      <div className="grid gap-8 p-6 sm:p-8 lg:grid-cols-[0.8fr_1.2fr] lg:p-10">
        <div className="flex flex-col justify-center">
          <div className="mb-4 flex w-fit items-center gap-2 rounded-full border border-rose-300/20 bg-rose-300/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-rose-200">
            <Sparkles className="h-4 w-4" /> Personal Growth Studio
          </div>
          <h2 className="font-playfair text-3xl font-bold text-white sm:text-4xl">Growth you can put into practice.</h2>
          <p className="mt-4 max-w-xl text-sm leading-7 text-slate-300 sm:text-base">
            Explore original, skill-based learning paths in self-awareness, emotional coping, habits, and meaningful relationships. Every blueprint includes a complete lesson sequence, practice activity, learning outcomes, and source notes.
          </p>
          <div className="mt-6 grid grid-cols-2 gap-3 text-sm text-slate-200">
            {['Self-awareness & purpose', 'Emotional coping skills', 'Habits & goal practice', 'Critical thinking & decisions', 'Communication & connection'].map((track) => (
              <div key={track} className="flex items-start gap-2">
                <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-rose-300" />
                <span>{track}</span>
              </div>
            ))}
          </div>
          <p className="mt-6 text-xs leading-5 text-slate-400">
            Curriculum is original and informed by WHO life-skills guidance, Self-Determination Theory, and implementation-intention research. External courses are independent recommendations; provider access and pricing may vary. These resources are not therapy or clinical care.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {PERSONAL_GROWTH_BLUEPRINTS.map((blueprint) => (
            <article key={blueprint.id} className="flex flex-col rounded-2xl border border-white/10 bg-slate-950/45 p-5">
              <div className="-mx-5 -mt-5 mb-4 aspect-video overflow-hidden rounded-t-2xl bg-slate-800">
                <img src={blueprint.thumbnail_url} alt="" loading="lazy" className="h-full w-full object-cover" />
              </div>
              <div className="mb-3 flex items-center justify-between gap-2">
                <span className="rounded-full bg-purple-300/10 px-2.5 py-1 text-xs font-medium text-purple-200">{blueprint.track}</span>
                <span className="text-xs text-slate-400">{blueprint.learning_format}</span>
              </div>
              <h3 className="text-lg font-semibold leading-snug text-white">{blueprint.title}</h3>
              <p className="mt-2 line-clamp-3 text-sm leading-6 text-slate-300">{blueprint.description}</p>
              <div className="mt-4 flex items-center gap-4 text-xs text-slate-400">
                <span className="flex items-center gap-1.5"><BookOpen className="h-4 w-4" />{blueprint.curriculum.lessons.length} lessons</span>
                <span className="flex items-center gap-1.5"><Clock3 className="h-4 w-4" />{blueprint.duration.split('·')[1]?.trim() || blueprint.duration}</span>
              </div>
              <details className="group mt-4 border-t border-white/10 pt-3">
                <summary className="cursor-pointer list-none text-sm font-medium text-rose-200 hover:text-rose-100">
                  Preview lessons <span className="ml-1 inline-block transition-transform group-open:rotate-90">›</span>
                </summary>
                <ol className="mt-3 space-y-3">
                  {blueprint.curriculum.lessons.map((lesson, index) => (
                    <li key={lesson.title} className="rounded-xl bg-white/[0.04] p-3">
                      <p className="text-sm font-medium text-white">{index + 1}. {lesson.title}<span className="ml-2 text-xs font-normal text-slate-400">{lesson.duration}</span></p>
                      <p className="mt-1 text-xs leading-5 text-slate-300">{lesson.description}</p>
                      <p className="mt-2 text-xs leading-5 text-purple-200"><span className="font-semibold">Practice:</span> {lesson.practice}</p>
                    </li>
                  ))}
                </ol>
                <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2">
                  {blueprint.curriculum.resources.map((resource) => (
                    <a key={resource.url} href={resource.url} target="_blank" rel="noreferrer" className="text-xs text-sky-300 underline decoration-sky-300/40 underline-offset-4 hover:text-sky-200">
                      {resource.type === 'course' ? 'Recommended course' : 'Source'}: {resource.title}
                    </a>
                  ))}
                </div>
              </details>
              <button
                type="button"
                onClick={() => onPrepare(blueprint)}
                className="mt-5 flex items-center justify-between rounded-xl bg-gradient-to-r from-rose-500 to-purple-600 px-4 py-3 text-left text-sm font-semibold text-white transition hover:brightness-110"
              >
                Prefill Supabase course form <ArrowRight className="h-4 w-4" />
              </button>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
