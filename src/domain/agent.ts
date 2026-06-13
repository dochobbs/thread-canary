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
  const attentionActions = createActionQueue(profile).filter(
    (action) => action.priority === 'urgent' || action.priority === 'high',
  );
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
