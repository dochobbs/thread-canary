import { mkdir, readFile, rename, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';

export const seedProfile = {
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
    {
      id: 'symptom-red-flag',
      label: 'Chest tightness plus fever note',
      value: 'worse since yesterday',
      severity: 'urgent',
    },
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

export const moduleRegistry = [
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

const defaultActiveModuleIds = [
  'executive-function',
  'sleep-burnout-academic-load',
  'medication-management',
  'care-navigation',
  'mental-health-safety',
];

const priorityWeight = {
  urgent: 0,
  high: 1,
  medium: 2,
  low: 3,
};

function createSeedState() {
  return {
    profile: structuredClone(seedProfile),
    completedActionIds: [],
    activatedModuleIds: [],
    events: [],
  };
}

function normalizeState(state) {
  return {
    ...state,
    profile: {
      ...structuredClone(seedProfile),
      ...state.profile,
      activeModuleIds: state.profile?.activeModuleIds ?? seedProfile.activeModuleIds,
      availableModuleIds: state.profile?.availableModuleIds ?? seedProfile.availableModuleIds,
      memory: state.profile?.memory ?? seedProfile.memory,
      trustedContacts: state.profile?.trustedContacts ?? seedProfile.trustedContacts,
      signals: state.profile?.signals ?? seedProfile.signals,
      documents: state.profile?.documents ?? seedProfile.documents,
    },
    completedActionIds: state.completedActionIds ?? [],
    activatedModuleIds: state.activatedModuleIds ?? [],
    events: state.events ?? [],
  };
}

function createActionQueue(profile, completedActionIds) {
  const actions = [];

  if (profile.signals.some((signal) => signal.id === 'symptom-red-flag')) {
    actions.push({
      id: 'care-red-flag',
      title: 'Decide care level for symptoms',
      detail:
        'Chest tightness plus fever changed since yesterday. Prepare a short symptom history and choose campus clinic, urgent care, or emergency care based on current severity.',
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
      detail:
        'Sleep debt and exam clustering are both up. Build a two-day recovery schedule with class, meals, study blocks, and one protected sleep window.',
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

  return actions
    .sort((a, b) => priorityWeight[a.priority] - priorityWeight[b.priority])
    .map((action) => ({ ...action, completed: completedActionIds.includes(action.id) }));
}

function recommendModules(profile, activatedModuleIds) {
  const recommendedIds = new Set();

  if (profile.signals.some((signal) => signal.id === 'missed-meals')) {
    recommendedIds.add('nutrition-patterns');
  }

  if (profile.signals.some((signal) => signal.id === 'party-risk')) {
    recommendedIds.add('substance-party-safety');
  }

  if (profile.signals.some((signal) => signal.id === 'insurance-card')) {
    recommendedIds.add('admin-insurance');
  }

  return Array.from(recommendedIds).map((id) => {
    const module = moduleRegistry.find((item) => item.id === id);
    return { ...module, activated: activatedModuleIds.includes(id) };
  });
}

function summarizeWeek(profile, completedActionIds) {
  const actions = createActionQueue(profile, completedActionIds);
  const attentionActions = actions.filter((action) => !action.completed && ['urgent', 'high'].includes(action.priority));
  const labels = profile.signals.map((signal) => signal.id);

  return {
    headline: `${attentionActions.length} things need attention before the week gets away from you.`,
    signals: [
      labels.includes('sleep-debt') ? 'sleep debt is up' : 'sleep is stable',
      labels.includes('refill-window') ? 'medication refill is close' : 'medications look current',
      labels.includes('exam-cluster') ? 'exam cluster starts in 5 days' : 'academic load is steady',
    ],
    nextBestAction: 'Handle the symptom care decision first, then protect tonight for refill and sleep recovery.',
  };
}

function buildCanaryState(state) {
  const activeModuleIds = Array.from(new Set([...defaultActiveModuleIds, ...state.activatedModuleIds]));
  return {
    profile: state.profile,
    actions: createActionQueue(state.profile, state.completedActionIds),
    completedActionIds: state.completedActionIds,
    activatedModuleIds: state.activatedModuleIds,
    activeModules: moduleRegistry.filter((module) => activeModuleIds.includes(module.id)),
    recommendedModules: recommendModules(state.profile, state.activatedModuleIds),
    weeklySummary: summarizeWeek(state.profile, state.completedActionIds),
    events: state.events,
  };
}

async function readState(filePath) {
  try {
    const raw = await readFile(filePath, 'utf8');
    return normalizeState(JSON.parse(raw));
  } catch (error) {
    if (error.code === 'ENOENT') {
      return createSeedState();
    }
    throw error;
  }
}

async function writeState(filePath, state) {
  await mkdir(dirname(filePath), { recursive: true });
  const tempPath = `${filePath}.tmp`;
  await writeFile(tempPath, `${JSON.stringify(state, null, 2)}\n`);
  await rename(tempPath, filePath);
}

function appendEvent(state, type, payload) {
  state.events.push({
    id: `${Date.now()}-${state.events.length + 1}`,
    type,
    payload,
    createdAt: new Date().toISOString(),
  });
}

export async function createCanaryStore(options = {}) {
  const filePath = options.filePath ?? join(process.cwd(), '.data', 'canary-state.json');
  let state = await readState(filePath);
  await writeState(filePath, state);

  async function persist() {
    await writeState(filePath, state);
    return buildCanaryState(state);
  }

  return {
    async getCanaryState() {
      return buildCanaryState(state);
    },

    async completeAction(actionId) {
      const action = createActionQueue(state.profile, state.completedActionIds).find((item) => item.id === actionId);
      if (!action) {
        const error = new Error(`Unknown action: ${actionId}`);
        error.statusCode = 404;
        throw error;
      }
      if (!state.completedActionIds.includes(actionId)) {
        state.completedActionIds.push(actionId);
        appendEvent(state, 'action.completed', { actionId });
      }
      return persist();
    },

    async activateModule(moduleId) {
      const module = moduleRegistry.find((item) => item.id === moduleId);
      if (!module) {
        const error = new Error(`Unknown module: ${moduleId}`);
        error.statusCode = 404;
        throw error;
      }
      if (!state.activatedModuleIds.includes(moduleId)) {
        state.activatedModuleIds.push(moduleId);
        appendEvent(state, 'module.activated', { moduleId });
      }
      return persist();
    },

    async addMemory(text) {
      const normalized = String(text ?? '').trim();
      if (!normalized) {
        const error = new Error('Memory text is required.');
        error.statusCode = 400;
        throw error;
      }
      if (!state.profile.memory.includes(normalized)) {
        state.profile.memory.push(normalized);
        appendEvent(state, 'memory.added', { text: normalized });
      }
      return persist();
    },

    async addDocument(document) {
      const title = String(document?.title ?? '').trim();
      if (!title) {
        const error = new Error('Document title is required.');
        error.statusCode = 400;
        throw error;
      }
      const nextDocument = {
        id: document.id ?? `doc-${Date.now()}`,
        title,
        kind: document.kind ?? 'Uploaded document',
        status: document.status ?? 'Captured',
      };
      state.profile.documents.push(nextDocument);
      appendEvent(state, 'document.added', { documentId: nextDocument.id });
      return persist();
    },
  };
}
