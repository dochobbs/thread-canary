import type { AgentAction, DeepModule, StudentProfile, WeeklySummary } from '../domain/types';

export interface CanaryEvent {
  id: string;
  type: string;
  payload: Record<string, unknown>;
  createdAt: string;
}

export interface AgentMessage {
  id: string;
  role: 'student' | 'assistant';
  text: string;
  createdAt: string;
}

export interface CanaryState {
  profile: StudentProfile;
  actions: AgentAction[];
  completedActionIds: string[];
  activatedModuleIds: string[];
  activeModules: DeepModule[];
  recommendedModules: DeepModule[];
  weeklySummary: WeeklySummary;
  agentMessages: AgentMessage[];
  events: CanaryEvent[];
}

export interface AgentMessageResult {
  reply: AgentMessage;
  state: CanaryState;
}

export interface DocumentInput {
  title: string;
  kind?: string;
  status?: string;
}

async function requestJson<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(path, {
    ...init,
    headers: {
      ...(init?.body ? { 'content-type': 'application/json' } : {}),
      ...init?.headers,
    },
  });

  const payload = await response.json();
  if (!response.ok) {
    throw new Error(payload.error ?? 'Canary request failed.');
  }

  return payload;
}

function requestCanaryState(path: string, init?: RequestInit) {
  return requestJson<CanaryState>(path, init);
}

export function getCanaryState() {
  return requestCanaryState('/api/canary-state');
}

export function completeCanaryAction(actionId: string) {
  return requestCanaryState(`/api/actions/${encodeURIComponent(actionId)}/complete`, { method: 'POST' });
}

export function activateCanaryModule(moduleId: string) {
  return requestCanaryState(`/api/modules/${encodeURIComponent(moduleId)}/activate`, { method: 'POST' });
}

export function addCanaryMemory(text: string) {
  return requestCanaryState('/api/memory', {
    method: 'POST',
    body: JSON.stringify({ text }),
  });
}

export function addCanaryDocument(document: DocumentInput) {
  return requestCanaryState('/api/documents', {
    method: 'POST',
    body: JSON.stringify(document),
  });
}

export function sendCanaryAgentMessage(text: string) {
  return requestJson<AgentMessageResult>('/api/agent/messages', {
    method: 'POST',
    body: JSON.stringify({ text }),
  });
}
