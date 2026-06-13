import { mkdtemp, readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { describe, expect, it } from 'vitest';
import { createCanaryStore } from './canaryStore.mjs';

async function createTempStore() {
  const dir = await mkdtemp(join(tmpdir(), 'college-os-canary-'));
  const filePath = join(dir, 'state.json');
  const store = await createCanaryStore({ filePath });
  return { filePath, store };
}

describe('canary store', () => {
  it('loads seed state when no persisted file exists', async () => {
    const { store } = await createTempStore();

    const state = await store.getCanaryState();

    expect(state.profile.name).toBe('Maya');
    expect(state.actions.map((action) => action.id)).toContain('care-red-flag');
    expect(state.activeModules.map((module) => module.id)).toContain('care-navigation');
    expect(state.recommendedModules.map((module) => module.id)).toContain('nutrition-patterns');
  });

  it('persists completed actions', async () => {
    const { filePath, store } = await createTempStore();

    const state = await store.completeAction('care-red-flag');
    const persisted = JSON.parse(await readFile(filePath, 'utf8'));

    expect(state.completedActionIds).toContain('care-red-flag');
    expect(state.actions.find((action) => action.id === 'care-red-flag')).toMatchObject({ completed: true });
    expect(persisted.completedActionIds).toContain('care-red-flag');
  });

  it('persists activated modules without changing the module registry silently', async () => {
    const { filePath, store } = await createTempStore();

    const state = await store.activateModule('nutrition-patterns');
    const persisted = JSON.parse(await readFile(filePath, 'utf8'));

    expect(state.activatedModuleIds).toContain('nutrition-patterns');
    expect(state.recommendedModules.find((module) => module.id === 'nutrition-patterns')).toMatchObject({
      activated: true,
    });
    expect(persisted.activatedModuleIds).toContain('nutrition-patterns');
  });

  it('persists student memory additions', async () => {
    const { filePath, store } = await createTempStore();

    const state = await store.addMemory('Has a Saturday morning lab during finals week.');
    const persisted = JSON.parse(await readFile(filePath, 'utf8'));

    expect(state.profile.memory).toContain('Has a Saturday morning lab during finals week.');
    expect(persisted.profile.memory).toContain('Has a Saturday morning lab during finals week.');
  });
});
