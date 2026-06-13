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

    expect(state.profile.name).toBe('Alex Rivera');
    expect(state.profile.schoolContext).toContain('Week 7');
    expect(state.profile.activeModuleIds).toContain('care-navigation');
    expect(state.profile.availableModuleIds).toHaveLength(10);
    expect(state.profile.availableModuleIds).toContain('nutrition-patterns');
    expect(state.profile.availableModuleIds).toContain('financial-stress');
    expect(state.actions.map((action) => action.id)).toContain('care-red-flag');
    expect(state.activeModules.map((module) => module.id)).toContain('care-navigation');
    expect(state.recommendedModules.map((module) => module.id)).toContain('nutrition-patterns');
    expect(state.recommendedModules.map((module) => module.id)).toContain('sexual-health-privacy');
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
    expect(state.activeModules.map((module) => module.id)).toContain('nutrition-patterns');
    expect(state.actions.map((action) => action.id)).toContain('nutrition-lab-day-fallback');
    expect(state.recommendedModules.find((module) => module.id === 'nutrition-patterns')).toMatchObject({
      activated: true,
      recommended: true,
    });
    expect(persisted.activatedModuleIds).toContain('nutrition-patterns');
  });

  it('keeps on-demand module actions out of the queue until the module is active', async () => {
    const { store } = await createTempStore();

    const before = await store.getCanaryState();
    const after = await store.activateModule('financial-stress');

    expect(before.actions.map((action) => action.id)).not.toContain('financial-stress-plan');
    expect(after.actions.find((action) => action.id === 'financial-stress-plan')).toMatchObject({
      title: 'Sort bill and food-budget pressure',
      moduleId: 'financial-stress',
    });
  });

  it('persists student memory additions', async () => {
    const { filePath, store } = await createTempStore();

    const state = await store.addMemory('Has a Saturday morning lab during finals week.');
    const persisted = JSON.parse(await readFile(filePath, 'utf8'));

    expect(state.profile.memory).toContain('Has a Saturday morning lab during finals week.');
    expect(persisted.profile.memory).toContain('Has a Saturday morning lab during finals week.');
  });

  it('updates matching documents instead of duplicating them', async () => {
    const { store } = await createTempStore();

    await store.addDocument({ title: 'Canary smoke record', kind: 'Receipt', status: 'Captured' });
    const state = await store.addDocument({ title: 'Canary smoke record', kind: 'Receipt', status: 'Needs review' });
    const matches = state.profile.documents.filter(
      (document) => document.title === 'Canary smoke record' && document.kind === 'Receipt',
    );

    expect(matches).toHaveLength(1);
    expect(matches[0].status).toBe('Needs review');
  });

  it('persists agent conversation turns and returns state-grounded replies', async () => {
    const { filePath, store } = await createTempStore();

    const result = await store.sendAgentMessage('I have chest tightness and a fever. What should I do?');
    const persisted = JSON.parse(await readFile(filePath, 'utf8'));

    expect(result.reply.role).toBe('assistant');
    expect(result.reply.text).toContain('care level');
    expect(result.state.agentMessages).toEqual([
      expect.objectContaining({ role: 'student', text: 'I have chest tightness and a fever. What should I do?' }),
      expect.objectContaining({ role: 'assistant', text: expect.stringContaining('care level') }),
    ]);
    expect(persisted.agentMessages).toHaveLength(2);
  });

  it('drafts a parent-safe update without exposing private student details', async () => {
    const { store } = await createTempStore();

    const result = await store.sendAgentMessage('Draft a parent update that calms worries.');

    expect(result.reply.text).toContain('Parent-safe update');
    expect(result.reply.text).toContain('student controls');
    expect(result.reply.text).toContain('without sharing symptoms, medication details, or records');
  });

  it('turns a planning request into concrete next steps for the student', async () => {
    const { store } = await createTempStore();

    const result = await store.sendAgentMessage('Plan tonight around symptoms, refill, sleep, and midterms.');

    expect(result.reply.text).toContain('Tonight');
    expect(result.reply.text).toContain('care decision');
    expect(result.reply.text).toContain('refill');
    expect(result.reply.text).toContain('11:30 PM');
  });

  it('keeps symptom guidance useful after the urgent action has already been completed', async () => {
    const { store } = await createTempStore();

    await store.completeAction('care-red-flag');
    const result = await store.sendAgentMessage('I still have chest tightness and fever.');

    expect(result.reply.text).toContain('care level');
  });
});
