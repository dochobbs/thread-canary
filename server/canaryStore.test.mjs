import { mkdtemp, readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { describe, expect, it } from 'vitest';
import { createCanaryStore } from './canaryStore.mjs';

async function createTempStore(options = {}) {
  const dir = await mkdtemp(join(tmpdir(), 'college-os-canary-'));
  const filePath = join(dir, 'state.json');
  const store = await createCanaryStore({ agentResponder: null, filePath, ...options });
  return { filePath, store };
}

describe('canary store', () => {
  it('loads seed state when no persisted file exists', async () => {
    const { store } = await createTempStore();

    const state = await store.getCanaryState();

    expect(state.selectedStudentId).toBe('alex-rivera');
    expect(state.students).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ id: 'alex-rivera', name: 'Alex Rivera' }),
        expect.objectContaining({ id: 'maya-thompson', name: 'Maya Thompson' }),
      ]),
    );
    expect(state.profile.id).toBe('alex-rivera');
    expect(state.profile.name).toBe('Alex Rivera');
    expect(state.profile.schoolContext).toContain('Week 7');
    expect(state.profile.demographics).toMatchObject({
      age: 18,
      campus: 'Northview State University',
      residence: 'Hawthorne Hall room 318',
      pronouns: 'they/them',
    });
    expect(state.profile.healthProfile.currentMedications).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          name: 'lisdexamfetamine',
          dose: '30 mg',
          refillStatus: expect.stringContaining('4 days left'),
        }),
      ]),
    );
    expect(state.profile.healthProfile.allergies).toContain('amoxicillin - rash as a child');
    expect(state.profile.healthProfile.currentConcern.redFlags).toContain('chest tightness plus fever worse since yesterday');
    expect(state.profile.pediatricianPacket).toMatchObject({
      practice: 'Cedar Valley Pediatrics',
      clinician: 'Dr. Mira Shah',
    });
    expect(state.profile.pediatricianPacket.artifacts).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: 'alex-adhd-medication-continuity',
          title: 'ADHD medication continuity letter',
        }),
      ]),
    );
    expect(state.profile.careTimeline.map((event) => event.id)).toContain('weekend-cough');
    expect(state.profile.wearableSummary.sleep).toContain('5h 42m');
    expect(state.profile.academicCalendar.map((event) => event.title)).toContain('BIO 111 practical');
    expect(state.demoMoments.map((moment) => moment.id)).toEqual([
      'urgent-care',
      'parent-update',
      'lab-ta-message',
      'add-acute-module',
      'tonight-plan',
    ]);
    expect(state.artifacts).toEqual([]);
    expect(state.customActions).toEqual([]);
    expect(state.profile.activeModuleIds).toContain('care-navigation');
    expect(state.profile.availableModuleIds).toHaveLength(10);
    expect(state.profile.availableModuleIds).toContain('nutrition-patterns');
    expect(state.profile.availableModuleIds).toContain('financial-stress');
    expect(state.actions.map((action) => action.id)).toContain('care-red-flag');
    expect(state.activeModules.map((module) => module.id)).toContain('care-navigation');
    expect(state.recommendedModules.map((module) => module.id)).toContain('nutrition-patterns');
    expect(state.recommendedModules.map((module) => module.id)).toContain('sexual-health-privacy');
  });

  it('switches to a second fully built student and resets the local demo state', async () => {
    const { store } = await createTempStore();

    await store.completeAction('care-red-flag');
    await store.sendAgentMessage('What do I tell my mom?');
    const mayaState = await store.selectStudent('maya-thompson');

    expect(mayaState.selectedStudentId).toBe('maya-thompson');
    expect(mayaState.profile).toMatchObject({
      id: 'maya-thompson',
      name: 'Maya Thompson',
      year: 'First-year student, halfway through first semester',
      demographics: {
        chosenName: 'Maya',
        residence: 'Maple Hall room 204',
      },
    });
    expect(mayaState.profile.healthProfile.conditions.map((condition) => condition.name)).toEqual(
      expect.arrayContaining(['Type 1 diabetes', 'Celiac disease', 'Peanut and tree nut allergy']),
    );
    expect(mayaState.profile.healthProfile.currentMedications.map((medication) => medication.name)).toEqual(
      expect.arrayContaining(['insulin lispro', 'albuterol HFA', 'epinephrine auto-injector']),
    );
    expect(mayaState.profile.pediatricianPacket).toMatchObject({
      practice: 'Bayside Pediatrics',
      clinician: 'Dr. Lena Ortiz',
    });
    expect(mayaState.profile.pediatricianPacket.artifacts).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ id: 'maya-diabetes-sick-day-plan', title: 'Diabetes sick-day and ketone plan' }),
        expect.objectContaining({ id: 'maya-anaphylaxis-action-plan', title: 'Anaphylaxis action plan' }),
      ]),
    );
    expect(mayaState.profile.documents).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ title: 'Bayside Pediatrics college transition packet', source: 'pediatrician' }),
        expect.objectContaining({ title: 'Diabetes sick-day and ketone plan', source: 'pediatrician' }),
      ]),
    );
    expect(mayaState.completedActionIds).toEqual([]);
    expect(mayaState.agentMessages).toEqual([]);
    expect(mayaState.actions.map((action) => action.id)).toContain('care-red-flag');
    expect(mayaState.actions.find((action) => action.id === 'care-red-flag').detail).toContain('overnight lows');
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

  it('uses agent tools to create an urgent-care note and student-controlled share packet', async () => {
    const { store } = await createTempStore();

    const result = await store.sendAgentMessage('Do I need urgent care tonight? Prepare what I should tell them.');

    expect(result.reply.toolCalls.map((tool) => tool.name)).toEqual(
      expect.arrayContaining(['prepare_urgent_care_note', 'build_share_packet', 'add_document']),
    );
    expect(result.state.artifacts).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: 'urgent-care-visit-note',
          kind: 'visit_note',
          title: 'Urgent care note',
          body: expect.stringContaining('lisdexamfetamine 30 mg'),
        }),
        expect.objectContaining({
          id: 'urgent-care-share-packet',
          kind: 'share_packet',
          title: 'Urgent care share packet',
          consent: 'student-controlled',
        }),
      ]),
    );
    expect(result.state.profile.documents).toEqual(
      expect.arrayContaining([expect.objectContaining({ title: 'Urgent care note', kind: 'Visit note' })]),
    );
  });

  it('uses agent tools to activate module depth from chat and change the action queue', async () => {
    const { store } = await createTempStore();

    const result = await store.sendAgentMessage('Add the acute illness module. What changes?');

    expect(result.reply.toolCalls).toEqual(
      expect.arrayContaining([expect.objectContaining({ name: 'activate_module', targetId: 'acute-illness-injury' })]),
    );
    expect(result.state.activatedModuleIds).toContain('acute-illness-injury');
    expect(result.state.actions.map((action) => action.id)).toContain('acute-symptom-visit-prep');
    expect(result.reply.text).toContain('Acute Illness / Injury');
  });

  it('uses agent tools to create a parent-safe artifact without exposing private details', async () => {
    const { store } = await createTempStore();

    const result = await store.sendAgentMessage('What do I tell my mom without giving her everything?');
    const parentArtifact = result.state.artifacts.find((artifact) => artifact.id === 'parent-safe-update');

    expect(result.reply.toolCalls.map((tool) => tool.name)).toContain('draft_parent_update');
    expect(parentArtifact).toMatchObject({
      kind: 'parent_update',
      title: 'Parent-safe update',
      audience: 'parents',
      consent: 'student-controlled',
    });
    expect(parentArtifact.body).toContain('I am okay enough to handle tonight');
    expect(parentArtifact.body).not.toContain('lisdexamfetamine');
    expect(parentArtifact.body).not.toContain('amoxicillin');
  });

  it('uses agent tools to draft a lab TA message as a reusable artifact', async () => {
    const { store } = await createTempStore();

    const result = await store.sendAgentMessage('What should I say to my lab TA if I miss lab?');

    expect(result.reply.toolCalls.map((tool) => tool.name)).toContain('draft_school_message');
    expect(result.state.artifacts).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: 'lab-ta-message',
          kind: 'school_message',
          title: 'Lab TA message',
          audience: 'CHEM 101 lab TA',
        }),
      ]),
    );
  });

  it('uses agent tools to create a tonight plan with actionable tasks', async () => {
    const { store } = await createTempStore();

    const result = await store.sendAgentMessage('Make me a plan for tonight.');

    expect(result.reply.toolCalls.map((tool) => tool.name)).toEqual(
      expect.arrayContaining(['create_task', 'draft_tonight_plan']),
    );
    expect(result.state.customActions.map((action) => action.id)).toEqual(
      expect.arrayContaining(['tonight-urgent-care-note', 'tonight-refill-message', 'tonight-sleep-window']),
    );
    expect(result.state.actions.map((action) => action.id)).toEqual(
      expect.arrayContaining(['tonight-urgent-care-note', 'tonight-refill-message', 'tonight-sleep-window']),
    );
    expect(result.state.artifacts).toEqual(
      expect.arrayContaining([expect.objectContaining({ id: 'tonight-plan', kind: 'plan' })]),
    );
  });

  it('uses agent tools to mark actions done from chat', async () => {
    const { store } = await createTempStore();

    const result = await store.sendAgentMessage('Mark the medication refill done.');

    expect(result.reply.toolCalls).toEqual(
      expect.arrayContaining([expect.objectContaining({ name: 'mark_action_done', targetId: 'refill-stimulant' })]),
    );
    expect(result.state.completedActionIds).toContain('refill-stimulant');
    expect(result.state.actions.find((action) => action.id === 'refill-stimulant')).toMatchObject({ completed: true });
  });

  it('routes arbitrary questions through a general agent responder with student context', async () => {
    let receivedRequest;
    const { store } = await createTempStore({
      agentResponder: async (request) => {
        receivedRequest = request;
        return {
          text: 'Email Professor Lin: I may need to miss lab because I am making a care decision first.',
          source: 'llm',
          model: 'demo-model',
        };
      },
    });

    const result = await store.sendAgentMessage('What should I say to my professor if I miss lab?');

    expect(result.reply.text).toContain('Email Professor Lin');
    expect(result.reply.source).toBe('llm');
    expect(result.reply.model).toBe('demo-model');
    expect(receivedRequest.text).toBe('What should I say to my professor if I miss lab?');
    expect(receivedRequest.context.profile.name).toBe('Alex Rivera');
    expect(receivedRequest.context.profile.healthProfile.currentMedications[0].name).toBe('lisdexamfetamine');
    expect(receivedRequest.context.profile.careTimeline.map((event) => event.id)).toContain('weekend-cough');
    expect(receivedRequest.context.profile.academicCalendar.map((event) => event.title)).toContain('CHEM 101 midterm');
    expect(receivedRequest.context.openActions.map((action) => action.id)).toContain('care-red-flag');
    expect(receivedRequest.context.recentMessages).toEqual([
      expect.objectContaining({ role: 'student', text: 'What should I say to my professor if I miss lab?' }),
    ]);
    expect(result.state.agentMessages).toEqual(
      expect.arrayContaining([expect.objectContaining({ role: 'assistant', source: 'llm', model: 'demo-model' })]),
    );
  });

  it('passes only the selected student and pediatrician artifacts to the general responder', async () => {
    let receivedRequest;
    const { store } = await createTempStore({
      agentResponder: async (request) => {
        receivedRequest = request;
        return {
          text: 'You have the diabetes sick-day plan from Bayside Pediatrics in your records.',
          source: 'llm',
          model: 'demo-model',
        };
      },
    });

    await store.selectStudent('maya-thompson');
    const result = await store.sendAgentMessage('What did my pediatrician send with me to school?');

    expect(result.reply.source).toBe('llm');
    expect(receivedRequest.context.profile.name).toBe('Maya Thompson');
    expect(receivedRequest.context.profile.pediatricianPacket.artifacts.map((artifact) => artifact.id)).toContain(
      'maya-diabetes-sick-day-plan',
    );
    expect(JSON.stringify(receivedRequest.context)).toContain('Bayside Pediatrics');
    expect(JSON.stringify(receivedRequest.context)).not.toContain('Alex Rivera');
    expect(JSON.stringify(receivedRequest.context)).not.toContain('Cedar Valley Pediatrics');
  });

  it('answers selected-student medication, allergy, and pediatrician questions without an LLM', async () => {
    const { store } = await createTempStore();

    await store.selectStudent('maya-thompson');
    const medResult = await store.sendAgentMessage('What meds do I have on record?');
    const allergyResult = await store.sendAgentMessage('What are my allergies?');
    const packetResult = await store.sendAgentMessage('What pediatrician records came with me?');

    expect(medResult.reply.text).toContain('insulin lispro');
    expect(medResult.reply.text).toContain('glucagon nasal powder');
    expect(allergyResult.reply.text).toContain('peanut and tree nut');
    expect(packetResult.reply.text).toContain('Bayside Pediatrics');
    expect(packetResult.reply.text).toContain('Diabetes sick-day and ketone plan');
  });

  it('falls back to a private-operator answer when the general responder fails', async () => {
    const { store } = await createTempStore({
      agentResponder: async () => {
        throw new Error('model unavailable');
      },
    });

    const result = await store.sendAgentMessage('Can you help me write to my lab TA?');

    expect(result.reply.text).toContain('I can help with that.');
    expect(result.reply.text).toContain('draft');
    expect(result.reply.source).toBe('fallback');
    expect(result.state.events).toEqual(
      expect.arrayContaining([expect.objectContaining({ type: 'agent.responder_failed' })]),
    );
  });

  it('responds to vague overwhelm with connection, memory, and one focused question', async () => {
    const { store } = await createTempStore();

    const result = await store.sendAgentMessage("I'm overwhelmed and my mom keeps asking if I'm okay.");
    const reply = result.reply.text;

    expect(reply).toContain('Yeah. This is getting loud.');
    expect(reply).toContain('Week 7');
    expect(reply).toContain('I would keep the details private for now');
    expect(reply).toContain('Want me to draft that, or handle the chest tightness plus fever');
    expect(reply).not.toContain('student-owned');
    expect(reply).not.toContain('THREAD');
    expect(reply.match(/\?/g)).toHaveLength(1);
  });

  it('handles symptom worry as a safety check before planning', async () => {
    const { store } = await createTempStore();

    const result = await store.sendAgentMessage('My chest feels weird and I have a fever but I also have lab.');

    expect(result.reply.text).toContain('Before we plan around school');
    expect(result.reply.text).toContain('trouble breathing');
    expect(result.reply.text).toContain('use emergency care now');
    expect(result.reply.text).toContain('If not, I can make the health note');
  });

  it('drafts a parent-safe update without exposing private student details', async () => {
    const { store } = await createTempStore();

    const result = await store.sendAgentMessage('Draft a parent update that calms worries.');

    expect(result.reply.text).toContain('Send this:');
    expect(result.reply.text).toContain("Please don't call around.");
    expect(result.reply.text).toContain('It calms them down without handing over symptoms, medication details, or records.');
    expect(result.reply.text).not.toContain('THREAD');
  });

  it('turns a planning request into concrete next steps for the student', async () => {
    const { store } = await createTempStore();

    const result = await store.sendAgentMessage('Plan tonight around symptoms, refill, sleep, and midterms.');

    expect(result.reply.text).toContain('Tonight: run it in order.');
    expect(result.reply.text).toContain('care decision');
    expect(result.reply.text).toContain('refill');
    expect(result.reply.text).toContain('11:30 PM');
    expect(result.reply.text).toContain('I can turn this into reminders');
  });

  it('keeps symptom guidance useful after the urgent action has already been completed', async () => {
    const { store } = await createTempStore();

    await store.completeAction('care-red-flag');
    const result = await store.sendAgentMessage('I still have chest tightness and fever.');

    expect(result.reply.text).toContain('care level');
  });
});
