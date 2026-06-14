import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import App from './App';
import type { CanaryState } from './api/client';
import { createActionQueue, recommendModules, summarizeWeek } from './domain/agent';
import { modules } from './domain/modules';
import { seedStudent } from './domain/seedData';

let mockState: CanaryState;

function createMockState(): CanaryState {
  return {
    profile: structuredClone(seedStudent),
    actions: createActionQueue(seedStudent).map((action) => ({ ...action, completed: false })),
    completedActionIds: [],
    activatedModuleIds: [],
    customActions: [],
    artifacts: [],
    demoMoments: [
      {
        id: 'urgent-care',
        label: 'Urgent care?',
        prompt: 'Do I need urgent care tonight? Prepare what I should tell them.',
      },
      {
        id: 'parent-update',
        label: 'Parent text',
        prompt: 'What do I tell my mom without giving her everything?',
      },
      {
        id: 'lab-ta-message',
        label: 'Lab TA',
        prompt: 'What should I say to my lab TA if I miss lab?',
      },
      {
        id: 'add-acute-module',
        label: 'Add acute depth',
        prompt: 'Add the acute illness module. What changes?',
      },
      {
        id: 'tonight-plan',
        label: 'Tonight plan',
        prompt: 'Make me a plan for tonight.',
      },
    ],
    activeModules: modules.filter((module) => seedStudent.activeModuleIds.includes(module.id)),
    recommendedModules: recommendModules(seedStudent).map((module) => ({ ...module, activated: false })),
    weeklySummary: summarizeWeek(seedStudent),
    agentMessages: [],
    events: [],
  };
}

function jsonResponse(payload: unknown, status = 200) {
  return Promise.resolve(
    new Response(JSON.stringify(payload), {
      status,
      headers: { 'content-type': 'application/json' },
    }),
  );
}

function readPath(input: RequestInfo | URL) {
  const raw = typeof input === 'string' ? input : input instanceof URL ? input.toString() : input.url;
  return raw.startsWith('http') ? new URL(raw).pathname : raw;
}

function readBody(init?: RequestInit) {
  return init?.body ? JSON.parse(String(init.body)) : {};
}

function createDeferred<T>() {
  let resolve!: (value: T) => void;
  let reject!: (reason?: unknown) => void;
  const promise = new Promise<T>((promiseResolve, promiseReject) => {
    resolve = promiseResolve;
    reject = promiseReject;
  });
  return { promise, resolve, reject };
}

beforeEach(() => {
  mockState = createMockState();
  vi.stubGlobal(
    'fetch',
    vi.fn((input: RequestInfo | URL, init?: RequestInit) => {
      const path = readPath(input);

      if (path === '/api/canary-state') {
        return jsonResponse(mockState);
      }

      if (path === '/api/actions/care-red-flag/complete' && init?.method === 'POST') {
        mockState = {
          ...mockState,
          completedActionIds: ['care-red-flag'],
          actions: mockState.actions.map((action) =>
            action.id === 'care-red-flag' ? { ...action, completed: true } : action,
          ),
        };
        return jsonResponse(mockState);
      }

      if (path === '/api/modules/nutrition-patterns/activate' && init?.method === 'POST') {
        mockState = {
          ...mockState,
          activatedModuleIds: ['nutrition-patterns'],
          actions: [
            ...mockState.actions,
            {
              id: 'nutrition-lab-day-fallback',
              title: 'Build lab-day meal fallback',
              detail: 'Turn skipped lunches into a realistic lab-day food plan.',
              priority: 'medium',
              moduleId: 'nutrition-patterns',
              eta: 'This week',
              completed: false,
            },
          ],
          activeModules: [
            ...mockState.activeModules,
            modules.find((module) => module.id === 'nutrition-patterns')!,
          ],
          recommendedModules: mockState.recommendedModules.map((module) =>
            module.id === 'nutrition-patterns' ? { ...module, activated: true } : module,
          ),
        };
        return jsonResponse(mockState);
      }

      if (path === '/api/memory' && init?.method === 'POST') {
        const body = readBody(init);
        mockState = {
          ...mockState,
          profile: {
            ...mockState.profile,
            memory: [...mockState.profile.memory, body.text],
          },
        };
        return jsonResponse(mockState);
      }

      if (path === '/api/documents' && init?.method === 'POST') {
        const body = readBody(init);
        mockState = {
          ...mockState,
          profile: {
            ...mockState.profile,
            documents: [
              ...mockState.profile.documents,
              {
                id: 'doc-test',
                title: body.title,
                kind: body.kind,
                status: body.status,
              },
            ],
          },
        };
        return jsonResponse(mockState);
      }

      if (path === '/api/agent/messages' && init?.method === 'POST') {
        const body = readBody(init);
        const toolCalls = String(body.text).toLowerCase().includes('urgent care')
          ? [
              {
                name: 'prepare_urgent_care_note',
                label: 'Prepared urgent care note',
                status: 'done' as const,
                artifactId: 'urgent-care-visit-note',
              },
            ]
          : [];
        const artifacts = String(body.text).toLowerCase().includes('urgent care')
          ? [
              {
                id: 'urgent-care-visit-note',
                kind: 'visit_note',
                title: 'Urgent care note',
                audience: 'urgent care triage',
                consent: 'student-controlled',
                body: 'Fever and chest tightness worse since yesterday. Bring medication list and allergy.',
                createdAt: '2026-06-13T20:00:01.000Z',
                updatedAt: '2026-06-13T20:00:01.000Z',
              },
            ]
          : mockState.artifacts;
        const replyText =
          String(body.text).toLowerCase().includes('parent') || String(body.text).toLowerCase().includes('mom')
          ? "Send this: I am okay enough to handle tonight. It is a heavy week, but I have a plan. Please don't call around. It calms them down without handing over symptoms, medication details, or records."
          : String(body.text).toLowerCase().includes('urgent care')
            ? 'I prepared the urgent care note and share packet.'
          : 'Put the care level decision first. I can help you prepare the symptom history.';
        const studentMessage = {
          id: 'student-message-test',
          role: 'student' as const,
          text: body.text,
          createdAt: '2026-06-13T20:00:00.000Z',
        };
        const assistantMessage = {
          id: 'assistant-message-test',
          role: 'assistant' as const,
          text: replyText,
          source: 'llm' as const,
          model: 'demo-model',
          toolCalls,
          createdAt: '2026-06-13T20:00:01.000Z',
        };
        mockState = {
          ...mockState,
          artifacts,
          agentMessages: [studentMessage, assistantMessage],
        };
        return jsonResponse({ reply: assistantMessage, state: mockState });
      }

      return jsonResponse({ error: 'Not found' }, 404);
    }),
  );
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('THREAD app shell', () => {
  it('renders the THREAD agent-first home without exposing every secondary surface', async () => {
    render(<App />);

    expect(screen.getByRole('heading', { name: /^thread$/i })).toBeInTheDocument();
    expect(screen.getByText(/your life\. understood\. what matters next\./i)).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /good morning, alex rivera/i })).toBeInTheDocument();
    expect(screen.getByText(/i've been keeping track/i)).toBeInTheDocument();
    expect(await screen.findByRole('heading', { name: /action queue/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /current/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /context readout/i })).toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: /deep modules/i })).not.toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: /document vault/i })).not.toBeInTheDocument();
  });

  it('keeps secondary tools behind tabs', async () => {
    const user = userEvent.setup();
    render(<App />);

    expect(await screen.findByRole('heading', { name: /action queue/i })).toBeInTheDocument();
    expect(screen.getByRole('tablist', { name: /thread sections/i })).toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: /private memory/i })).not.toBeInTheDocument();

    await user.click(screen.getByRole('tab', { name: /timeline/i }));

    expect(screen.getByRole('heading', { name: /life audit/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /private memory/i })).toBeInTheDocument();
  });

  it('activates an on-demand module only after the student chooses it', async () => {
    const user = userEvent.setup();
    render(<App />);

    expect(await screen.findByRole('heading', { name: /action queue/i })).toBeInTheDocument();
    await user.click(screen.getByRole('tab', { name: /tasks/i }));

    expect(screen.getByText(/nutrition \/ eating patterns/i)).toBeInTheDocument();
    expect(screen.getAllByText(/recommended now/i).length).toBeGreaterThan(1);
    expect(screen.getByText(/sexual health \/ privacy/i)).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /add nutrition module/i }));

    expect(screen.getByText(/nutrition module added/i)).toBeInTheDocument();
    await user.click(screen.getByRole('tab', { name: /current/i }));
    expect(screen.getByText(/build lab-day meal fallback/i)).toBeInTheDocument();
  });

  it('lets the student complete an agent action', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(await screen.findByRole('button', { name: /mark decide care level for symptoms done/i }));

    expect(screen.getByText(/completed: decide care level for symptoms/i)).toBeInTheDocument();
  });

  it('lets the student message the agent from the default mobile surface', async () => {
    const user = userEvent.setup();
    render(<App />);

    expect(await screen.findByRole('heading', { name: /action queue/i })).toBeInTheDocument();
    await user.type(screen.getByLabelText(/message agent/i), 'I have chest tightness and fever');
    await user.click(screen.getByRole('button', { name: /send to agent/i }));

    expect(await screen.findByText(/put the care level decision first/i)).toBeInTheDocument();
    expect(screen.getByText(/llm/i)).toBeInTheDocument();
    expect(fetch).toHaveBeenCalledWith(
      '/api/agent/messages',
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({ text: 'I have chest tightness and fever' }),
      }),
    );
  });

  it('offers five guided demo moments from the mobile agent surface', async () => {
    const user = userEvent.setup();
    render(<App />);

    expect(await screen.findByRole('heading', { name: /action queue/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /urgent care\?/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /parent text/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /lab ta/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /add acute depth/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /tonight plan/i })).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /add acute depth/i }));

    expect(fetch).toHaveBeenCalledWith(
      '/api/agent/messages',
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({ text: 'Add the acute illness module. What changes?' }),
      }),
    );
  });

  it('shows agent-created artifacts on the default mobile surface', async () => {
    const user = userEvent.setup();
    render(<App />);

    expect(await screen.findByRole('heading', { name: /action queue/i })).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: /urgent care\?/i }));

    expect(await screen.findByRole('heading', { name: /agent outputs/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /urgent care note/i })).toBeInTheDocument();
    expect(screen.getByText(/prepared the urgent care note/i)).toBeInTheDocument();
  });

  it('shows the agent checking context while a reply is in flight', async () => {
    const user = userEvent.setup();
    const agentResponse = createDeferred<Response>();
    vi.mocked(fetch).mockImplementation((input: RequestInfo | URL, init?: RequestInit) => {
      const path = readPath(input);

      if (path === '/api/canary-state') {
        return jsonResponse(mockState);
      }

      if (path === '/api/agent/messages' && init?.method === 'POST') {
        return agentResponse.promise;
      }

      return jsonResponse({ error: 'Not found' }, 404);
    });
    render(<App />);

    expect(await screen.findByRole('heading', { name: /action queue/i })).toBeInTheDocument();
    await user.type(screen.getByLabelText(/message agent/i), 'Can you help me email my lab TA?');
    await user.click(screen.getByRole('button', { name: /send to agent/i }));

    expect(screen.getByText(/checking memory and context/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /send to agent/i })).toBeDisabled();

    agentResponse.resolve(
      new Response(
        JSON.stringify({
          reply: {
            id: 'assistant-message-test',
            role: 'assistant',
            text: 'Draft the lab TA email.',
            source: 'llm',
            model: 'demo-model',
            createdAt: 'now',
          },
          state: {
            ...mockState,
            agentMessages: [
              { id: 'student-message-test', role: 'student', text: 'Can you help me email my lab TA?', createdAt: 'now' },
              {
                id: 'assistant-message-test',
                role: 'assistant',
                text: 'Draft the lab TA email.',
                source: 'llm',
                model: 'demo-model',
                createdAt: 'now',
              },
            ],
          },
        }),
        { status: 200, headers: { 'content-type': 'application/json' } },
      ),
    );

    expect(await screen.findByText(/draft the lab ta email/i)).toBeInTheDocument();
  });

  it('lets the agent draft a parent-safe reassurance update from a quick tool', async () => {
    const user = userEvent.setup();
    render(<App />);

    expect(await screen.findByRole('heading', { name: /action queue/i })).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: /draft parent-safe update/i }));

    expect(await screen.findByText(/send this/i)).toBeInTheDocument();
    expect(screen.getByText(/without handing over symptoms, medication details, or records/i)).toBeInTheDocument();
    expect(fetch).toHaveBeenCalledWith(
      '/api/agent/messages',
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({ text: 'What do I tell my mom without giving her everything?' }),
      }),
    );
  });

  it('saves student memory through the canary API', async () => {
    const user = userEvent.setup();
    render(<App />);

    expect(await screen.findByRole('heading', { name: /action queue/i })).toBeInTheDocument();
    await user.click(screen.getByRole('tab', { name: /timeline/i }));
    await user.type(screen.getByLabelText(/add memory/i), 'Needs quiet breakfast before chemistry lab.');
    await user.click(screen.getByRole('button', { name: /save memory/i }));

    expect(await screen.findByText(/needs quiet breakfast before chemistry lab/i)).toBeInTheDocument();
    expect(fetch).toHaveBeenCalledWith(
      '/api/memory',
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({ text: 'Needs quiet breakfast before chemistry lab.' }),
      }),
    );
  });

  it('saves student-mediated records through the canary API', async () => {
    const user = userEvent.setup();
    render(<App />);

    expect(await screen.findByRole('heading', { name: /action queue/i })).toBeInTheDocument();
    await user.click(screen.getByRole('tab', { name: /vault/i }));
    await user.type(screen.getByLabelText(/add record/i), 'Campus clinic receipt');
    await user.selectOptions(screen.getByLabelText(/record type/i), 'Receipt');
    await user.click(screen.getByRole('button', { name: /add record/i }));

    expect(await screen.findByText(/campus clinic receipt/i)).toBeInTheDocument();
    expect(fetch).toHaveBeenCalledWith(
      '/api/documents',
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({ title: 'Campus clinic receipt', kind: 'Receipt', status: 'Captured' }),
      }),
    );
  });
});
