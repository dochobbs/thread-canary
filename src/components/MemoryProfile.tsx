import { LockKeyhole } from 'lucide-react';
import type { StudentProfile } from '../domain/types';

interface MemoryProfileProps {
  profile: StudentProfile;
}

export function MemoryProfile({ profile }: MemoryProfileProps) {
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
      <p className="privacy-note">{profile.privacyMode}</p>
    </section>
  );
}
