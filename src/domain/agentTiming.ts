export const MIN_AGENT_WORKING_MS = 850;

function sleep(ms: number) {
  return new Promise<void>((resolve) => {
    window.setTimeout(resolve, ms);
  });
}

export async function waitForAgentWorkingDwell(
  startedAt: number,
  finishedAt = Date.now(),
  sleepFn: (ms: number) => Promise<void> = sleep,
) {
  const elapsed = finishedAt - startedAt;
  const remaining = MIN_AGENT_WORKING_MS - elapsed;

  if (remaining > 0) {
    await sleepFn(remaining);
  }
}
