import { FormEvent, useState } from 'react';
import { Send } from 'lucide-react';
import type { AgentMessage } from '../api/client';

interface AgentPanelProps {
  studentName?: string;
  messages?: AgentMessage[];
  isSending?: boolean;
  onSendMessage?: (text: string) => Promise<void> | void;
}

const defaultInsights = [
  'Sleep has been below 6.5h',
  'Medication refill due Friday',
  'Insurance form still waiting',
];

export function AgentPanel({ studentName = 'Maya', messages = [], isSending = false, onSendMessage }: AgentPanelProps) {
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
      <div className="agent-presence">
        <span className="thread-ring" aria-hidden="true" />
        <div>
          <p className="eyebrow">Quiet operator</p>
          <h2>Good morning, {studentName}.</h2>
        </div>
      </div>
      <p className="agent-lede">I've been keeping track.</p>
      <div className="agent-thread" aria-live="polite">
        {messages.length === 0 ? (
          <div className="agent-insight">
            <ul>
              {defaultInsights.map((insight) => (
                <li key={insight}>{insight}</li>
              ))}
            </ul>
            <p>I think these may be connected.</p>
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
        <span className="thread-ring small" aria-hidden="true" />
        <span>Student-owned memory. No parent, school, or clinic sharing unless you choose it.</span>
      </div>
    </section>
  );
}
