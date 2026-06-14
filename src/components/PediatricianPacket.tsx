import { FileText } from 'lucide-react';
import type { StudentProfile } from '../domain/types';

interface PediatricianPacketProps {
  profile: StudentProfile;
}

export function PediatricianPacket({ profile }: PediatricianPacketProps) {
  return (
    <section className="panel">
      <div className="section-heading">
        <FileText aria-hidden="true" />
        <div>
          <p className="eyebrow">Incoming history</p>
          <h2>Pediatrician Packet</h2>
        </div>
      </div>
      <p className="profile-line">
        {profile.pediatricianPacket.practice} · {profile.pediatricianPacket.clinician} ·{' '}
        {profile.pediatricianPacket.received}
      </p>
      <p>{profile.pediatricianPacket.summary}</p>
      <div className="packet-list">
        {profile.pediatricianPacket.artifacts.map((artifact) => (
          <article key={artifact.id}>
            <span>{artifact.status}</span>
            <strong>{artifact.title}</strong>
            {artifact.body ? <p>{artifact.body}</p> : null}
          </article>
        ))}
      </div>
    </section>
  );
}
