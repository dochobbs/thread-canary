import { FormEvent, useState } from 'react';
import { LockKeyhole } from 'lucide-react';
import type { StudentProfile } from '../domain/types';

interface MemoryProfileProps {
  profile: StudentProfile;
  isSaving?: boolean;
  onAddMemory?: (text: string) => Promise<void> | void;
}

export function MemoryProfile({ profile, isSaving = false, onAddMemory }: MemoryProfileProps) {
  const [memoryText, setMemoryText] = useState('');

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextMemory = memoryText.trim();
    if (!nextMemory || !onAddMemory) {
      return;
    }

    await onAddMemory(nextMemory);
    setMemoryText('');
  }

  return (
    <section className="panel">
      <div className="section-heading">
        <LockKeyhole aria-hidden="true" />
        <div>
          <p className="eyebrow">Tell it once</p>
          <h2>Private Memory</h2>
        </div>
      </div>
      <p className="profile-line">
        {profile.year} · {profile.schoolContext}
      </p>
      <ul className="memory-list">
        {profile.memory.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
      {onAddMemory ? (
        <form className="inline-form" onSubmit={handleSubmit}>
          <label htmlFor="memory-entry">Add memory</label>
          <textarea
            id="memory-entry"
            rows={3}
            value={memoryText}
            onChange={(event) => setMemoryText(event.target.value)}
          />
          <button type="submit" disabled={isSaving || memoryText.trim().length === 0}>
            Save memory
          </button>
        </form>
      ) : null}
      <p className="privacy-note">{profile.privacyMode}</p>
    </section>
  );
}
