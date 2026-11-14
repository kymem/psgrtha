import { useState, type FormEvent } from 'react';
import { X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { uploadToB2 } from '../lib/b2Upload';
import { supabase } from '../lib/supabase';
import type { PersonalGrowthBlueprint } from '../lib/personalGrowthCourses';

type ProgramKind = 'workshop' | 'mentorship';

interface PersonalGrowthProgramEditorModalProps {
  kind: ProgramKind;
  blueprint: PersonalGrowthBlueprint;
  onClose: () => void;
  onSaved: () => void;
}

export default function PersonalGrowthProgramEditorModal({ kind, blueprint, onClose, onSaved }: PersonalGrowthProgramEditorModalProps) {
  const { user, profile } = useAuth();
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [thumbnailUrl, setThumbnailUrl] = useState(blueprint.thumbnail_url);
  const [startsAt, setStartsAt] = useState('');
  const [endsAt, setEndsAt] = useState('');
  const [timezone, setTimezone] = useState(Intl.DateTimeFormat().resolvedOptions().timeZone);
  const [locationType, setLocationType] = useState<'online' | 'in-person' | 'hybrid'>('online');
  const [locationDetails, setLocationDetails] = useState('');
  const [capacity, setCapacity] = useState('');
  const [status, setStatus] = useState<'draft' | 'published'>('published');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!user || !profile) {
      setError('Sign in before creating a program.');
      return;
    }
    if (kind === 'workshop' && startsAt && endsAt && new Date(endsAt) <= new Date(startsAt)) {
      setError('The end time must be after the start time.');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      let finalThumbnailUrl = thumbnailUrl.trim();
      if (thumbnailFile) {
        const { publicUrl, error: uploadError } = await uploadToB2(thumbnailFile, `personal_growth_${kind}s/${user.id}`);
        if (uploadError) throw new Error(uploadError);
        finalThumbnailUrl = publicUrl;
      }
      if (!finalThumbnailUrl) throw new Error('A program thumbnail is required.');

      const commonProgram = {
        created_by: user.id,
        blueprint_id: blueprint.id,
        title: blueprint.title,
        creator: profile.name,
        track: blueprint.track,
        description: blueprint.description,
        category: 'personal-growth',
        thumbnail_url: finalThumbnailUrl,
        duration: blueprint.duration,
        level: blueprint.level,
        learning_outcomes: blueprint.learning_outcomes,
        features: blueprint.features,
        prerequisites: blueprint.prerequisites,
        target_audience: blueprint.target_audience,
        curriculum: blueprint.curriculum,
        price: 0,
        currency: 'UGX',
        status,
      };
      const table = kind === 'workshop' ? 'personal_growth_workshops' : 'personal_growth_mentorship_programs';
      const program = kind === 'workshop'
        ? {
            ...commonProgram,
            starts_at: startsAt ? new Date(startsAt).toISOString() : null,
            ends_at: endsAt ? new Date(endsAt).toISOString() : null,
            timezone: timezone.trim() || null,
            location_type: locationType,
            location_details: locationDetails.trim() || null,
            registration_capacity: capacity ? Number(capacity) : null,
          }
        : commonProgram;
      const { error: saveError } = await supabase.from(table).upsert(program, { onConflict: 'created_by,blueprint_id' });
      if (saveError) throw saveError;
      onSaved();
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : 'Could not save this program.');
    } finally {
      setLoading(false);
    }
  };

  const isWorkshop = kind === 'workshop';
  const programName = isWorkshop ? 'workshop' : 'mentorship program';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <form onSubmit={submit} className="glass-effect max-h-[90vh] w-full max-w-3xl space-y-5 overflow-y-auto rounded-2xl p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold text-white">Create Personal Growth {programName}</h2>
            <p className="mt-1 text-sm text-gray-400">Review the program plan and complete its {isWorkshop ? 'schedule and registration' : 'publishing'} details.</p>
          </div>
          <button type="button" onClick={onClose} className="text-gray-400 hover:text-white" aria-label="Close editor"><X className="h-5 w-5" /></button>
        </div>

        <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
          <p className="text-xs font-medium uppercase tracking-wide text-purple-200">{blueprint.track} · {blueprint.learning_format}</p>
          <h3 className="mt-2 text-lg font-semibold text-white">{blueprint.title}</h3>
          <p className="mt-2 text-sm leading-6 text-gray-300">{blueprint.description}</p>
          <p className="mt-3 text-sm text-gray-400">{blueprint.duration} · {blueprint.curriculum.lessons.length} sessions</p>
          <details className="mt-4 border-t border-white/10 pt-3">
            <summary className="cursor-pointer text-sm font-medium text-rose-200">Review session plan</summary>
            <ol className="mt-3 space-y-3">
              {blueprint.curriculum.lessons.map((lesson, index) => (
                <li key={lesson.title} className="rounded-lg bg-white/[0.04] p-3">
                  <p className="text-sm font-medium text-white">{index + 1}. {lesson.title} <span className="ml-2 text-xs font-normal text-gray-400">{lesson.duration}</span></p>
                  <p className="mt-1 text-sm leading-5 text-gray-300">{lesson.description}</p>
                  <p className="mt-2 text-xs leading-5 text-purple-200">Practice: {lesson.practice}</p>
                </li>
              ))}
            </ol>
            <div className="mt-3 flex flex-wrap gap-4">
              {blueprint.curriculum.resources.map((resource) => (
                <a key={resource.url} href={resource.url} target="_blank" rel="noreferrer" className="text-xs text-sky-300 underline underline-offset-4">{resource.title}</a>
              ))}
            </div>
          </details>
        </div>

        {isWorkshop && (
          <div className="grid gap-4 rounded-xl border border-white/10 p-4 md:grid-cols-2">
            <label className="space-y-2 text-sm text-gray-300">Starts at (optional)<input type="datetime-local" value={startsAt} onChange={(event) => setStartsAt(event.target.value)} className="w-full rounded-lg border border-gray-700 bg-gray-900 p-3 text-white" /></label>
            <label className="space-y-2 text-sm text-gray-300">Ends at (optional)<input type="datetime-local" value={endsAt} onChange={(event) => setEndsAt(event.target.value)} className="w-full rounded-lg border border-gray-700 bg-gray-900 p-3 text-white" /></label>
            <label className="space-y-2 text-sm text-gray-300">Timezone<input value={timezone} onChange={(event) => setTimezone(event.target.value)} className="w-full rounded-lg border border-gray-700 bg-gray-900 p-3 text-white" /></label>
            <label className="space-y-2 text-sm text-gray-300">Delivery mode<select value={locationType} onChange={(event) => setLocationType(event.target.value as typeof locationType)} className="w-full rounded-lg border border-gray-700 bg-gray-900 p-3 text-white"><option value="online">Online</option><option value="in-person">In person</option><option value="hybrid">Hybrid</option></select></label>
            <label className="space-y-2 text-sm text-gray-300">Location or joining details (optional)<input value={locationDetails} onChange={(event) => setLocationDetails(event.target.value)} className="w-full rounded-lg border border-gray-700 bg-gray-900 p-3 text-white" /></label>
            <label className="space-y-2 text-sm text-gray-300">Registration capacity (optional)<input type="number" min="1" value={capacity} onChange={(event) => setCapacity(event.target.value)} className="w-full rounded-lg border border-gray-700 bg-gray-900 p-3 text-white" /></label>
            <p className="text-xs leading-5 text-gray-400 md:col-span-2">Registration is free in this version; paid workshop checkout is not enabled.</p>
          </div>
        )}

        <div className="grid gap-4 md:grid-cols-2">
          <label className="space-y-2 text-sm text-gray-300">Thumbnail URL<input type="url" value={thumbnailUrl} onChange={(event) => setThumbnailUrl(event.target.value)} className="w-full rounded-lg border border-gray-700 bg-gray-900 p-3 text-white" /></label>
          <label className="space-y-2 text-sm text-gray-300">Or upload a thumbnail<input type="file" accept="image/*" onChange={(event) => setThumbnailFile(event.target.files?.[0] || null)} className="w-full rounded-lg border border-gray-700 bg-gray-900 p-3 text-white file:mr-3 file:rounded file:border-0 file:bg-purple-500 file:px-3 file:py-2 file:text-white" /></label>
          <label className="space-y-2 text-sm text-gray-300 md:col-span-2">Publishing status<select value={status} onChange={(event) => setStatus(event.target.value as typeof status)} className="w-full rounded-lg border border-gray-700 bg-gray-900 p-3 text-white"><option value="published">Publish now</option><option value="draft">Save as draft</option></select></label>
        </div>

        {error && <p role="alert" className="rounded-lg border border-rose-400/30 bg-rose-500/10 p-3 text-sm text-rose-200">{error}</p>}
        <div className="flex justify-end gap-3">
          <button type="button" onClick={onClose} className="rounded-xl border border-white/15 px-4 py-3 text-sm text-gray-200">Cancel</button>
          <button type="submit" disabled={loading} className="rounded-xl bg-gradient-to-r from-rose-500 to-purple-600 px-5 py-3 text-sm font-semibold text-white disabled:opacity-60">{loading ? 'Saving program...' : `Save ${programName}`}</button>
        </div>
      </form>
    </div>
  );
}
