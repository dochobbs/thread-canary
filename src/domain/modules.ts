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
