import { describe, expect, it, vi } from 'vitest';
import { createThreadAgentResponder, threadAgentSystemPrompt } from './threadAgent.mjs';

const sampleContext = {
  profile: {
    name: 'Alex Rivera',
    year: 'First-year student',
    schoolContext: 'Week 7',
    trustedContacts: ['Jordan'],
    memory: ['Refill due Friday.'],
    demographics: { age: 18, campus: 'Northview State University', residence: 'Hawthorne Hall room 318' },
    healthProfile: {
      currentMedications: [{ name: 'lisdexamfetamine', dose: '30 mg', schedule: '8:00 AM on class days' }],
      allergies: ['amoxicillin - rash as a child'],
      currentConcern: { summary: 'Chest tightness and fever', redFlags: ['chest tightness plus fever worse since yesterday'] },
    },
    careTimeline: [{ id: 'weekend-cough', when: 'Week 7 Sunday', title: 'Cough started after tailgate' }],
    academicCalendar: [{ id: 'chem-midterm', title: 'CHEM 101 midterm' }],
    wearableSummary: { sleep: '5h 42m average last 3 nights' },
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
  it('enables model mode by default when an API key is configured', () => {
    expect(createThreadAgentResponder({ env: {}, fetchImpl: vi.fn() })).toBeNull();
    expect(createThreadAgentResponder({ env: { OPENAI_API_KEY: 'test-key' }, fetchImpl: vi.fn() })).toBeTruthy();
    expect(
      createThreadAgentResponder({ env: { OPENAI_API_KEY: 'test-key', THREAD_AGENT_LLM: '0' }, fetchImpl: vi.fn() }),
    ).toBeNull();
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

    expect(reply).toEqual({ text: 'Draft the professor message.', source: 'llm', model: 'demo-model' });
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
    expect(request.input[1].content[0].text).toContain('lisdexamfetamine');
    expect(request.input[1].content[0].text).toContain('weekend-cough');
    expect(request.input[1].content[0].text).toContain('CHEM 101 midterm');
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
