import { ClipboardList } from 'lucide-react';

const auditItems = [
  { label: 'School context', status: 'Captured' },
  { label: 'Calendar and class rhythm', status: 'Connected' },
  { label: 'Wearable sleep and stress signals', status: 'Ready to connect' },
  { label: 'Medications and care preferences', status: 'Captured' },
  { label: 'Documents and insurance basics', status: 'Needs upload' },
];

export function LifeAuditPanel() {
  return (
    <section className="panel">
      <div className="section-heading">
        <ClipboardList aria-hidden="true" />
        <div>
          <p className="eyebrow">First session</p>
          <h2>Life Audit</h2>
        </div>
      </div>
      <p>The first run builds useful memory without feeling like a medical intake.</p>
      <div className="audit-list">
        {auditItems.map((item) => (
          <article key={item.label}>
            <strong>{item.label}</strong>
            <span>{item.status}</span>
          </article>
        ))}
      </div>
    </section>
  );
}
