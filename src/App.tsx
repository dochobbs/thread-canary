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

export default function App() {
  const [completedActions, setCompletedActions] = useState<string[]>([]);
  const [activatedModuleIds, setActivatedModuleIds] = useState<string[]>([]);

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

  return (
    <main className="app-shell">
      <section className="hero">
        <div>
          <p className="eyebrow">Private agent for college life</p>
          <h1>College Life OS</h1>
          <p>Tell it your life once. It remembers, watches, and helps before things fall apart.</p>
        </div>
      </section>

      <div className="workspace">
        <section className="top-row" aria-label="Student context">
          <AgentPanel />
          <LifeAuditPanel />
        </section>

        <section className="attention-row" aria-label="What needs attention">
          <ActionQueue actions={actions} completedActions={completedActions} onComplete={completeAction} />
          <MemoryProfile profile={seedStudent} />
        </section>

        <section className="operations-grid" aria-label="Agent operations">
          <RoutineOperator />
          <ModuleDeck
            activeModules={activeModules}
            recommendedModules={recommendedModules}
            activatedModuleIds={activatedModuleIds}
            onActivate={activateModule}
          />
          <DataVault profile={seedStudent} />
          <AnalyticsPanel summary={weeklySummary} />
          <SafetyPanel profile={seedStudent} />
        </section>
      </div>
    </main>
  );
}
