import { FileText } from 'lucide-react';
import type { StudentProfile } from '../domain/types';

interface DataVaultProps {
  profile: StudentProfile;
}

export function DataVault({ profile }: DataVaultProps) {
  return (
    <section className="panel">
      <div className="section-heading">
        <FileText aria-hidden="true" />
        <div>
          <p className="eyebrow">Student-mediated records</p>
          <h2>Document Vault</h2>
        </div>
      </div>
      <div className="vault-list">
        {profile.documents.map((document) => (
          <article key={document.id}>
            <span>{document.kind}</span>
            <strong>{document.title}</strong>
            <p>{document.status}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
