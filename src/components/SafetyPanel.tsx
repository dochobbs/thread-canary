import { HeartHandshake } from 'lucide-react';
import type { StudentProfile } from '../domain/types';

interface SafetyPanelProps {
  profile: StudentProfile;
}

export function SafetyPanel({ profile }: SafetyPanelProps) {
  return (
    <section className="panel">
      <div className="section-heading">
        <HeartHandshake aria-hidden="true" />
        <div>
          <p className="eyebrow">Consent-based backup</p>
          <h2>Trusted Safety</h2>
        </div>
      </div>
      <p>The agent can help reach out, but only under rules the student controls.</p>
      <div className="contact-row">
        {profile.trustedContacts.map((contact) => (
          <span key={contact}>{contact}</span>
        ))}
      </div>
    </section>
  );
}
