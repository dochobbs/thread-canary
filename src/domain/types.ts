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
  activated?: boolean;
  recommended?: boolean;
}

export interface StudentProfileDemographics {
  age: number;
  campus: string;
  residence: string;
  major: string;
  hometown: string;
  chosenName: string;
  pronouns: string;
}

export interface StudentMedication {
  name: string;
  label: string;
  dose: string;
  schedule: string;
  purpose: string;
  refillStatus: string;
}

export interface StudentHealthProfile {
  conditions: Array<{
    name: string;
    status: string;
    notes: string;
  }>;
  currentMedications: StudentMedication[];
  allergies: string[];
  immunizations: Array<{
    name: string;
    status: string;
    detail: string;
  }>;
  currentConcern: {
    summary: string;
    onset: string;
    redFlags: string[];
    recentSelfCare: string[];
    visitPrep: string[];
  };
  carePreferences: string[];
}

export interface StudentCareTimelineEvent {
  id: string;
  when: string;
  title: string;
  detail: string;
  source: string;
}

export interface StudentCalendarEvent {
  id: string;
  when: string;
  title: string;
  type: string;
  impact: string;
}

export interface StudentSupportContact {
  name: string;
  relationship: string;
  canHelpWith: string;
  shareRule: string;
}

export interface StudentProfile {
  name: string;
  year: string;
  schoolContext: string;
  privacyMode: string;
  demographics: StudentProfileDemographics;
  healthProfile: StudentHealthProfile;
  careTimeline: StudentCareTimelineEvent[];
  wearableSummary: {
    lastSynced: string;
    sleep: string;
    strain: string;
    recovery: string;
    activity: string;
  };
  academicCalendar: StudentCalendarEvent[];
  supportMap: StudentSupportContact[];
  familyContext: string[];
  finances: {
    status: string;
    openItems: string[];
    parentBoundary: string;
  };
  insurance: {
    carrier: string;
    plan: string;
    studentHealthCenter: string;
    preferredPharmacy: string;
    missingItems: string[];
  };
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
  completed?: boolean;
}

export interface WeeklySummary {
  headline: string;
  signals: string[];
  nextBestAction: string;
}
