import { useCallback, useEffect, useState } from 'react';
import { ArrowLeft, ArrowRight, CalendarDays, Clock3, MapPin } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import { toYouTubeContentUrl } from '../lib/masterclassVideo';
import { PERSONAL_GROWTH_BLUEPRINTS, type PersonalGrowthBlueprint } from '../lib/personalGrowthCourses';

type ClassProgram = {
  id: string;
  created_by: string;
  blueprint_id: string | null;
  title: string;
  description: string;
  starts_at: string | null;
  timezone: string | null;
  location_type: string;
  location_details: string | null;
  curriculum: PersonalGrowthBlueprint['curriculum'];
};

type ClassItem = {
  kind: 'session' | 'talk';
  title: string;
  description?: string;
  practice?: string;
  duration?: string;
  embedUrl: string | null;
  videoUrl?: string;
};

export default function PersonalGrowthClass() {
  const { programId, itemIndex } = useParams<{ programId: string; itemIndex?: string }>();
  const { user } = useAuth();
  const [program, setProgram] = useState<ClassProgram | null>(null);
  const [hasAccess, setHasAccess] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchClass = useCallback(async () => {
    if (!programId || !user) return;
    setLoading(true);
    setError(null);
    try {
      const { data, error: fetchError } = await supabase
        .from('personal_growth_workshops')
        .select('id, created_by, blueprint_id, title, description, starts_at, timezone, location_type, location_details, curriculum')
        .eq('id', programId)
        .single();
      if (fetchError) throw fetchError;

      const { data: registration, error: registrationError } = await supabase
        .from('personal_growth_workshop_registrations')
        .select('id')
        .eq('workshop_id', programId)
        .eq('user_id', user.id)
        .eq('status', 'registered')
        .maybeSingle();
      if (registrationError) throw registrationError;

      const saved = data as ClassProgram;
      const blueprint = PERSONAL_GROWTH_BLUEPRINTS.find((item) => item.id === saved.blueprint_id);
      setProgram({ ...saved, curriculum: blueprint?.curriculum ?? saved.curriculum });
      setHasAccess(Boolean(registration) || saved.created_by === user.id);
    } catch (fetchError) {
      setError(fetchError instanceof Error ? fetchError.message : 'Could not load this class.');
    } finally {
      setLoading(false);
    }
  }, [programId, user]);

  useEffect(() => {
    fetchClass();
  }, [fetchClass]);

  if (loading) {
    return <div className="mx-auto max-w-3xl px-4 pb-16 pt-28 text-sm text-gray-400">Loading class...</div>;
  }

  if (error || !program) {
    return (
      <div className="mx-auto max-w-3xl space-y-4 px-4 pb-16 pt-28 text-white">
        <p role="alert" className="rounded-lg border border-rose-400/30 bg-rose-500/10 p-3 text-sm text-rose-200">{error || 'This class could not be found.'}</p>
        <Link to="/masterclass" className="inline-flex items-center gap-2 text-sm text-gray-300 hover:text-white"><ArrowLeft className="h-4 w-4" />Back to Masterclass</Link>
      </div>
    );
  }

  const classUrl = `/personal-growth/classes/${program.id}`;
  const joinLink = program.location_details && /^https?:\/\//i.test(program.location_details.trim())
    ? program.location_details.trim()
    : null;
  const sessions: ClassItem[] = (program.curriculum?.lessons || []).map((lesson) => ({
    kind: 'session',
    title: lesson.title,
    description: lesson.description,
    practice: lesson.practice,
    duration: lesson.duration,
    embedUrl: lesson.video_url ? toYouTubeContentUrl(lesson.video_url) : null,
    videoUrl: lesson.video_url,
  }));
  const talkResources = (program.curriculum?.resources || []).filter((resource) => toYouTubeContentUrl(resource.url));
  const talks: ClassItem[] = talkResources.map((resource) => ({
    kind: 'talk',
    title: resource.title,
    embedUrl: toYouTubeContentUrl(resource.url),
    videoUrl: resource.url,
  }));
  const furtherReading = (program.curriculum?.resources || []).filter((resource) => !toYouTubeContentUrl(resource.url));
  const items = [...sessions, ...talks];

  const header = (
    <>
      <Link to={itemIndex === undefined ? '/masterclass' : classUrl} className="inline-flex items-center gap-2 text-sm text-gray-300 hover:text-white">
        <ArrowLeft className="h-4 w-4" />{itemIndex === undefined ? 'Back to Masterclass' : 'Back to class'}
      </Link>
    </>
  );

  if (!hasAccess) {
    return (
      <div className="mx-auto max-w-3xl space-y-8 px-4 pb-16 pt-28 text-white">
        {header}
        <header className="space-y-3">
          <h1 className="text-3xl font-semibold">{program.title}</h1>
          <p className="text-sm leading-6 text-gray-300">{program.description}</p>
        </header>
        <section className="glass-effect space-y-3 rounded-2xl p-6 text-sm text-gray-300">
          <p>Register for this class to see the joining link and videos.</p>
          <Link to="/masterclass" className="inline-flex items-center gap-2 font-medium text-rose-200 hover:text-white">Go to Masterclass to register<ArrowRight className="h-4 w-4" /></Link>
        </section>
      </div>
    );
  }

  if (itemIndex !== undefined) {
    const index = Number(itemIndex);
    const item = items[index];
    if (!item) {
      return (
        <div className="mx-auto max-w-3xl space-y-4 px-4 pb-16 pt-28 text-white">
          {header}
          <p className="text-sm text-gray-300">This session could not be found.</p>
        </div>
      );
    }
    const position = item.kind === 'session' ? index + 1 : index - sessions.length + 1;
    const total = item.kind === 'session' ? sessions.length : talks.length;
    const previous = items[index - 1];
    const next = items[index + 1];

    return (
      <div className="mx-auto max-w-3xl space-y-8 px-4 pb-16 pt-28 text-white">
        {header}
        <header className="space-y-2">
          <p className="text-xs font-medium uppercase tracking-wide text-purple-200">{item.kind === 'session' ? 'Session' : 'Talk'} {position} of {total}</p>
          <h1 className="text-3xl font-semibold">{item.title}</h1>
          {item.duration && <p className="flex items-center gap-2 text-sm text-gray-400"><Clock3 className="h-4 w-4" />{item.duration}</p>}
        </header>

        {item.embedUrl ? (
          <div className="aspect-video overflow-hidden rounded-xl bg-black">
            <iframe src={item.embedUrl} title={item.title} className="h-full w-full" allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen />
          </div>
        ) : item.videoUrl ? (
          <a href={item.videoUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-sm font-medium text-rose-200 hover:text-white">Open video<ArrowRight className="h-4 w-4" /></a>
        ) : null}

        {item.description && <p className="text-sm leading-6 text-gray-300">{item.description}</p>}
        {item.practice && (
          <section className="glass-effect rounded-xl p-5">
            <p className="text-sm font-medium">Practice</p>
            <p className="mt-2 text-sm leading-6 text-gray-300">{item.practice}</p>
          </section>
        )}

        <nav className="flex items-center justify-between gap-4 border-t border-white/10 pt-6 text-sm">
          {previous ? (
            <Link to={`${classUrl}/items/${index - 1}`} className="inline-flex items-center gap-2 text-gray-300 hover:text-white"><ArrowLeft className="h-4 w-4" />{previous.title}</Link>
          ) : <span />}
          {next ? (
            <Link to={`${classUrl}/items/${index + 1}`} className="inline-flex items-center gap-2 text-right text-gray-300 hover:text-white">{next.title}<ArrowRight className="h-4 w-4" /></Link>
          ) : <span />}
        </nav>
      </div>
    );
  }

  const itemLink = (item: ClassItem, index: number) => (
    <Link key={`${item.kind}-${index}`} to={`${classUrl}/items/${index}`} className="glass-effect flex items-center justify-between gap-4 rounded-xl p-4 hover:bg-white/10">
      <div className="space-y-1">
        <p className="text-sm font-medium">{item.title}</p>
        {item.duration && <p className="text-xs text-gray-400">{item.duration}</p>}
      </div>
      <ArrowRight className="h-4 w-4 shrink-0 text-gray-300" />
    </Link>
  );

  return (
    <div className="mx-auto max-w-3xl space-y-10 px-4 pb-16 pt-28 text-white">
      {header}

      <header className="space-y-3">
        <h1 className="text-3xl font-semibold">{program.title}</h1>
        <p className="text-sm leading-6 text-gray-300">{program.description}</p>
        {program.starts_at && (
          <p className="flex items-center gap-2 text-sm text-gray-400">
            <CalendarDays className="h-4 w-4" />{new Date(program.starts_at).toLocaleString()} {program.timezone || ''}
          </p>
        )}
      </header>

      <section className="glass-effect space-y-3 rounded-2xl p-6">
        <h2 className="text-lg font-semibold">Joining</h2>
        {joinLink ? (
          <a href={joinLink} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between rounded-lg bg-white/10 px-4 py-3 font-medium hover:bg-white/15">
            {program.location_type === 'in-person' ? 'Open venue details' : 'Join online'}
            <ArrowRight className="h-4 w-4" />
          </a>
        ) : program.location_details ? (
          <p className="flex items-center gap-2 text-sm text-gray-300"><MapPin className="h-4 w-4" />{program.location_details}</p>
        ) : (
          <p className="text-sm text-gray-300">The meeting link has not been added yet. The organiser will add it here before the session starts.</p>
        )}
      </section>

      {sessions.length > 0 && (
        <section className="space-y-3">
          <h2 className="text-lg font-semibold">Sessions</h2>
          {sessions.map((item, index) => itemLink(item, index))}
        </section>
      )}

      {talks.length > 0 && (
        <section className="space-y-3">
          <h2 className="text-lg font-semibold">Talks</h2>
          {talks.map((item, index) => itemLink(item, sessions.length + index))}
        </section>
      )}

      {furtherReading.length > 0 && (
        <section className="space-y-3">
          <h2 className="text-lg font-semibold">Further reading</h2>
          {furtherReading.map((resource) => (
            <a key={resource.url} href={resource.url} target="_blank" rel="noopener noreferrer" className="block text-sm text-sky-300 underline underline-offset-4">{resource.title}</a>
          ))}
        </section>
      )}
    </div>
  );
}
