import { describe, expect, it, vi } from 'vitest';
import { MIN_AGENT_WORKING_MS, waitForAgentWorkingDwell } from './agentTiming';

describe('agent timing', () => {
  it('waits out the remaining working-state dwell time', async () => {
    const sleep = vi.fn(() => Promise.resolve());

    await waitForAgentWorkingDwell(1000, 1225, sleep);

    expect(sleep).toHaveBeenCalledWith(MIN_AGENT_WORKING_MS - 225);
  });

  it('does not add delay once the request already took long enough', async () => {
    const sleep = vi.fn(() => Promise.resolve());

    await waitForAgentWorkingDwell(1000, 1000 + MIN_AGENT_WORKING_MS + 1, sleep);

    expect(sleep).not.toHaveBeenCalled();
  });
});
