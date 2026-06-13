import { FormEvent, useState } from 'react';
import { FileText } from 'lucide-react';
import type { DocumentInput } from '../api/client';
import type { StudentProfile } from '../domain/types';

interface DataVaultProps {
  profile: StudentProfile;
  isSaving?: boolean;
  onAddDocument?: (document: DocumentInput) => Promise<void> | void;
}

export function DataVault({ profile, isSaving = false, onAddDocument }: DataVaultProps) {
  const [title, setTitle] = useState('');
  const [kind, setKind] = useState('Card');

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextTitle = title.trim();
    if (!nextTitle || !onAddDocument) {
      return;
    }

    await onAddDocument({ title: nextTitle, kind, status: 'Captured' });
    setTitle('');
    setKind('Card');
  }

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
      {onAddDocument ? (
        <form className="inline-form two-field-form" onSubmit={handleSubmit}>
          <label htmlFor="document-title">Add record</label>
          <input id="document-title" value={title} onChange={(event) => setTitle(event.target.value)} />
          <label htmlFor="document-kind">Record type</label>
          <select id="document-kind" value={kind} onChange={(event) => setKind(event.target.value)}>
            <option>Card</option>
            <option>Medication</option>
            <option>Campus form</option>
            <option>Receipt</option>
            <option>Visit note</option>
          </select>
          <button type="submit" disabled={isSaving || title.trim().length === 0}>
            Add record
          </button>
        </form>
      ) : null}
    </section>
  );
}
