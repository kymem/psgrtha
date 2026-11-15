import { useCallback, useEffect, useState } from 'react';
import { ArrowLeft, ArrowRight, CalendarDays, MapPin } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import { toYouTubeContentUrl } from '../lib/masterclassVideo';
import type { PersonalGrowthBlueprint } from '../lib/personalGrowthCourses';

type ClassProgram = {
  id: string;
  created_by: string;
  title: string;
  description: string;
  starts_at: string | null;
  timezone: string | null;
  location_type: string;
  location_details: string | null;
  curriculum: PersonalGrowthBlueprint['curriculum'];
};

export default function PersonalGrowthClass() {
  const { programId } = useParams<{ programId: string }>();
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
        .select('id, created_by, title, description, starts_at, timezone, location_type, location_details, curriculum')
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
      setProgram(saved);
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

  const joinLink = program.location_details && /^https?:\/\//i.test(program.location_details.trim())
    ? program.location_details.trim()
    : null;
  const talks = (program.curriculum?.resources || []).flatMap((resource) => {
    const embedUrl = toYouTubeContentUrl(resource.url);
    return embedUrl ? [{ title: resource.title, embedUrl }] : [];
  });

  return (
    <div className="mx-auto max-w-3xl space-y-8 px-4 pb-16 pt-28 text-white">
      <Link to="/masterclass" className="inline-flex items-center gap-2 text-sm text-gray-300 hover:text-white"><ArrowLeft className="h-4 w-4" />Back to Masterclass</Link>

      <header className="space-y-3">
        <h1 className="text-3xl font-semibold">{program.title}</h1>
        <p className="text-sm leading-6 text-gray-300">{program.description}</p>
        {program.starts_at && (
          <p className="flex items-center gap-2 text-sm text-gray-400">
            <CalendarDays className="h-4 w-4" />{new Date(program.starts_at).toLocaleString()} {program.timezone || ''}
          </p>
        )}
      </header>

      {!hasAccess ? (
        <section className="glass-effect space-y-3 rounded-2xl p-6 text-sm text-gray-300">
          <p>Register for this class to see the joining link and videos.</p>
          <Link to="/masterclass" className="inline-flex items-center gap-2 font-medium text-rose-200 hover:text-white">Go to Masterclass to register<ArrowRight className="h-4 w-4" /></Link>
        </section>
      ) : (
        <>
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

          {talks.length > 0 && (
            <section className="space-y-5">
              <h2 className="text-lg font-semibold">Class videos</h2>
              {talks.map((talk) => (
                <div key={talk.embedUrl} className="space-y-2">
                  <p className="text-sm font-medium">{talk.title}</p>
                  <div className="aspect-video overflow-hidden rounded-xl bg-black">
                    <iframe src={talk.embedUrl} title={talk.title} loading="lazy" className="h-full w-full" allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen />
                  </div>
                </div>
              ))}
            </section>
          )}
        </>
      )}

      {program.curriculum?.lessons?.length > 0 && (
        <section className="space-y-4">
          <h2 className="text-lg font-semibold">Sessions</h2>
          <ol className="space-y-3">
            {program.curriculum.lessons.map((lesson, index) => (
              <li key={`${program.id}-${lesson.title}`} className="glass-effect rounded-xl p-4">
                <p className="text-sm font-medium">{index + 1}. {lesson.title}</p>
                <p className="mt-1 text-sm leading-6 text-gray-300">{lesson.description}</p>
                <p className="mt-2 text-xs leading-5 text-purple-200">Practice: {lesson.practice}</p>
              </li>
            ))}
          </ol>
        </section>
      )}
    </div>
  );
}
