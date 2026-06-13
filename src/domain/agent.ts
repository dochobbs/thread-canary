import { getModuleById } from './modules';
import type { AgentAction, DeepModule, Priority, StudentProfile, WeeklySummary } from './types';

const priorityWeight: Record<Priority, number> = {
  urgent: 0,
  high: 1,
  medium: 2,
  low: 3,
};

export function createActionQueue(profile: StudentProfile, activatedModuleIds: string[] = []): AgentAction[] {
  const actions: AgentAction[] = [];
  const activeDepth = new Set(activatedModuleIds);
  const signalIds = new Set(profile.signals.map((signal) => signal.id));

  if (signalIds.has('symptom-red-flag')) {
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

  if (signalIds.has('refill-window')) {
    actions.push({
      id: 'refill-stimulant',
      title: 'Start medication refill',
      detail:
        'Four days left before Friday. Queue the pharmacy task and prepare a prescriber message in case approval is needed.',
      priority: 'high',
      moduleId: 'medication-management',
      eta: 'Today',
    });
  }

  if (signalIds.has('sleep-debt') || signalIds.has('exam-cluster')) {
    actions.push({
      id: 'restart-academic-load',
      title: 'Repair week 7 before midterms hit',
      detail:
        'Sleep debt and the bio/chem/writing midterm cluster are both up. Build a two-day recovery schedule with class, meals, study blocks, and one protected sleep window.',
      priority: 'high',
      moduleId: 'sleep-burnout-academic-load',
      eta: 'Tonight',
    });
  }

  if (signalIds.has('isolation')) {
    actions.push({
      id: 'safety-check-in',
      title: 'Run a consent-based safety check-in',
      detail: 'The app can ask how you want support and draft a message to a trusted contact only if you choose.',
      priority: 'medium',
      moduleId: 'mental-health-safety',
      eta: 'This week',
    });
  }

  if (activeDepth.has('nutrition-patterns') && signalIds.has('missed-meals')) {
    actions.push({
      id: 'nutrition-lab-day-fallback',
      title: 'Build lab-day meal fallback',
      detail:
        'Turn skipped Tuesday/Thursday lab lunches into a repeatable plan: dining hall backup, backpack food, and one post-lab recovery meal.',
      priority: 'medium',
      moduleId: 'nutrition-patterns',
      eta: 'This week',
    });
  }

  if (activeDepth.has('substance-party-safety') && signalIds.has('party-risk')) {
    actions.push({
      id: 'party-safety-plan',
      title: 'Make a safer weekend plan',
      detail:
        'Set a private limit, recovery plan, and roommate check-in for the next tailgate without turning it into a lecture.',
      priority: 'medium',
      moduleId: 'substance-party-safety',
      eta: 'Before weekend',
    });
  }

  if (activeDepth.has('acute-illness-injury') && signalIds.has('symptom-red-flag')) {
    actions.push({
      id: 'acute-symptom-visit-prep',
      title: 'Prepare symptom visit notes',
      detail:
        'Collect onset, fever timing, chest tightness changes, meds taken, and questions so Alex does not have to remember it while sick.',
      priority: 'medium',
      moduleId: 'acute-illness-injury',
      eta: 'Now',
    });
  }

  if (activeDepth.has('admin-insurance') && signalIds.has('insurance-card')) {
    actions.push({
      id: 'insurance-card-complete',
      title: 'Complete insurance basics',
      detail:
        'Capture the back of the card, policy phone number, and campus billing instructions before the next visit creates paperwork.',
      priority: 'medium',
      moduleId: 'admin-insurance',
      eta: 'This week',
    });
  }

  if (activeDepth.has('document-vault-records') && signalIds.has('record-sprawl')) {
    actions.push({
      id: 'records-consolidate',
      title: 'Consolidate scattered records',
      detail: 'Pull the immunization PDF, receipts, clinic note, and sports form into one student-controlled packet.',
      priority: 'medium',
      moduleId: 'document-vault-records',
      eta: 'This week',
    });
  }

  if (activeDepth.has('chronic-condition-support') && signalIds.has('migraine-pattern')) {
    actions.push({
      id: 'migraine-pattern-review',
      title: 'Track stress headache pattern',
      detail:
        'Connect late-week migraines with sleep, meals, stimulant timing, lab days, and screen load before the next visit.',
      priority: 'medium',
      moduleId: 'chronic-condition-support',
      eta: 'This week',
    });
  }

  if (activeDepth.has('identity-sensitive-care') && signalIds.has('identity-care-preference')) {
    actions.push({
      id: 'care-preference-card',
      title: 'Save care preference card',
      detail:
        'Keep chosen name, pronouns, privacy boundaries, and access preferences ready for clinics without sharing them broadly.',
      priority: 'medium',
      moduleId: 'identity-sensitive-care',
      eta: 'This week',
    });
  }

  if (activeDepth.has('sports-fitness-recovery') && signalIds.has('sports-recovery')) {
    actions.push({
      id: 'ankle-recovery-check',
      title: 'Check practice recovery load',
      detail: 'Balance ankle soreness, club soccer, sleep debt, and midterms before the next practice.',
      priority: 'low',
      moduleId: 'sports-fitness-recovery',
      eta: 'Before practice',
    });
  }

  if (activeDepth.has('financial-stress') && signalIds.has('financial-stress')) {
    actions.push({
      id: 'financial-stress-plan',
      title: 'Sort bill and food-budget pressure',
      detail:
        'Separate the lab fee, dining shortfall, work-study payday, and what can be shared with parents without exposing private records.',
      priority: 'medium',
      moduleId: 'financial-stress',
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

  if (profile.signals.some((signal) => signal.id === 'symptom-red-flag')) {
    recommendedIds.add('acute-illness-injury');
  }

  if (profile.signals.some((signal) => signal.id === 'record-sprawl')) {
    recommendedIds.add('document-vault-records');
  }

  if (profile.signals.some((signal) => signal.id === 'migraine-pattern')) {
    recommendedIds.add('chronic-condition-support');
  }

  if (profile.signals.some((signal) => signal.id === 'identity-care-preference')) {
    recommendedIds.add('identity-sensitive-care');
  }

  if (profile.signals.some((signal) => signal.id === 'sports-recovery')) {
    recommendedIds.add('sports-fitness-recovery');
  }

  if (profile.signals.some((signal) => signal.id === 'financial-stress')) {
    recommendedIds.add('financial-stress');
  }

  return profile.availableModuleIds.map((id) => ({ ...getModuleById(id), recommended: recommendedIds.has(id) }));
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
      labels.includes('exam-cluster') ? 'midterm cluster starts in 5 days' : 'academic load is steady',
    ],
    nextBestAction: 'Handle the symptom care decision first, then protect tonight for refill, meals, and sleep recovery.',
  };
}
