import { FormEvent, useState } from 'react';
import { Bot, Send, ShieldCheck } from 'lucide-react';
import type { AgentMessage } from '../api/client';

interface AgentPanelProps {
  messages?: AgentMessage[];
  isSending?: boolean;
  onSendMessage?: (text: string) => Promise<void> | void;
}

export function AgentPanel({ messages = [], isSending = false, onSendMessage }: AgentPanelProps) {
  const [draft, setDraft] = useState('');

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const text = draft.trim();
    if (!text || !onSendMessage) {
      return;
    }

    await onSendMessage(text);
    setDraft('');
  }

  return (
    <section className="agent-panel" aria-label="Agent conversation">
      <div className="section-heading">
        <Bot aria-hidden="true" />
        <div>
          <p className="eyebrow">Quiet operator</p>
          <h2>Agent</h2>
        </div>
      </div>
      <div className="agent-thread" aria-live="polite">
        {messages.length === 0 ? (
          <div className="agent-message assistant">
            <p>
              I am watching the week across symptoms, sleep, meds, class load, documents, and safety rules. I
              will ask before adding deeper support or contacting anyone.
            </p>
          </div>
        ) : (
          messages.map((message) => (
            <article className={`agent-message ${message.role}`} key={message.id}>
              <span>{message.role === 'student' ? 'You' : 'Agent'}</span>
              <p>{message.text}</p>
            </article>
          ))
        )}
      </div>
      <form className="agent-compose" onSubmit={handleSubmit}>
        <label htmlFor="agent-message">Message agent</label>
        <div>
          <textarea
            id="agent-message"
            rows={2}
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            disabled={!onSendMessage || isSending}
          />
          <button type="submit" aria-label="Send to agent" disabled={!onSendMessage || isSending || draft.trim().length === 0}>
            <Send aria-hidden="true" />
          </button>
        </div>
      </form>
      <div className="trust-strip">
        <ShieldCheck aria-hidden="true" />
        <span>Student-owned memory. No parent, school, or clinic sharing unless you choose it.</span>
      </div>
    </section>
  );
}
