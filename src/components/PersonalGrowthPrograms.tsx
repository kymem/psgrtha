import { useCallback, useEffect, useMemo, useState, type FormEvent } from 'react';
import { ArrowRight, Award, BookOpen, Briefcase, CalendarCheck, CalendarDays, CheckCircle, Clock3, MapPin, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import { toYouTubeContentUrl } from '../lib/masterclassVideo';
import { PERSONAL_GROWTH_BLUEPRINTS, type PersonalGrowthBlueprint } from '../lib/personalGrowthCourses';

type ProgramKind = 'workshops' | 'mentorship';

type Program = {
  id: string;
  created_by: string;
  blueprint_id: string | null;
  title: string;
  creator: string;
  track: string;
  description: string;
  category: string;
  thumbnail_url: string;
  duration: string | null;
  level: string | null;
  learning_outcomes: string[];
  features: string[];
  prerequisites: string | null;
  target_audience: string | null;
  curriculum: PersonalGrowthBlueprint['curriculum'];
  starts_at?: string | null;
  ends_at?: string | null;
  timezone?: string | null;
  location_type?: string;
  location_details?: string | null;
  registration_capacity?: number | null;
  status: string;
  price: number;
  currency: string;
};

type MentorshipApplication = {
  id: string;
  program_id: string;
  user_id: string;
  goals: string;
  availability: string | null;
  message: string | null;
  status: 'pending' | 'approved' | 'declined' | 'withdrawn';
  created_at: string;
};

interface PersonalGrowthProgramsProps {
  kind: ProgramKind;
  category: string;
  searchQuery: string;
  refreshKey: number;
  onPrepare: (blueprint: PersonalGrowthBlueprint) => void;
}

export default function PersonalGrowthPrograms({ kind, category, searchQuery, refreshKey, onPrepare }: PersonalGrowthProgramsProps) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [programs, setPrograms] = useState<Program[]>([]);
  const [registrations, setRegistrations] = useState<Set<string>>(new Set());
  const [registrationCounts, setRegistrationCounts] = useState<Record<string, number>>({});
  const [applications, setApplications] = useState<MentorshipApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [applicationProgram, setApplicationProgram] = useState<Program | null>(null);
  const [applicationGoals, setApplicationGoals] = useState('');
  const [applicationAvailability, setApplicationAvailability] = useState('');
  const [applicationMessage, setApplicationMessage] = useState('');
  const [applicationError, setApplicationError] = useState<string | null>(null);

  const fetchPrograms = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const table = kind === 'workshops' ? 'personal_growth_workshops' : 'personal_growth_mentorship_programs';
      const { data, error: fetchError } = await supabase.from(table).select('*').order('created_at', { ascending: false });
      if (fetchError) throw fetchError;
      setPrograms((data || []) as Program[]);

      if (kind === 'workshops' && user) {
        const { data: registrationData, error: registrationError } = await supabase
          .from('personal_growth_workshop_registrations')
          .select('workshop_id, user_id')
          .eq('status', 'registered');
        if (registrationError) throw registrationError;
        setRegistrations(new Set((registrationData || []).filter((row) => row.user_id === user.id).map((row) => row.workshop_id)));
        setRegistrationCounts((registrationData || []).reduce<Record<string, number>>((counts, row) => {
          counts[row.workshop_id] = (counts[row.workshop_id] || 0) + 1;
          return counts;
        }, {}));
      }

      if (kind === 'mentorship' && user) {
        const { data: applicationData, error: applicationFetchError } = await supabase
          .from('personal_growth_mentorship_applications')
          .select('id, program_id, user_id, goals, availability, message, status, created_at');
        if (applicationFetchError) throw applicationFetchError;
        setApplications((applicationData || []) as MentorshipApplication[]);
      }
    } catch (fetchError) {
      setError(fetchError instanceof Error ? fetchError.message : 'Could not load programs.');
    } finally {
      setLoading(false);
    }
  }, [kind, user]);

  useEffect(() => {
    fetchPrograms();
  }, [fetchPrograms, refreshKey]);

  const templates = useMemo(
    () => PERSONAL_GROWTH_BLUEPRINTS.filter((blueprint) =>
      kind === 'workshops'
        ? ['Applied workshop', 'Guided class'].includes(blueprint.learning_format)
        : blueprint.learning_format === 'Mentorship series'
    ),
    [kind]
  );

  const filteredPrograms = programs.filter((program) => {
    const matchesCategory = category === 'all' || program.category === category;
    const query = searchQuery.trim().toLowerCase();
    const matchesSearch = !query || [program.title, program.creator, program.track, program.description]
      .some((value) => value?.toLowerCase().includes(query));
    return matchesCategory && matchesSearch;
  });

  const registerForWorkshop = async (program: Program) => {
    if (!user) {
      navigate('/signin');
      return;
    }
    setBusyId(program.id);
    setNotice(null);
    setError(null);
    const { error: registrationError } = await supabase.rpc('register_for_personal_growth_workshop', {
      p_workshop_id: program.id,
    });
    if (registrationError) {
      setError(registrationError.message);
    } else {
      setRegistrations((previous) => new Set(previous).add(program.id));
      setRegistrationCounts((previous) => ({ ...previous, [program.id]: (previous[program.id] || 0) + 1 }));
      setNotice(`You are registered for ${program.title}.`);
    }
    setBusyId(null);
  };

  const submitApplication = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!user || !applicationProgram) return;
    setBusyId(applicationProgram.id);
    setApplicationError(null);
    const { data: savedApplication, error: submitError } = await supabase.from('personal_growth_mentorship_applications').insert({
      program_id: applicationProgram.id,
      user_id: user.id,
      goals: applicationGoals.trim(),
      availability: applicationAvailability.trim() || null,
      message: applicationMessage.trim() || null,
    }).select('id, program_id, user_id, goals, availability, message, status, created_at').single();
    if (submitError) {
      setApplicationError(submitError.code === '23505' ? 'You have already applied to this program.' : submitError.message);
    } else {
      if (savedApplication) setApplications((previous) => [...previous, savedApplication as MentorshipApplication]);
      setApplicationProgram(null);
      setApplicationGoals('');
      setApplicationAvailability('');
      setApplicationMessage('');
      setNotice(`Your application for ${applicationProgram.title} was submitted.`);
    }
    setBusyId(null);
  };

  const reviewApplication = async (applicationId: string, status: 'approved' | 'declined') => {
    setBusyId(applicationId);
    const { error: reviewError } = await supabase.rpc('review_personal_growth_mentorship_application', {
      p_application_id: applicationId,
      p_status: status,
    });
    if (reviewError) {
      setError(reviewError.message);
    } else {
      setApplications((previous) => previous.map((application) =>
        application.id === applicationId ? { ...application, status } : application
      ));
    }
    setBusyId(null);
  };

  const title = kind === 'workshops' ? 'Workshop & class programs' : 'Mentorship programs';

  return (
    <div className="space-y-8">
      <section className="glass-effect rounded-2xl p-6">
        <div className="mb-5">
          <h2 className="text-2xl font-semibold text-white">{title}</h2>
          <p className="mt-2 text-sm text-gray-300">
            {kind === 'workshops'
              ? 'Browse published programs, review their session plans, and register for a place.'
              : 'Explore structured mentorship series and apply to the program that fits your goals.'}
          </p>
        </div>
        {kind === 'mentorship' && (
          <div className="mb-6 grid gap-4 sm:grid-cols-2">
            {[
              { title: 'Expert Guidance', description: 'Learn from professionals with years of industry experience.', Icon: Award },
              { title: 'Personalized Approach', description: 'Get tailored advice based on your specific goals and challenges.', Icon: Users },
              { title: 'Career Development', description: 'Receive strategic guidance to advance your career.', Icon: Briefcase },
              { title: 'Accountability', description: 'Stay on track with regular check-ins and support.', Icon: CalendarCheck },
            ].map(({ title: benefitTitle, description, Icon }) => (
              <article key={benefitTitle} className="rounded-xl border border-white/10 bg-white/[0.04] p-4">
                <Icon className="mb-2 h-6 w-6 text-rose-400" />
                <h3 className="font-semibold text-white">{benefitTitle}</h3>
                <p className="mt-1 text-sm leading-5 text-gray-300">{description}</p>
              </article>
            ))}
          </div>
        )}
        {error && <p role="alert" className="mb-4 rounded-lg border border-rose-400/30 bg-rose-500/10 p-3 text-sm text-rose-200">{error}</p>}
        {notice && <p role="status" className="mb-4 rounded-lg border border-emerald-400/30 bg-emerald-500/10 p-3 text-sm text-emerald-200">{notice}</p>}
        {loading ? (
          <p className="text-sm text-gray-400">Loading programs...</p>
        ) : filteredPrograms.length === 0 ? (
          <p className="rounded-xl border border-white/10 bg-white/[0.03] p-5 text-sm text-gray-400">No published programs match your filters yet.</p>
        ) : (
          <div className="grid gap-5 md:grid-cols-2">
            {filteredPrograms.map((program) => {
              const myApplication = applications.find((application) => application.program_id === program.id && application.user_id === user?.id);
              const programApplications = applications.filter((application) => application.program_id === program.id && program.created_by === user?.id);
              const joinLink = program.location_details && /^https?:\/\//i.test(program.location_details.trim()) ? program.location_details.trim() : null;
              const talks = (program.curriculum?.resources || []).flatMap((resource) => {
                const embedUrl = toYouTubeContentUrl(resource.url);
                return embedUrl ? [{ title: resource.title, embedUrl }] : [];
              });
              return (
                <article key={program.id} className="overflow-hidden rounded-2xl border border-white/10 bg-slate-950/45">
                  <div className="aspect-video bg-slate-800">
                    <img src={program.thumbnail_url} alt="" loading="lazy" className="h-full w-full object-cover" />
                  </div>
                  <div className="p-5">
                    <div className="mb-3 flex flex-wrap items-center gap-2">
                      <span className="rounded-full bg-purple-300/10 px-2.5 py-1 text-xs text-purple-200">{program.track}</span>
                      {program.created_by === user?.id && <span className="rounded-full bg-emerald-300/10 px-2.5 py-1 text-xs text-emerald-200">Your program</span>}
                    </div>
                    <h3 className="text-xl font-semibold text-white">{program.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-gray-300">{program.description}</p>
                    {kind === 'mentorship' && program.features.length > 0 && (
                      <ul className="mt-4 grid gap-2 sm:grid-cols-2">
                        {program.features.map((feature) => (
                          <li key={feature} className="flex items-start gap-2 text-sm text-gray-300">
                            <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-purple-300" />{feature}
                          </li>
                        ))}
                      </ul>
                    )}
                    <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm text-gray-400">
                      <span className="flex items-center gap-1.5"><Clock3 className="h-4 w-4" />{program.duration || 'Duration to be confirmed'}</span>
                      <span className="flex items-center gap-1.5"><BookOpen className="h-4 w-4" />{program.curriculum?.lessons?.length || 0} sessions</span>
                    </div>
                    {kind === 'workshops' && (
                      <div className="mt-3 space-y-2 text-sm text-gray-400">
                        {program.starts_at && <p className="flex items-center gap-2"><CalendarDays className="h-4 w-4" />{new Date(program.starts_at).toLocaleString()} {program.timezone || ''}</p>}
                        <p className="flex items-center gap-2"><MapPin className="h-4 w-4" />{program.location_type}{program.location_details && !joinLink ? ` · ${program.location_details}` : ''}</p>
                        {program.created_by === user?.id
                          ? <p className="flex items-center gap-2"><Users className="h-4 w-4" />{registrationCounts[program.id] || 0}{program.registration_capacity ? ` / ${program.registration_capacity}` : ''} registered</p>
                          : <p className="flex items-center gap-2"><Users className="h-4 w-4" />{program.registration_capacity ? `Up to ${program.registration_capacity} places` : 'Registration open'}</p>}
                      </div>
                    )}
                    {program.curriculum?.lessons?.length > 0 && (
                      <details className="group mt-4 border-t border-white/10 pt-3">
                        <summary className="cursor-pointer text-sm font-medium text-rose-200">View session plan</summary>
                        <ol className="mt-3 space-y-3">
                          {program.curriculum.lessons.map((lesson, index) => (
                            <li key={`${program.id}-${lesson.title}`} className="rounded-lg bg-white/[0.04] p-3">
                              <p className="text-sm font-medium text-white">{index + 1}. {lesson.title}</p>
                              <p className="mt-1 text-xs leading-5 text-gray-300">{lesson.description}</p>
                              <p className="mt-2 text-xs leading-5 text-purple-200">Practice: {lesson.practice}</p>
                            </li>
                          ))}
                        </ol>
                      </details>
                    )}
                    {kind === 'workshops' && registrations.has(program.id) ? (
                      <div className="mt-5 space-y-3 rounded-xl border border-emerald-400/30 bg-emerald-400/10 p-4 text-sm text-emerald-100">
                        <p className="flex items-center gap-2 font-semibold"><CheckCircle className="h-4 w-4" />You are registered</p>
                        <p>{program.starts_at ? `Starts ${new Date(program.starts_at).toLocaleString()} ${program.timezone || ''}`.trim() : 'The start date has not been set yet.'}</p>
                        {joinLink ? (
                          <a href={joinLink} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between rounded-lg bg-white/10 px-3 py-2 font-medium text-white hover:bg-white/15">
                            {program.location_type === 'in-person' ? 'Open venue details' : 'Join online'}
                            <ArrowRight className="h-4 w-4" />
                          </a>
                        ) : program.location_details ? (
                          <p>{program.location_type === 'in-person' ? 'Venue' : 'Joining'}: {program.location_details}</p>
                        ) : (
                          <p>The meeting link has not been added yet. The organiser will add it here before the session starts.</p>
                        )}
                        {talks.length > 0 && (
                          <div className="space-y-3">
                            <p className="font-semibold">Watch the talks</p>
                            {talks.map((talk) => (
                              <div key={talk.embedUrl} className="space-y-2">
                                <p className="text-xs text-emerald-100/80">{talk.title}</p>
                                <div className="aspect-video overflow-hidden rounded-lg bg-black">
                                  <iframe src={talk.embedUrl} title={talk.title} loading="lazy" className="h-full w-full" allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen />
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                        <p className="text-xs text-emerald-100/70">Open View session plan above to see what each session covers.</p>
                      </div>
                    ) : kind === 'workshops' ? (
                      <button type="button" disabled={Boolean(busyId) || program.status !== 'published'} onClick={() => registerForWorkshop(program)} className="mt-5 flex w-full items-center justify-between rounded-xl bg-gradient-to-r from-rose-500 to-purple-600 px-4 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60">
                        {busyId === program.id ? 'Registering...' : 'Register for workshop · Free'}
                        <ArrowRight className="h-4 w-4" />
                      </button>
                    ) : program.created_by === user?.id ? (
                      <p className="mt-5 rounded-lg bg-white/[0.04] p-3 text-sm text-gray-300">Applications received: {programApplications.length}</p>
                    ) : myApplication ? (
                      <p className="mt-5 flex items-center gap-2 rounded-lg bg-emerald-400/10 p-3 text-sm text-emerald-200"><CheckCircle className="h-4 w-4" />Application {myApplication.status}</p>
                    ) : program.status === 'published' ? (
                      <button type="button" onClick={() => {
                        if (!user) {
                          navigate('/signin');
                          return;
                        }
                        setApplicationProgram(program);
                        setApplicationError(null);
                      }} className="mt-5 flex w-full items-center justify-between rounded-xl bg-gradient-to-r from-rose-500 to-purple-600 px-4 py-3 text-sm font-semibold text-white">
                        Apply to this program <ArrowRight className="h-4 w-4" />
                      </button>
                    ) : null}
                    {programApplications.length > 0 && program.created_by === user?.id && (
                      <div className="mt-4 space-y-3 border-t border-white/10 pt-4">
                        {programApplications.map((application) => (
                          <div key={application.id} className="rounded-lg bg-white/[0.04] p-3 text-sm">
                            <p className="text-white">{application.goals}</p>
                            {application.availability && <p className="mt-1 text-xs text-gray-400">Availability: {application.availability}</p>}
                            {application.message && <p className="mt-1 text-xs text-gray-300">{application.message}</p>}
                            <p className="mt-2 text-xs text-gray-400">Status: {application.status}</p>
                            {application.status === 'pending' && (
                              <div className="mt-3 flex gap-2">
                                <button type="button" disabled={Boolean(busyId)} onClick={() => reviewApplication(application.id, 'approved')} className="rounded-lg bg-emerald-500/20 px-3 py-1.5 text-xs text-emerald-200 disabled:opacity-60">Approve</button>
                                <button type="button" disabled={Boolean(busyId)} onClick={() => reviewApplication(application.id, 'declined')} className="rounded-lg bg-rose-500/20 px-3 py-1.5 text-xs text-rose-200 disabled:opacity-60">Decline</button>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>

      <section>
        <h2 className="mb-4 text-xl font-semibold text-white">Curated {kind === 'workshops' ? 'workshop and class' : 'mentorship'} templates</h2>
        <div className="grid gap-5 md:grid-cols-2">
          {templates.map((blueprint) => (
            <article key={blueprint.id} className="rounded-2xl border border-white/10 bg-slate-900/70 p-5">
              <div className="mb-3 flex items-center justify-between gap-2">
                <span className="rounded-full bg-purple-300/10 px-2.5 py-1 text-xs text-purple-200">{blueprint.track}</span>
                <span className="text-xs text-gray-400">{blueprint.learning_format}</span>
              </div>
              <h3 className="text-lg font-semibold text-white">{blueprint.title}</h3>
              <p className="mt-2 text-sm leading-6 text-gray-300">{blueprint.description}</p>
              <p className="mt-3 text-sm text-gray-400">{blueprint.duration} · {blueprint.curriculum.lessons.length} sessions</p>
              <button type="button" onClick={() => onPrepare(blueprint)} className="mt-5 flex w-full items-center justify-between rounded-xl bg-gradient-to-r from-rose-500 to-purple-600 px-4 py-3 text-sm font-semibold text-white">
                Prefill {kind === 'workshops' ? 'workshop' : 'mentorship'} form <ArrowRight className="h-4 w-4" />
              </button>
            </article>
          ))}
        </div>
      </section>

      {applicationProgram && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <form onSubmit={submitApplication} className="glass-effect w-full max-w-xl space-y-4 rounded-2xl p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-xl font-semibold text-white">Apply to {applicationProgram.title}</h2>
                <p className="mt-1 text-sm text-gray-400">Share what you hope to work on and how you can participate.</p>
              </div>
              <button type="button" onClick={() => setApplicationProgram(null)} className="text-gray-400 hover:text-white" aria-label="Close application">×</button>
            </div>
            {applicationError && <p role="alert" className="rounded-lg bg-rose-500/10 p-3 text-sm text-rose-200">{applicationError}</p>}
            <textarea required value={applicationGoals} onChange={(event) => setApplicationGoals(event.target.value)} rows={4} placeholder="What goals or skills would you like mentorship to support?" className="w-full rounded-lg border border-gray-700 bg-gray-900 p-3 text-white" />
            <input value={applicationAvailability} onChange={(event) => setApplicationAvailability(event.target.value)} placeholder="Your availability (optional)" className="w-full rounded-lg border border-gray-700 bg-gray-900 p-3 text-white" />
            <textarea value={applicationMessage} onChange={(event) => setApplicationMessage(event.target.value)} rows={3} placeholder="Additional context (optional)" className="w-full rounded-lg border border-gray-700 bg-gray-900 p-3 text-white" />
            <button type="submit" disabled={Boolean(busyId)} className="w-full rounded-xl bg-gradient-to-r from-rose-500 to-purple-600 px-4 py-3 font-semibold text-white disabled:opacity-60">{busyId === applicationProgram.id ? 'Submitting...' : 'Submit application'}</button>
          </form>
        </div>
      )}
    </div>
  );
}
