import { useEffect, useState } from 'react';
import {
  activateCanaryModule,
  addCanaryDocument,
  addCanaryMemory,
  completeCanaryAction,
  getCanaryState,
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

type StudentTool = 'plan' | 'memory' | 'modules' | 'records' | 'safety';

const studentTools: Array<{ id: StudentTool; label: string }> = [
  { id: 'plan', label: 'Plan' },
  { id: 'memory', label: 'Memory' },
  { id: 'modules', label: 'Modules' },
  { id: 'records', label: 'Records' },
  { id: 'safety', label: 'Safety' },
];

export default function App() {
  const [canaryState, setCanaryState] = useState<CanaryState | null>(null);
  const [activeTool, setActiveTool] = useState<StudentTool>('plan');
  const [loadError, setLoadError] = useState<string | null>(null);
  const [mutationError, setMutationError] = useState<string | null>(null);
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

  function renderActiveTool() {
    if (!canaryState) {
      return null;
    }

    switch (activeTool) {
      case 'memory':
        return (
          <>
            <LifeAuditPanel />
            <MemoryProfile profile={canaryState.profile} isSaving={isSavingMemory} onAddMemory={addMemory} />
          </>
        );
      case 'modules':
        return (
          <ModuleDeck
            activeModules={canaryState.activeModules}
            recommendedModules={canaryState.recommendedModules}
            activatedModuleIds={canaryState.activatedModuleIds}
            onActivate={activateModule}
          />
        );
      case 'records':
        return (
          <DataVault profile={canaryState.profile} isSaving={isSavingDocument} onAddDocument={addDocument} />
        );
      case 'safety':
        return <SafetyPanel profile={canaryState.profile} />;
      case 'plan':
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
      <section className="hero">
        <div>
          <p className="eyebrow">Private agent for college life</p>
          <h1>College Life OS</h1>
          <p>Tell it your life once. It remembers, watches, and helps before things fall apart.</p>
        </div>
      </section>

      <div className="focus-layout">
        <section className="today-column" aria-label="Today">
          <AgentPanel />
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

        <aside className="tool-drawer" aria-label="Student tools">
          <div className="tab-list" role="tablist" aria-label="Student tools">
            {studentTools.map((tool) => (
              <button
                type="button"
                role="tab"
                aria-selected={activeTool === tool.id}
                className={activeTool === tool.id ? 'tab-button active' : 'tab-button'}
                key={tool.id}
                onClick={() => setActiveTool(tool.id)}
              >
                {tool.label}
              </button>
            ))}
          </div>
          <div className="tool-panel" role="tabpanel" aria-label={studentTools.find((tool) => tool.id === activeTool)?.label}>
            {renderActiveTool()}
          </div>
        </aside>
      </div>
    </main>
  );
}
