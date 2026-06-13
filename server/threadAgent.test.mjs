import { describe, expect, it, vi } from 'vitest';
import { createThreadAgentResponder, threadAgentSystemPrompt } from './threadAgent.mjs';

const sampleContext = {
  profile: {
    name: 'Alex Rivera',
    year: 'First-year student',
    schoolContext: 'Week 7',
    trustedContacts: ['Jordan'],
    memory: ['Refill due Friday.'],
    signals: [{ id: 'sleep-debt', label: 'Sleep debt', value: '3 nights under 6.5 hours' }],
    documents: [{ id: 'insurance', title: 'Insurance card', status: 'Back missing' }],
  },
  openActions: [{ id: 'care-red-flag', title: 'Decide care level for symptoms' }],
  activeModules: [{ id: 'care-navigation', name: 'Care Navigation', promise: 'Help choose care level' }],
  recommendedModules: [{ id: 'admin-insurance', name: 'Admin / Insurance', recommended: true }],
  weeklySummary: { headline: '3 things need attention' },
  recentMessages: [{ role: 'student', text: 'What should I say to my professor?' }],
};

describe('thread agent responder', () => {
  it('stays disabled unless model mode and an API key are configured', () => {
    expect(createThreadAgentResponder({ env: {}, fetchImpl: vi.fn() })).toBeNull();
    expect(createThreadAgentResponder({ env: { OPENAI_API_KEY: 'test-key' }, fetchImpl: vi.fn() })).toBeNull();
    expect(createThreadAgentResponder({ env: { THREAD_AGENT_LLM: '1' }, fetchImpl: vi.fn() })).toBeNull();
  });

  it('calls the Responses API with the private-operator prompt and student context', async () => {
    const fetchImpl = vi.fn(async () => ({
      ok: true,
      json: async () => ({ output_text: 'Draft the professor message.' }),
    }));
    const responder = createThreadAgentResponder({
      env: { THREAD_AGENT_LLM: '1', THREAD_AGENT_OPENAI_API_KEY: 'thread-key', THREAD_AGENT_MODEL: 'demo-model' },
      fetchImpl,
    });

    const reply = await responder({ text: 'What should I say to my professor?', context: sampleContext });
    const request = JSON.parse(fetchImpl.mock.calls[0][1].body);

    expect(reply).toBe('Draft the professor message.');
    expect(fetchImpl).toHaveBeenCalledWith(
      'https://api.openai.com/v1/responses',
      expect.objectContaining({
        method: 'POST',
        headers: expect.objectContaining({ authorization: 'Bearer thread-key' }),
      }),
    );
    expect(request.model).toBe('demo-model');
    expect(request.input[0].content[0].text).toBe(threadAgentSystemPrompt);
    expect(request.input[1].content[0].text).toContain('What should I say to my professor?');
    expect(request.input[1].content[0].text).toContain('Alex Rivera');
    expect(request.input[1].content[0].text).toContain('care-red-flag');
  });

  it('throws a useful error when the model request fails', async () => {
    const responder = createThreadAgentResponder({
      env: { THREAD_AGENT_LLM: '1', OPENAI_API_KEY: 'test-key' },
      fetchImpl: async () => ({
        ok: false,
        status: 429,
        json: async () => ({ error: { message: 'rate limited' } }),
      }),
    });

    await expect(responder({ text: 'Help', context: sampleContext })).rejects.toThrow('rate limited');
  });
});
