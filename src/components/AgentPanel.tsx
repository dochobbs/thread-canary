import { FormEvent, useState } from 'react';
import {
  CalendarCheck,
  CircleAlert,
  ClipboardList,
  FlaskConical,
  Plus,
  Send,
  ShieldCheck,
  type LucideIcon,
} from 'lucide-react';
import type { AgentMessage, DemoMoment } from '../api/client';

interface AgentPanelProps {
  studentName?: string;
  messages?: AgentMessage[];
  demoMoments?: DemoMoment[];
  isSending?: boolean;
  onSendMessage?: (text: string) => Promise<void> | void;
}

const defaultInsights = [
  'Sleep has been below 6.5h for 3 nights',
  'Medication refill due Friday',
  'Bio practical and chem midterm stack this week',
];

const fallbackDemoMoments: DemoMoment[] = [
  {
    id: 'urgent-care',
    label: 'Urgent care?',
    prompt: 'Do I need urgent care tonight? Prepare what I should tell them.',
  },
  {
    id: 'parent-update',
    label: 'Parent text',
    prompt: 'What do I tell my mom without giving her everything?',
  },
  {
    id: 'lab-ta-message',
    label: 'Lab TA',
    prompt: 'What should I say to my lab TA if I miss lab?',
  },
  {
    id: 'add-acute-module',
    label: 'Add acute depth',
    prompt: 'Add the acute illness module. What changes?',
  },
  {
    id: 'tonight-plan',
    label: 'Tonight plan',
    prompt: 'Make me a plan for tonight.',
  },
];

const momentIcons: Record<string, LucideIcon> = {
  'urgent-care': CircleAlert,
  'parent-update': ShieldCheck,
  'lab-ta-message': ClipboardList,
  'add-acute-module': Plus,
  'tonight-plan': CalendarCheck,
};

function momentAriaLabel(moment: DemoMoment) {
  if (moment.id === 'parent-update') {
    return `${moment.label}, draft parent-safe update`;
  }

  if (moment.id === 'lab-ta-message') {
    return `${moment.label}, draft lab TA message`;
  }

  return moment.label;
}

export function AgentPanel({
  studentName = 'Alex Rivera',
  messages = [],
  demoMoments = fallbackDemoMoments,
  isSending = false,
  onSendMessage,
}: AgentPanelProps) {
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
              <div className="agent-message-meta">
                <span>{message.role === 'student' ? 'You' : 'Agent'}</span>
                {message.role === 'assistant' && message.source ? (
                  <span className={`agent-source ${message.source}`}>{message.source}</span>
                ) : null}
              </div>
              <p>{message.text}</p>
            </article>
          ))
        )}
        {isSending ? (
          <article className="agent-message assistant working" role="status" aria-label="Agent is checking memory and context">
            <span>Agent</span>
            <p>Checking memory and context</p>
            <div className="working-dots" aria-hidden="true">
              <span />
              <span />
              <span />
            </div>
          </article>
        ) : null}
      </div>
      <div className="agent-tools" aria-label="Demo moments">
        {demoMoments.map((moment) => {
          const Icon = momentIcons[moment.id] ?? FlaskConical;
          return (
          <button
            type="button"
            key={moment.id}
            aria-label={momentAriaLabel(moment)}
            onClick={() => runTool(moment.prompt)}
            disabled={!onSendMessage || isSending}
          >
            <Icon aria-hidden="true" />
            <span>{moment.label}</span>
          </button>
          );
        })}
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
