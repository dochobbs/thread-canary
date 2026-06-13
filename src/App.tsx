import { useEffect, useState } from 'react';
import {
  activateCanaryModule,
  addCanaryDocument,
  addCanaryMemory,
  completeCanaryAction,
  getCanaryState,
  sendCanaryAgentMessage,
  type CanaryState,
  type DocumentInput,
} from './api/client';
import { AgentPanel } from './components/AgentPanel';
import { ActionQueue } from './components/ActionQueue';
import { AnalyticsPanel } from './components/AnalyticsPanel';
import { DataVault } from './components/DataVault';
import { LifeAuditPanel } from './components/LifeAuditPanel';
import { MemoryProfile } from './components/MemoryProfile';
import { ModuleDeck } from './components/ModuleDeck';
import { RoutineOperator } from './components/RoutineOperator';
import { SafetyPanel } from './components/SafetyPanel';
import type { AgentAction, DeepModule } from './domain/types';

type StudentSection = 'current' | 'timeline' | 'tasks' | 'vault';

const threadSections: Array<{ id: StudentSection; label: string }> = [
  { id: 'current', label: 'Current' },
  { id: 'timeline', label: 'Timeline' },
  { id: 'tasks', label: 'Tasks' },
  { id: 'vault', label: 'Vault' },
];

export default function App() {
  const [canaryState, setCanaryState] = useState<CanaryState | null>(null);
  const [activeSection, setActiveSection] = useState<StudentSection>('current');
  const [loadError, setLoadError] = useState<string | null>(null);
  const [mutationError, setMutationError] = useState<string | null>(null);
  const [isSendingAgent, setIsSendingAgent] = useState(false);
  const [isSavingMemory, setIsSavingMemory] = useState(false);
  const [isSavingDocument, setIsSavingDocument] = useState(false);

  useEffect(() => {
    let isMounted = true;

    getCanaryState()
      .then((state) => {
        if (isMounted) {
          setCanaryState(state);
          setLoadError(null);
        }
      })
      .catch((error: Error) => {
        if (isMounted) {
          setLoadError(error.message);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  async function completeAction(action: AgentAction) {
    await applyStateMutation(() => completeCanaryAction(action.id));
  }

  async function activateModule(module: DeepModule) {
    await applyStateMutation(() => activateCanaryModule(module.id));
  }

  async function sendAgentMessage(text: string) {
    setIsSendingAgent(true);
    try {
      setMutationError(null);
      const result = await sendCanaryAgentMessage(text);
      setCanaryState(result.state);
    } catch (error) {
      setMutationError(error instanceof Error ? error.message : 'Agent message failed.');
    } finally {
      setIsSendingAgent(false);
    }
  }

  async function addMemory(text: string) {
    setIsSavingMemory(true);
    try {
      await applyStateMutation(() => addCanaryMemory(text));
    } finally {
      setIsSavingMemory(false);
    }
  }

  async function addDocument(document: DocumentInput) {
    setIsSavingDocument(true);
    try {
      await applyStateMutation(() => addCanaryDocument(document));
    } finally {
      setIsSavingDocument(false);
    }
  }

  async function applyStateMutation(mutation: () => Promise<CanaryState>) {
    try {
      setMutationError(null);
      setCanaryState(await mutation());
    } catch (error) {
      setMutationError(error instanceof Error ? error.message : 'Canary update failed.');
    }
  }

  function renderActiveSection() {
    if (!canaryState) {
      return null;
    }

    switch (activeSection) {
      case 'timeline':
        return (
          <>
            <LifeAuditPanel />
            <MemoryProfile profile={canaryState.profile} isSaving={isSavingMemory} onAddMemory={addMemory} />
          </>
        );
      case 'tasks':
        return (
          <ModuleDeck
            activeModules={canaryState.activeModules}
            recommendedModules={canaryState.recommendedModules}
            activatedModuleIds={canaryState.activatedModuleIds}
            onActivate={activateModule}
          />
        );
      case 'vault':
        return (
          <>
            <DataVault profile={canaryState.profile} isSaving={isSavingDocument} onAddDocument={addDocument} />
            <SafetyPanel profile={canaryState.profile} />
          </>
        );
      case 'current':
      default:
        return (
          <>
            <RoutineOperator />
            <AnalyticsPanel summary={canaryState.weeklySummary} />
          </>
        );
    }
  }

  return (
    <main className="app-shell">
      <section className="brand-bar" aria-label="THREAD">
        <div className="brand-lockup">
          <span className="continuity-mark" aria-hidden="true">
            <span className="mark-ring" />
            <span className="mark-line" />
            <span className="mark-node" />
          </span>
          <div>
            <p className="eyebrow">Memory-driven life agent</p>
            <h1>THREAD</h1>
          </div>
        </div>
        <p>Your life. Understood. What matters next.</p>
      </section>

      <div className="focus-layout">
        <section className="today-column" aria-label="Today">
          <AgentPanel
            studentName={canaryState?.profile.name}
            messages={canaryState?.agentMessages ?? []}
            isSending={isSendingAgent}
            onSendMessage={canaryState ? sendAgentMessage : undefined}
          />
          {loadError ? (
            <section className="panel" role="alert">
              <h2>Canary offline</h2>
              <p>{loadError}</p>
            </section>
          ) : null}
          {!loadError && !canaryState ? (
            <section className="panel">
              <h2>Loading agent</h2>
            </section>
          ) : null}
          {canaryState ? (
            <ActionQueue
              actions={canaryState.actions}
              completedActions={canaryState.completedActionIds}
              onComplete={completeAction}
            />
          ) : null}
          {mutationError ? (
            <p className="mutation-error" role="alert">
              {mutationError}
            </p>
          ) : null}
        </section>

        <aside className="tool-drawer" aria-label="Supporting context">
          <div className="tab-list" role="tablist" aria-label="Thread sections">
            {threadSections.map((section) => (
              <button
                type="button"
                role="tab"
                aria-selected={activeSection === section.id}
                className={activeSection === section.id ? 'tab-button active' : 'tab-button'}
                key={section.id}
                onClick={() => setActiveSection(section.id)}
              >
                {section.label}
              </button>
            ))}
          </div>
          <div
            className="tool-panel"
            role="tabpanel"
            aria-label={threadSections.find((section) => section.id === activeSection)?.label}
          >
            {renderActiveSection()}
          </div>
        </aside>
      </div>
    </main>
  );
}
