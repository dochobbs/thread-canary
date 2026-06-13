# College Life OS Prototype Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a mobile-first local web prototype of College Life OS: a private student agent shell with memory, action queue, on-demand deep modules, documents, care navigation, safety, and analytics.

**Architecture:** Use a Vite + React + TypeScript single-page app with deterministic local domain logic. Keep agent behavior in typed domain modules, seed data in one file, and visual state in focused React components so the prototype can later swap local data for a cloud backend.

**Tech Stack:** React 18, TypeScript, Vite, Vitest, Testing Library, lucide-react, plain CSS.

---

## File Structure

- Create `package.json`: scripts and dependencies for Vite, React, Vitest, Testing Library, and lucide icons.
- Create `index.html`: Vite root document.
- Create `tsconfig.json`, `tsconfig.node.json`, `vite.config.ts`: TypeScript/Vite/Vitest configuration.
- Create `src/setupTests.ts`: Testing Library matcher setup.
- Create `src/main.tsx`: React entrypoint.
- Create `src/App.test.tsx`: app integration tests.
- Create `src/App.tsx`: top-level app state and composition.
- Create `src/styles.css`: mobile-first product UI.
- Create `src/domain/types.ts`: shared product types.
- Create `src/domain/seedData.ts`: realistic prototype data.
- Create `src/domain/modules.ts`: module registry and activation helpers.
- Create `src/domain/agent.ts`: action queue, module suggestions, and weekly analytics logic.
- Create `src/domain/agent.test.ts`: domain behavior tests.
- Create `src/components/AgentPanel.tsx`: conversation and agent prompt surface.
- Create `src/components/LifeAuditPanel.tsx`: first-session audit and data-source setup surface.
- Create `src/components/ActionQueue.tsx`: prioritized actions and completion controls.
- Create `src/components/MemoryProfile.tsx`: private memory and trust model surface.
- Create `src/components/RoutineOperator.tsx`: sleep, meds, class rhythm, and recovery surface.
- Create `src/components/ModuleDeck.tsx`: deep module activation UI.
- Create `src/components/DataVault.tsx`: document/data source surface.
- Create `src/components/AnalyticsPanel.tsx`: weekly personal analytics.
- Create `src/components/SafetyPanel.tsx`: trusted-contact safety controls.

## Task 1: Project Toolchain And App Shell

**Files:**
- Create: `package.json`
- Create: `index.html`
- Create: `tsconfig.json`
- Create: `tsconfig.node.json`
- Create: `vite.config.ts`
- Create: `src/setupTests.ts`
- Create: `src/main.tsx`
- Test: `src/App.test.tsx`
- Create: `src/App.tsx`

- [ ] **Step 1: Create the failing app shell test**

Create `src/App.test.tsx`:

```tsx
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import App from './App';

describe('College Life OS app shell', () => {
  it('renders the student-owned life OS positioning', () => {
    render(<App />);

    expect(screen.getByRole('heading', { name: /college life os/i })).toBeInTheDocument();
    expect(screen.getByText(/private agent for college life/i)).toBeInTheDocument();
    expect(screen.getByText(/tell it your life once/i)).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Add toolchain files**

Create `package.json`:

```json
{
  "name": "college-life-os",
  "version": "0.1.0",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "vite --host 127.0.0.1",
    "build": "tsc -b && vite build",
    "preview": "vite preview --host 127.0.0.1",
    "test": "vitest run",
    "test:watch": "vitest"
  },
  "dependencies": {
    "@vitejs/plugin-react": "^4.5.2",
    "lucide-react": "^0.468.0",
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "vite": "^5.4.11"
  },
  "devDependencies": {
    "@testing-library/jest-dom": "^6.6.3",
    "@testing-library/react": "^16.1.0",
    "@testing-library/user-event": "^14.5.2",
    "@types/react": "^18.3.12",
    "@types/react-dom": "^18.3.1",
    "jsdom": "^25.0.1",
    "typescript": "^5.6.3",
    "vitest": "^2.1.5"
  }
}
```

Create `index.html`:

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>College Life OS</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

Create `tsconfig.json`:

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["DOM", "DOM.Iterable", "ES2020"],
    "allowJs": false,
    "skipLibCheck": true,
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "module": "ESNext",
    "moduleResolution": "Node",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx"
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

Create `tsconfig.node.json`:

```json
{
  "compilerOptions": {
    "composite": true,
    "skipLibCheck": true,
    "module": "ESNext",
    "moduleResolution": "Node",
    "allowSyntheticDefaultImports": true,
    "strict": true
  },
  "include": ["vite.config.ts"]
}
```

Create `vite.config.ts`:

```ts
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/setupTests.ts',
  },
});
```

Create `src/setupTests.ts`:

```ts
import '@testing-library/jest-dom/vitest';
```

Create `src/main.tsx`:

```tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles.css';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
```

- [ ] **Step 3: Install dependencies**

Run:

```bash
npm install
```

Expected: dependencies install and `package-lock.json` is created.

- [ ] **Step 4: Run the app shell test to verify it fails**

Run:

```bash
npm test -- src/App.test.tsx
```

Expected: FAIL because `src/App.tsx` has not been created.

- [ ] **Step 5: Implement the minimal app shell**

Create `src/App.tsx`:

```tsx
export default function App() {
  return (
    <main>
      <p>Private agent for college life</p>
      <h1>College Life OS</h1>
      <p>Tell it your life once. It remembers, watches, and helps before things fall apart.</p>
    </main>
  );
}
```

Create `src/styles.css`:

```css
:root {
  color: #17201b;
  background: #f6f3ea;
  font-family:
    Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
}

body {
  margin: 0;
}

main {
  min-height: 100vh;
  padding: 24px;
}
```

- [ ] **Step 6: Run the app shell test to verify it passes**

Run:

```bash
npm test -- src/App.test.tsx
```

Expected: PASS.

- [ ] **Step 7: Commit the shell**

Run:

```bash
git add package.json package-lock.json index.html tsconfig.json tsconfig.node.json vite.config.ts src
git commit -m "Build College Life OS app shell"
```

## Task 2: Agent Domain Model

**Files:**
- Test: `src/domain/agent.test.ts`
- Create: `src/domain/types.ts`
- Create: `src/domain/seedData.ts`
- Create: `src/domain/modules.ts`
- Create: `src/domain/agent.ts`

- [ ] **Step 1: Write failing domain tests**

Create `src/domain/agent.test.ts`:

```ts
import { describe, expect, it } from 'vitest';
import { createActionQueue, recommendModules, summarizeWeek } from './agent';
import { seedStudent } from './seedData';

describe('agent domain logic', () => {
  it('prioritizes urgent care, medication, safety, and academic recovery actions', () => {
    const queue = createActionQueue(seedStudent);

    expect(queue[0]).toMatchObject({
      id: 'care-red-flag',
      priority: 'urgent',
      moduleId: 'care-navigation',
    });
    expect(queue.map((item) => item.id)).toEqual(
      expect.arrayContaining(['refill-stimulant', 'restart-academic-load', 'safety-check-in']),
    );
  });

  it('recommends on-demand modules from student signals without activating them silently', () => {
    const recommendations = recommendModules(seedStudent);

    expect(recommendations.map((item) => item.id)).toEqual(
      expect.arrayContaining(['nutrition-patterns', 'substance-party-safety', 'admin-insurance']),
    );
    expect(recommendations.every((item) => item.status === 'available')).toBe(true);
  });

  it('summarizes the week as a practical private agent readout', () => {
    const summary = summarizeWeek(seedStudent);

    expect(summary.headline).toContain('3 things need attention');
    expect(summary.signals).toEqual(
      expect.arrayContaining(['sleep debt is up', 'medication refill is close', 'exam cluster starts in 5 days']),
    );
  });
});
```

- [ ] **Step 2: Run domain tests to verify they fail**

Run:

```bash
npm test -- src/domain/agent.test.ts
```

Expected: FAIL because the domain files do not exist.

- [ ] **Step 3: Add product types**

Create `src/domain/types.ts`:

```ts
export type Priority = 'urgent' | 'high' | 'medium' | 'low';

export type ModuleStatus = 'active' | 'available';

export interface StudentSignal {
  id: string;
  label: string;
  value: string;
  severity: Priority;
}

export interface DeepModule {
  id: string;
  name: string;
  category: 'launch' | 'on-demand';
  status: ModuleStatus;
  promise: string;
  watches: string[];
  actions: string[];
}

export interface StudentProfile {
  name: string;
  year: string;
  schoolContext: string;
  privacyMode: string;
  memory: string[];
  trustedContacts: string[];
  signals: StudentSignal[];
  activeModuleIds: string[];
  availableModuleIds: string[];
  documents: Array<{
    id: string;
    title: string;
    kind: string;
    status: string;
  }>;
}

export interface AgentAction {
  id: string;
  title: string;
  detail: string;
  priority: Priority;
  moduleId: string;
  eta: string;
}

export interface WeeklySummary {
  headline: string;
  signals: string[];
  nextBestAction: string;
}
```

- [ ] **Step 4: Add module registry**

Create `src/domain/modules.ts`:

```ts
import type { DeepModule } from './types';

export const modules: DeepModule[] = [
  {
    id: 'executive-function',
    name: 'Executive Function / ADHD',
    category: 'launch',
    status: 'active',
    promise: 'Breaks down messy weeks, missed routines, meds, and deadline recovery.',
    watches: ['missed classes', 'deadline pileups', 'medication timing'],
    actions: ['restart plan', 'task breakdown', 'refill reminder'],
  },
  {
    id: 'sleep-burnout-academic-load',
    name: 'Sleep / Burnout / Academic Load',
    category: 'launch',
    status: 'active',
    promise: 'Connects sleep debt, exam clusters, stress, and recovery time.',
    watches: ['sleep debt', 'exam clusters', 'overcommitment'],
    actions: ['recovery block', 'schedule repair', 'burnout check-in'],
  },
  {
    id: 'medication-management',
    name: 'Medication Management',
    category: 'launch',
    status: 'active',
    promise: 'Keeps meds, refills, side effects, and pharmacy tasks from slipping.',
    watches: ['refill windows', 'missed doses', 'side effects'],
    actions: ['refill task', 'med list', 'visit question'],
  },
  {
    id: 'care-navigation',
    name: 'Care Navigation',
    category: 'launch',
    status: 'active',
    promise: 'Helps decide what to do next when something feels off.',
    watches: ['red flags', 'symptom changes', 'post-visit follow-up'],
    actions: ['visit prep', 'urgency guidance', 'follow-up plan'],
  },
  {
    id: 'mental-health-safety',
    name: 'Mental Health Safety',
    category: 'launch',
    status: 'active',
    promise: 'Consent-based safety support, counseling prep, and trusted-contact check-ins.',
    watches: ['isolation', 'crisis language', 'stress spirals'],
    actions: ['check-in', 'trusted-contact draft', 'campus counseling prep'],
  },
  {
    id: 'nutrition-patterns',
    name: 'Nutrition / Eating Patterns',
    category: 'on-demand',
    status: 'available',
    promise: 'Adds deeper support for skipped meals, appetite changes, and recovery nutrition.',
    watches: ['skipped meals', 'appetite change', 'workout recovery'],
    actions: ['meal rhythm plan', 'dining hall fallback', 'care prompt'],
  },
  {
    id: 'substance-party-safety',
    name: 'Substance / Party Safety',
    category: 'on-demand',
    status: 'available',
    promise: 'Adds private planning and risk support for alcohol, cannabis, stimulants, and recovery.',
    watches: ['blackouts', 'next-day symptoms', 'risk patterns'],
    actions: ['safer night plan', 'recovery check', 'trusted-contact setup'],
  },
  {
    id: 'admin-insurance',
    name: 'Admin / Insurance',
    category: 'on-demand',
    status: 'available',
    promise: 'Adds depth for forms, insurance cards, immunizations, bills, and confusing charges.',
    watches: ['missing forms', 'unread bills', 'insurance deadlines'],
    actions: ['form checklist', 'bill explainer', 'document request'],
  },
];

export function getModuleById(id: string) {
  const found = modules.find((item) => item.id === id);
  if (!found) {
    throw new Error(`Unknown module: ${id}`);
  }
  return found;
}
```

- [ ] **Step 5: Add seed student data**

Create `src/domain/seedData.ts`:

```ts
import type { StudentProfile } from './types';

export const seedStudent: StudentProfile = {
  name: 'Maya',
  year: 'First-year student',
  schoolContext: 'Biology major with two lab sections, club soccer, and a heavy exam week coming up.',
  privacyMode: 'Student-owned. Parents can pay, but content stays private unless shared.',
  memory: [
    'Usually takes stimulant medication at 8:00 AM on class days.',
    'Gets behind when sleep drops under 6 hours for two nights.',
    'Prefers urgent care over campus clinic after 6 PM.',
    'Wants trusted-contact help only after being asked first.',
  ],
  trustedContacts: ['Jordan - roommate', 'Aunt Lena - trusted adult'],
  activeModuleIds: [
    'executive-function',
    'sleep-burnout-academic-load',
    'medication-management',
    'care-navigation',
    'mental-health-safety',
  ],
  availableModuleIds: ['nutrition-patterns', 'substance-party-safety', 'admin-insurance'],
  signals: [
    { id: 'symptom-red-flag', label: 'Chest tightness plus fever note', value: 'worse since yesterday', severity: 'urgent' },
    { id: 'refill-window', label: 'Medication refill', value: '4 days left', severity: 'high' },
    { id: 'sleep-debt', label: 'Sleep debt', value: '2 nights under 6 hours', severity: 'high' },
    { id: 'exam-cluster', label: 'Exam cluster', value: 'starts in 5 days', severity: 'high' },
    { id: 'missed-meals', label: 'Meal rhythm', value: 'skipped lunch 3 times', severity: 'medium' },
    { id: 'party-risk', label: 'Weekend recovery', value: 'reported blackout last month', severity: 'medium' },
    { id: 'insurance-card', label: 'Insurance card', value: 'not uploaded', severity: 'medium' },
    { id: 'isolation', label: 'Check-in tone', value: 'less contact this week', severity: 'medium' },
  ],
  documents: [
    { id: 'insurance', title: 'Insurance card', kind: 'Card', status: 'Missing' },
    { id: 'rx', title: 'Stimulant prescription label', kind: 'Medication', status: 'Captured' },
    { id: 'immunization', title: 'Immunization record', kind: 'Campus form', status: 'Needs review' },
  ],
};
```

- [ ] **Step 6: Implement agent logic**

Create `src/domain/agent.ts`:

```ts
import { getModuleById } from './modules';
import type { AgentAction, DeepModule, Priority, StudentProfile, WeeklySummary } from './types';

const priorityWeight: Record<Priority, number> = {
  urgent: 0,
  high: 1,
  medium: 2,
  low: 3,
};

export function createActionQueue(profile: StudentProfile): AgentAction[] {
  const actions: AgentAction[] = [];

  if (profile.signals.some((signal) => signal.id === 'symptom-red-flag')) {
    actions.push({
      id: 'care-red-flag',
      title: 'Decide care level for symptoms',
      detail: 'Chest tightness plus fever changed since yesterday. Prepare a short symptom history and choose campus clinic, urgent care, or emergency care based on current severity.',
      priority: 'urgent',
      moduleId: 'care-navigation',
      eta: 'Now',
    });
  }

  if (profile.signals.some((signal) => signal.id === 'refill-window')) {
    actions.push({
      id: 'refill-stimulant',
      title: 'Start medication refill',
      detail: 'Four days left. Queue pharmacy task and prepare a message if the refill needs clinician approval.',
      priority: 'high',
      moduleId: 'medication-management',
      eta: 'Today',
    });
  }

  if (profile.signals.some((signal) => signal.id === 'sleep-debt' || signal.id === 'exam-cluster')) {
    actions.push({
      id: 'restart-academic-load',
      title: 'Repair this week before exams hit',
      detail: 'Sleep debt and exam clustering are both up. Build a two-day recovery schedule with class, meals, study blocks, and one protected sleep window.',
      priority: 'high',
      moduleId: 'sleep-burnout-academic-load',
      eta: 'Tonight',
    });
  }

  if (profile.signals.some((signal) => signal.id === 'isolation')) {
    actions.push({
      id: 'safety-check-in',
      title: 'Run a consent-based safety check-in',
      detail: 'The app can ask how you want support and draft a message to a trusted contact only if you choose.',
      priority: 'medium',
      moduleId: 'mental-health-safety',
      eta: 'This week',
    });
  }

  return actions.sort((a, b) => priorityWeight[a.priority] - priorityWeight[b.priority]);
}

export function recommendModules(profile: StudentProfile): DeepModule[] {
  const recommendedIds = new Set<string>();

  if (profile.signals.some((signal) => signal.id === 'missed-meals')) {
    recommendedIds.add('nutrition-patterns');
  }

  if (profile.signals.some((signal) => signal.id === 'party-risk')) {
    recommendedIds.add('substance-party-safety');
  }

  if (profile.signals.some((signal) => signal.id === 'insurance-card')) {
    recommendedIds.add('admin-insurance');
  }

  return Array.from(recommendedIds).map((id) => getModuleById(id));
}

export function summarizeWeek(profile: StudentProfile): WeeklySummary {
  const highSignals = profile.signals.filter((signal) => signal.severity === 'urgent' || signal.severity === 'high');
  const labels = profile.signals.map((signal) => signal.id);

  return {
    headline: `${highSignals.length} things need attention before the week gets away from you.`,
    signals: [
      labels.includes('sleep-debt') ? 'sleep debt is up' : 'sleep is stable',
      labels.includes('refill-window') ? 'medication refill is close' : 'medications look current',
      labels.includes('exam-cluster') ? 'exam cluster starts in 5 days' : 'academic load is steady',
    ],
    nextBestAction: 'Handle the symptom care decision first, then protect tonight for refill and sleep recovery.',
  };
}
```

- [ ] **Step 7: Run domain tests to verify they pass**

Run:

```bash
npm test -- src/domain/agent.test.ts
```

Expected: PASS.

- [ ] **Step 8: Commit domain logic**

Run:

```bash
git add src/domain src/App.test.tsx
git commit -m "Add student agent domain model"
```

## Task 3: Interactive Prototype UI

**Files:**
- Modify: `src/App.test.tsx`
- Modify: `src/App.tsx`
- Create: `src/components/AgentPanel.tsx`
- Create: `src/components/LifeAuditPanel.tsx`
- Create: `src/components/ActionQueue.tsx`
- Create: `src/components/MemoryProfile.tsx`
- Create: `src/components/RoutineOperator.tsx`
- Create: `src/components/ModuleDeck.tsx`
- Create: `src/components/DataVault.tsx`
- Create: `src/components/AnalyticsPanel.tsx`
- Create: `src/components/SafetyPanel.tsx`

- [ ] **Step 1: Extend failing app tests for core surfaces and module activation**

Replace `src/App.test.tsx` with:

```tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import App from './App';

describe('College Life OS app shell', () => {
  it('renders the core agent surfaces', () => {
    render(<App />);

    expect(screen.getByRole('heading', { name: /college life os/i })).toBeInTheDocument();
    expect(screen.getByText(/private agent for college life/i)).toBeInTheDocument();
    expect(screen.getByText(/tell it your life once/i)).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /life audit/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /action queue/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /private memory/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /routine operator/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /deep modules/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /document vault/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /weekly readout/i })).toBeInTheDocument();
  });

  it('activates an on-demand module only after the student chooses it', async () => {
    const user = userEvent.setup();
    render(<App />);

    expect(screen.getByText(/nutrition \/ eating patterns/i)).toBeInTheDocument();
    expect(screen.getByText(/available when useful/i)).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /add nutrition module/i }));

    expect(screen.getByText(/nutrition module added/i)).toBeInTheDocument();
  });

  it('lets the student complete an agent action', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole('button', { name: /mark decide care level for symptoms done/i }));

    expect(screen.getByText(/completed: decide care level for symptoms/i)).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run app tests to verify they fail**

Run:

```bash
npm test -- src/App.test.tsx
```

Expected: FAIL because the UI components have not been created.

- [ ] **Step 3: Add UI components**

Create `src/components/AgentPanel.tsx`:

```tsx
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
          I am watching the week across symptoms, sleep, meds, class load, documents, and safety rules.
          I will ask before adding deeper support or contacting anyone.
        </p>
      </div>
      <div className="trust-strip">
        <ShieldCheck aria-hidden="true" />
        <span>Student-owned memory. No parent, school, or clinic sharing unless you choose it.</span>
      </div>
    </section>
  );
}
```

Create `src/components/ActionQueue.tsx`:

```tsx
import { Check, CircleAlert } from 'lucide-react';
import type { AgentAction } from '../domain/types';

interface ActionQueueProps {
  actions: AgentAction[];
  completedActions: string[];
  onComplete: (action: AgentAction) => void;
}

export function ActionQueue({ actions, completedActions, onComplete }: ActionQueueProps) {
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
              <p className="priority">{action.priority} · {action.eta}</p>
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
      {completedActions.length > 0 ? (
        <p className="completion-note">Completed: {completedActions.map((id) => actions.find((action) => action.id === id)?.title).filter(Boolean).join(', ')}</p>
      ) : null}
    </section>
  );
}
```

Create `src/components/LifeAuditPanel.tsx`:

```tsx
import { ClipboardList } from 'lucide-react';

const auditItems = [
  { label: 'School context', status: 'Captured' },
  { label: 'Calendar and class rhythm', status: 'Connected' },
  { label: 'Wearable sleep and stress signals', status: 'Ready to connect' },
  { label: 'Medications and care preferences', status: 'Captured' },
  { label: 'Documents and insurance basics', status: 'Needs upload' },
];

export function LifeAuditPanel() {
  return (
    <section className="panel">
      <div className="section-heading">
        <ClipboardList aria-hidden="true" />
        <div>
          <p className="eyebrow">First session</p>
          <h2>Life Audit</h2>
        </div>
      </div>
      <p>The first run builds useful memory without feeling like a medical intake.</p>
      <div className="audit-list">
        {auditItems.map((item) => (
          <article key={item.label}>
            <strong>{item.label}</strong>
            <span>{item.status}</span>
          </article>
        ))}
      </div>
    </section>
  );
}
```

Create `src/components/MemoryProfile.tsx`:

```tsx
import { LockKeyhole } from 'lucide-react';
import type { StudentProfile } from '../domain/types';

interface MemoryProfileProps {
  profile: StudentProfile;
}

export function MemoryProfile({ profile }: MemoryProfileProps) {
  return (
    <section className="panel">
      <div className="section-heading">
        <LockKeyhole aria-hidden="true" />
        <div>
          <p className="eyebrow">Tell it once</p>
          <h2>Private Memory</h2>
        </div>
      </div>
      <p className="profile-line">{profile.year} · {profile.schoolContext}</p>
      <ul className="memory-list">
        {profile.memory.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
      <p className="privacy-note">{profile.privacyMode}</p>
    </section>
  );
}
```

Create `src/components/RoutineOperator.tsx`:

```tsx
import { CalendarCheck } from 'lucide-react';

const routines = [
  { label: 'Sleep recovery', detail: 'Protect 11:30 PM lights-out before lab day.' },
  { label: 'Medication rhythm', detail: 'Morning dose reminder only on class days.' },
  { label: 'Class restart', detail: 'Two missed study blocks converted into one 45-minute reset.' },
  { label: 'Meal fallback', detail: 'Dining hall backup added for lab-heavy days.' },
];

export function RoutineOperator() {
  return (
    <section className="panel">
      <div className="section-heading">
        <CalendarCheck aria-hidden="true" />
        <div>
          <p className="eyebrow">Low-friction follow-through</p>
          <h2>Routine Operator</h2>
        </div>
      </div>
      <div className="routine-list">
        {routines.map((routine) => (
          <article key={routine.label}>
            <strong>{routine.label}</strong>
            <p>{routine.detail}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
```

Create `src/components/ModuleDeck.tsx`:

```tsx
import { Blocks, Plus } from 'lucide-react';
import type { DeepModule } from '../domain/types';

interface ModuleDeckProps {
  activeModules: DeepModule[];
  recommendedModules: DeepModule[];
  activatedModuleIds: string[];
  onActivate: (module: DeepModule) => void;
}

export function ModuleDeck({ activeModules, recommendedModules, activatedModuleIds, onActivate }: ModuleDeckProps) {
  return (
    <section className="panel">
      <div className="section-heading">
        <Blocks aria-hidden="true" />
        <div>
          <p className="eyebrow">Added when life calls for it</p>
          <h2>Deep Modules</h2>
        </div>
      </div>
      <div className="module-grid">
        {activeModules.map((module) => (
          <article className="module-card active" key={module.id}>
            <p className="module-state">Always on</p>
            <h3>{module.name}</h3>
            <p>{module.promise}</p>
          </article>
        ))}
        {recommendedModules.map((module) => {
          const added = activatedModuleIds.includes(module.id);
          return (
            <article className="module-card available" key={module.id}>
              <p className="module-state">{added ? 'Nutrition module added' : 'Available when useful'}</p>
              <h3>{module.name}</h3>
              <p>{module.promise}</p>
              <button
                type="button"
                aria-label={`Add ${module.name.split(' / ')[0]} module`}
                onClick={() => onActivate(module)}
                disabled={added}
              >
                <Plus aria-hidden="true" />
                Add depth
              </button>
            </article>
          );
        })}
      </div>
    </section>
  );
}
```

Create `src/components/DataVault.tsx`:

```tsx
import { FileText } from 'lucide-react';
import type { StudentProfile } from '../domain/types';

interface DataVaultProps {
  profile: StudentProfile;
}

export function DataVault({ profile }: DataVaultProps) {
  return (
    <section className="panel">
      <div className="section-heading">
        <FileText aria-hidden="true" />
        <div>
          <p className="eyebrow">Student-mediated records</p>
          <h2>Document Vault</h2>
        </div>
      </div>
      <div className="vault-list">
        {profile.documents.map((document) => (
          <article key={document.id}>
            <span>{document.kind}</span>
            <strong>{document.title}</strong>
            <p>{document.status}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
```

Create `src/components/AnalyticsPanel.tsx`:

```tsx
import { Activity } from 'lucide-react';
import type { WeeklySummary } from '../domain/types';

interface AnalyticsPanelProps {
  summary: WeeklySummary;
}

export function AnalyticsPanel({ summary }: AnalyticsPanelProps) {
  return (
    <section className="panel">
      <div className="section-heading">
        <Activity aria-hidden="true" />
        <div>
          <p className="eyebrow">Private analytics</p>
          <h2>Weekly Readout</h2>
        </div>
      </div>
      <p className="summary-headline">{summary.headline}</p>
      <ul className="signal-list">
        {summary.signals.map((signal) => (
          <li key={signal}>{signal}</li>
        ))}
      </ul>
      <p className="next-action">{summary.nextBestAction}</p>
    </section>
  );
}
```

Create `src/components/SafetyPanel.tsx`:

```tsx
import { HeartHandshake } from 'lucide-react';
import type { StudentProfile } from '../domain/types';

interface SafetyPanelProps {
  profile: StudentProfile;
}

export function SafetyPanel({ profile }: SafetyPanelProps) {
  return (
    <section className="panel">
      <div className="section-heading">
        <HeartHandshake aria-hidden="true" />
        <div>
          <p className="eyebrow">Consent-based backup</p>
          <h2>Trusted Safety</h2>
        </div>
      </div>
      <p>The agent can help reach out, but only under rules the student controls.</p>
      <div className="contact-row">
        {profile.trustedContacts.map((contact) => (
          <span key={contact}>{contact}</span>
        ))}
      </div>
    </section>
  );
}
```

- [ ] **Step 4: Compose the app**

Replace `src/App.tsx` with:

```tsx
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

      <div className="dashboard-grid">
        <AgentPanel />
        <LifeAuditPanel />
        <ActionQueue actions={actions} completedActions={completedActions} onComplete={completeAction} />
        <MemoryProfile profile={seedStudent} />
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
      </div>
    </main>
  );
}
```

- [ ] **Step 5: Run app tests to verify they pass**

Run:

```bash
npm test -- src/App.test.tsx
```

Expected: PASS.

- [ ] **Step 6: Commit interactive UI**

Run:

```bash
git add src/App.tsx src/App.test.tsx src/components
git commit -m "Build interactive agent prototype"
```

## Task 4: Mobile-First Visual System

**Files:**
- Modify: `src/styles.css`

- [ ] **Step 1: Replace the temporary CSS with the finished mobile-first visual system**

Replace `src/styles.css` with:

```css
:root {
  color: #17201b;
  background: #f4f1e8;
  font-family:
    Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  font-synthesis: none;
  text-rendering: optimizeLegibility;
}

* {
  box-sizing: border-box;
}

body {
  margin: 0;
  min-width: 320px;
}

button {
  border: 0;
  font: inherit;
}

.app-shell {
  min-height: 100vh;
  padding: 18px;
  background:
    linear-gradient(135deg, rgba(23, 32, 27, 0.06), transparent 34%),
    #f4f1e8;
}

.hero {
  display: grid;
  min-height: 34vh;
  align-items: end;
  padding: 28px 4px 24px;
}

.hero h1 {
  max-width: 760px;
  margin: 8px 0 12px;
  font-size: clamp(3rem, 11vw, 6.4rem);
  line-height: 0.9;
  letter-spacing: 0;
}

.hero p:last-child {
  max-width: 620px;
  margin: 0;
  color: #42524a;
  font-size: 1.08rem;
  line-height: 1.5;
}

.dashboard-grid {
  display: grid;
  gap: 14px;
  grid-template-columns: 1fr;
}

.panel,
.agent-panel {
  border: 1px solid rgba(23, 32, 27, 0.14);
  border-radius: 8px;
  background: rgba(255, 252, 244, 0.92);
  padding: 16px;
  box-shadow: 0 18px 50px rgba(23, 32, 27, 0.08);
}

.agent-panel {
  background: #17201b;
  color: #f8f2e4;
}

.section-heading {
  display: flex;
  gap: 10px;
  align-items: center;
  margin-bottom: 14px;
}

.section-heading svg {
  width: 22px;
  height: 22px;
  flex: 0 0 auto;
}

.eyebrow,
.priority,
.module-state {
  margin: 0;
  color: #7b6955;
  font-size: 0.75rem;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.agent-panel .eyebrow,
.agent-panel .trust-strip {
  color: #cbbf9c;
}

h2,
h3 {
  margin: 0;
}

h2 {
  font-size: 1.1rem;
}

h3 {
  font-size: 1rem;
}

p {
  line-height: 1.45;
}

.agent-message {
  padding: 14px;
  border: 1px solid rgba(248, 242, 228, 0.18);
  border-radius: 8px;
  background: rgba(248, 242, 228, 0.08);
}

.agent-message p {
  margin: 0;
}

.trust-strip {
  display: flex;
  gap: 8px;
  align-items: center;
  margin-top: 14px;
  font-size: 0.88rem;
}

.action-list,
.audit-list,
.module-grid,
.routine-list,
.vault-list {
  display: grid;
  gap: 10px;
}

.action-card,
.audit-list article,
.module-card,
.routine-list article,
.vault-list article {
  display: grid;
  gap: 10px;
  border: 1px solid rgba(23, 32, 27, 0.12);
  border-radius: 8px;
  background: #fffaf0;
  padding: 12px;
}

.action-card {
  grid-template-columns: 1fr 42px;
  align-items: start;
}

.action-card.urgent {
  border-left: 5px solid #c83b36;
}

.action-card.high {
  border-left: 5px solid #c97b22;
}

.action-card.medium {
  border-left: 5px solid #386fa4;
}

.action-card p,
.module-card p,
.vault-list p,
.privacy-note,
.profile-line,
.next-action,
.summary-headline {
  margin: 6px 0 0;
  color: #4a584f;
}

.action-card button,
.module-card button {
  display: inline-flex;
  min-height: 40px;
  align-items: center;
  justify-content: center;
  gap: 7px;
  border-radius: 8px;
  background: #17201b;
  color: #fff7e8;
  cursor: pointer;
}

.action-card button {
  width: 40px;
}

.action-card button:disabled,
.module-card button:disabled {
  cursor: default;
  opacity: 0.45;
}

.action-card svg,
.module-card svg {
  width: 18px;
  height: 18px;
}

.completion-note {
  margin-bottom: 0;
  color: #25563d;
  font-weight: 700;
}

.memory-list,
.signal-list {
  display: grid;
  gap: 8px;
  margin: 12px 0;
  padding-left: 18px;
}

.module-card.active {
  background: #eff5ee;
}

.module-card.available {
  background: #fdf7ec;
}

.audit-list article span,
.vault-list article span {
  color: #7b6955;
  font-size: 0.78rem;
  font-weight: 800;
  text-transform: uppercase;
}

.routine-list article p {
  margin: 0;
  color: #4a584f;
}

.contact-row {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 12px;
}

.contact-row span {
  border-radius: 999px;
  background: #e8efe6;
  padding: 8px 10px;
  color: #28392f;
  font-size: 0.9rem;
  font-weight: 700;
}

@media (min-width: 760px) {
  .app-shell {
    padding: 28px;
  }

  .dashboard-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .agent-panel,
  .action-queue {
    grid-column: span 2;
  }
}

@media (min-width: 1120px) {
  .dashboard-grid {
    grid-template-columns: 1.15fr 1fr 1fr;
    align-items: start;
  }

  .agent-panel {
    grid-column: span 1;
    position: sticky;
    top: 24px;
  }

  .action-queue {
    grid-column: span 2;
  }
}
```

- [ ] **Step 2: Run tests and build**

Run:

```bash
npm test
npm run build
```

Expected: both commands exit 0.

- [ ] **Step 3: Commit visual system**

Run:

```bash
git add src/styles.css
git commit -m "Add mobile-first prototype styling"
```

## Task 5: Local Runtime Verification

**Files:**
- No code changes unless verification finds a defect.

- [ ] **Step 1: Start the development server**

Run:

```bash
npm run dev -- --port 5173
```

Expected: Vite serves the app at `http://127.0.0.1:5173/`.

- [ ] **Step 2: Browser smoke test**

Open `http://127.0.0.1:5173/` in the in-app browser and verify:

- The hero is visible and mobile-first.
- The action queue is visible.
- The agent panel explains the privacy promise.
- The Nutrition module can be added on demand.
- The care-level action can be marked done.
- Text fits on desktop and mobile widths.

- [ ] **Step 3: Final verification**

Run:

```bash
npm test
npm run build
git status --short
```

Expected: tests pass, build exits 0, and the only changes are intentional committed changes or no changes.
