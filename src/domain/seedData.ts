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
