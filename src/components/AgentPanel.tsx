import { FormEvent, useState } from 'react';
import { CalendarCheck, ClipboardList, Pill, Send, ShieldCheck, type LucideIcon } from 'lucide-react';
import type { AgentMessage } from '../api/client';

interface AgentPanelProps {
  studentName?: string;
  messages?: AgentMessage[];
  isSending?: boolean;
  onSendMessage?: (text: string) => Promise<void> | void;
}

const defaultInsights = [
  'Sleep has been below 6.5h for 3 nights',
  'Medication refill due Friday',
  'Bio practical and chem midterm stack this week',
];

const agentTools: Array<{ label: string; ariaLabel: string; prompt: string; Icon: LucideIcon }> = [
  {
    label: 'Plan tonight',
    ariaLabel: 'Plan tonight',
    prompt: 'Plan tonight around symptoms, refill, sleep, and midterms.',
    Icon: CalendarCheck,
  },
  {
    label: 'Prep visit',
    ariaLabel: 'Prep care visit',
    prompt: 'Prep a care visit with a symptom history and what to ask.',
    Icon: ClipboardList,
  },
  {
    label: 'Start refill',
    ariaLabel: 'Start medication refill',
    prompt: 'Start the medication refill and draft what I should send.',
    Icon: Pill,
  },
  {
    label: 'Parent update',
    ariaLabel: 'Draft parent-safe update',
    prompt: 'Draft a parent-safe update that reassures without sharing private details.',
    Icon: ShieldCheck,
  },
];

export function AgentPanel({ studentName = 'Alex Rivera', messages = [], isSending = false, onSendMessage }: AgentPanelProps) {
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

  async function runTool(prompt: string) {
    if (!onSendMessage || isSending) {
      return;
    }

    await onSendMessage(prompt);
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
      <div className="agent-tools" aria-label="Agent tools">
        {agentTools.map(({ label, ariaLabel, prompt, Icon }) => (
          <button
            type="button"
            key={label}
            aria-label={ariaLabel}
            onClick={() => runTool(prompt)}
            disabled={!onSendMessage || isSending}
          >
            <Icon aria-hidden="true" />
            <span>{label}</span>
          </button>
        ))}
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
