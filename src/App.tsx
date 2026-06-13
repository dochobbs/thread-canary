import { useMemo, useState } from 'react';
import { AgentPanel } from './components/AgentPanel';
import { ActionQueue } from './components/ActionQueue';
import { AnalyticsPanel } from './components/AnalyticsPanel';
import { DataVault } from './components/DataVault';
import { LifeAuditPanel } from './components/LifeAuditPanel';
import { MemoryProfile } from './components/MemoryProfile';
import { ModuleDeck } from './components/ModuleDeck';
import { RoutineOperator } from './components/RoutineOperator';
import { SafetyPanel } from './components/SafetyPanel';
import { createActionQueue, recommendModules, summarizeWeek } from './domain/agent';
import { modules } from './domain/modules';
import { seedStudent } from './domain/seedData';
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
  const [completedActions, setCompletedActions] = useState<string[]>([]);
  const [activatedModuleIds, setActivatedModuleIds] = useState<string[]>([]);
  const [activeTool, setActiveTool] = useState<StudentTool>('plan');

  const actions = useMemo(() => createActionQueue(seedStudent), []);
  const recommendedModules = useMemo(() => recommendModules(seedStudent), []);
  const weeklySummary = useMemo(() => summarizeWeek(seedStudent), []);
  const activeModules = modules.filter((module) => seedStudent.activeModuleIds.includes(module.id));

  function completeAction(action: AgentAction) {
    setCompletedActions((current) => (current.includes(action.id) ? current : [...current, action.id]));
  }

  function activateModule(module: DeepModule) {
    setActivatedModuleIds((current) => (current.includes(module.id) ? current : [...current, module.id]));
  }

  function renderActiveTool() {
    switch (activeTool) {
      case 'memory':
        return (
          <>
            <LifeAuditPanel />
            <MemoryProfile profile={seedStudent} />
          </>
        );
      case 'modules':
        return (
          <ModuleDeck
            activeModules={activeModules}
            recommendedModules={recommendedModules}
            activatedModuleIds={activatedModuleIds}
            onActivate={activateModule}
          />
        );
      case 'records':
        return <DataVault profile={seedStudent} />;
      case 'safety':
        return <SafetyPanel profile={seedStudent} />;
      case 'plan':
      default:
        return (
          <>
            <RoutineOperator />
            <AnalyticsPanel summary={weeklySummary} />
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
          <ActionQueue actions={actions} completedActions={completedActions} onComplete={completeAction} />
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
