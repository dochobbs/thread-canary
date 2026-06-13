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
