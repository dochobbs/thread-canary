import { Check, CircleAlert } from 'lucide-react';
import type { AgentAction } from '../domain/types';

interface ActionQueueProps {
  actions: AgentAction[];
  completedActions: string[];
  onComplete: (action: AgentAction) => void;
}

export function ActionQueue({ actions, completedActions, onComplete }: ActionQueueProps) {
  const completedTitles = completedActions
    .map((id) => actions.find((action) => action.id === id)?.title)
    .filter(Boolean);

  return (
    <section className="panel action-queue">
      <div className="section-heading">
        <CircleAlert aria-hidden="true" />
        <div>
          <p className="eyebrow">What needs attention</p>
          <h2>Action Queue</h2>
        </div>
      </div>
      <div className="action-list">
        {actions.map((action) => (
          <article className={`action-card ${action.priority}`} key={action.id}>
            <div>
              <p className="priority">
                {action.priority} · {action.eta}
              </p>
              <h3>{action.title}</h3>
              <p>{action.detail}</p>
            </div>
            <button
              type="button"
              aria-label={`Mark ${action.title} done`}
              onClick={() => onComplete(action)}
              disabled={completedActions.includes(action.id)}
            >
              <Check aria-hidden="true" />
            </button>
          </article>
        ))}
      </div>
      {completedTitles.length > 0 ? <p className="completion-note">Completed: {completedTitles.join(', ')}</p> : null}
    </section>
  );
}
