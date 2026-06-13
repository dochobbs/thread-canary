import { Bot, ShieldCheck } from 'lucide-react';

export function AgentPanel() {
  return (
    <section className="agent-panel" aria-label="Agent conversation">
      <div className="section-heading">
        <Bot aria-hidden="true" />
        <div>
          <p className="eyebrow">Quiet operator</p>
          <h2>Agent</h2>
        </div>
      </div>
      <div className="agent-message">
        <p>
          I am watching the week across symptoms, sleep, meds, class load, documents, and safety rules. I
          will ask before adding deeper support or contacting anyone.
        </p>
      </div>
      <div className="trust-strip">
        <ShieldCheck aria-hidden="true" />
        <span>Student-owned memory. No parent, school, or clinic sharing unless you choose it.</span>
      </div>
    </section>
  );
}
