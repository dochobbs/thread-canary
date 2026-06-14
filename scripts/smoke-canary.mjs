const baseUrl = process.env.CANARY_URL ?? 'http://127.0.0.1:8787';
const expectLlmAgent = process.env.EXPECT_LLM_AGENT === '1';

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

async function request(path, options = {}) {
  const response = await fetch(`${baseUrl}${path}`, {
    ...options,
    headers: {
      ...(options.body ? { 'content-type': 'application/json' } : {}),
      ...options.headers,
    },
  });
  const contentType = response.headers.get('content-type') ?? '';
  const payload = contentType.includes('application/json') ? await response.json() : await response.text();

  if (!response.ok) {
    throw new Error(`${options.method ?? 'GET'} ${path} failed with ${response.status}: ${JSON.stringify(payload)}`);
  }

  return payload;
}

function assertAgentReply(payload, label) {
  assert(payload.reply?.text?.trim().length > 0, `${label} did not return reply text.`);
  assert(['llm', 'fallback'].includes(payload.reply?.source), `${label} did not include agent reply provenance.`);
  if (expectLlmAgent) {
    assert(payload.reply.source === 'llm', `${label} expected source=llm but got ${payload.reply.source}.`);
  }
  assert(
    payload.state?.agentMessages?.some((message) => message.role === 'assistant' && message.source === payload.reply.source),
    `${label} conversation did not persist reply provenance through the API.`,
  );
}

async function main() {
  const health = await request('/api/health');
  assert(health.ok === true, 'Health endpoint did not return ok=true.');

  const html = await request('/');
  assert(typeof html === 'string' && html.includes('id="root"'), 'Root route did not serve the built app shell.');

  const state = await request('/api/students/alex-rivera/select', { method: 'POST' });
  assert(state.selectedStudentId === 'alex-rivera', 'Canary state did not reset to the Alex local demo student.');
  assert(
    state.students?.some((student) => student.id === 'alex-rivera') &&
      state.students?.some((student) => student.id === 'maya-thompson'),
    'Canary state did not include both local demo students.',
  );
  assert(state.profile?.name === 'Alex Rivera', 'Canary state did not include the week-7 demo student profile.');
  assert(
    state.profile?.schoolContext?.includes('Week 7'),
    'Canary state did not include the halfway-through-first-semester context.',
  );
  assert(
    state.profile?.availableModuleIds?.length === 10,
    'Canary state did not include the full on-demand module library.',
  );
  assert(state.profile?.demographics?.age === 18, 'Canary state did not include rich student demographics.');
  assert(
    state.profile?.healthProfile?.currentMedications?.some((medication) => medication.name === 'lisdexamfetamine'),
    'Canary state did not include the demo medication list.',
  );
  assert(
    state.profile?.careTimeline?.some((event) => event.id === 'weekend-cough'),
    'Canary state did not include the demo care timeline.',
  );
  assert(
    state.demoMoments?.map((moment) => moment.id).join(',') ===
      'urgent-care,parent-update,lab-ta-message,add-acute-module,tonight-plan',
    'Canary state did not include the five guided demo moments.',
  );
  assert(Array.isArray(state.artifacts), 'Canary state did not include agent artifacts.');
  assert(Array.isArray(state.actions) && state.actions.length > 0, 'Canary state did not include agent actions.');

  const mayaState = await request('/api/students/maya-thompson/select', { method: 'POST' });
  assert(mayaState.selectedStudentId === 'maya-thompson', 'Student selector did not switch to Maya.');
  assert(mayaState.profile?.name === 'Maya Thompson', 'Maya local demo profile did not load.');
  assert(
    mayaState.profile?.pediatricianPacket?.artifacts?.some((artifact) => artifact.id === 'maya-diabetes-sick-day-plan'),
    'Maya profile did not include pediatrician transition artifacts.',
  );
  assert(
    mayaState.profile?.documents?.some((document) => document.title === 'Diabetes sick-day and ketone plan'),
    'Maya document vault did not include pediatrician packet records.',
  );

  const mayaAgentPayload = await request('/api/agent/messages', {
    method: 'POST',
    body: JSON.stringify({ text: 'What meds and allergies do I have on record?' }),
  });
  assertAgentReply(mayaAgentPayload, 'Maya selected-student agent message');
  assert(mayaAgentPayload.state?.selectedStudentId === 'maya-thompson', 'Maya agent reply changed selected student.');
  if (mayaAgentPayload.reply.source === 'fallback') {
    assert(
      mayaAgentPayload.reply.text.includes('insulin lispro') &&
        mayaAgentPayload.reply.text.includes('peanut and tree nut'),
      'Maya fallback reply did not use selected-student meds and allergies.',
    );
  }

  await request('/api/students/alex-rivera/select', { method: 'POST' });

  const completedState = await request('/api/actions/care-red-flag/complete', { method: 'POST' });
  assert(
    completedState.completedActionIds.includes('care-red-flag'),
    'Action completion did not persist through the API.',
  );

  const moduleState = await request('/api/modules/nutrition-patterns/activate', { method: 'POST' });
  assert(
    moduleState.activatedModuleIds.includes('nutrition-patterns'),
    'Module activation did not persist through the API.',
  );
  assert(
    moduleState.actions.some((action) => action.id === 'nutrition-lab-day-fallback'),
    'Activated nutrition module did not add module-specific agent work.',
  );

  const memoryText = 'Canary smoke: remembers a quiet breakfast before chemistry lab.';
  const memoryState = await request('/api/memory', {
    method: 'POST',
    body: JSON.stringify({ text: memoryText }),
  });
  assert(memoryState.profile.memory.includes(memoryText), 'Memory ingestion did not persist through the API.');

  const documentState = await request('/api/documents', {
    method: 'POST',
    body: JSON.stringify({ title: 'Canary smoke record', kind: 'Receipt', status: 'Captured' }),
  });
  assert(
    documentState.profile.documents.some(
      (document) => document.title === 'Canary smoke record' && document.status === 'Captured',
    ),
    'Document ingestion did not persist through the API.',
  );

  const agentPayload = await request('/api/agent/messages', {
    method: 'POST',
    body: JSON.stringify({ text: 'I have chest tightness and fever. What should I do?' }),
  });
  assertAgentReply(agentPayload, 'Symptom agent message');
  if (agentPayload.reply.source === 'fallback') {
    assert(
      agentPayload.reply.text.toLowerCase().includes('care level'),
      'Fallback symptom reply did not return a state-grounded care-level reply.',
    );
  }

  const urgentToolPayload = await request('/api/agent/messages', {
    method: 'POST',
    body: JSON.stringify({ text: 'Do I need urgent care tonight? Prepare what I should tell them.' }),
  });
  assertAgentReply(urgentToolPayload, 'Urgent-care tool agent message');
  assert(
    urgentToolPayload.reply?.toolCalls?.some((tool) => tool.name === 'prepare_urgent_care_note'),
    'Urgent-care demo prompt did not run the visit-note tool.',
  );
  assert(
    urgentToolPayload.state?.artifacts?.some((artifact) => artifact.id === 'urgent-care-visit-note'),
    'Urgent-care demo prompt did not create a visit-note artifact.',
  );
  assert(
    urgentToolPayload.state?.artifacts?.some((artifact) => artifact.id === 'urgent-care-share-packet'),
    'Urgent-care demo prompt did not create a share-packet artifact.',
  );

  const parentPayload = await request('/api/agent/messages', {
    method: 'POST',
    body: JSON.stringify({ text: 'Draft a parent-safe update that calms worries.' }),
  });
  assertAgentReply(parentPayload, 'Parent-safe agent message');
  if (parentPayload.reply.source === 'fallback') {
    assert(
      parentPayload.reply.text.includes('Send this:'),
      'Fallback agent did not draft a parent-safe reassurance update.',
    );
    assert(
      parentPayload.reply.text.includes('without handing over symptoms, medication details, or records'),
      'Fallback parent-safe update did not preserve student privacy boundaries.',
    );
  }

  const overwhelmPayload = await request('/api/agent/messages', {
    method: 'POST',
    body: JSON.stringify({ text: "I'm overwhelmed and my mom keeps asking if I'm okay." }),
  });
  assertAgentReply(overwhelmPayload, 'Overwhelm agent message');
  if (overwhelmPayload.reply.source === 'fallback') {
    assert(
      overwhelmPayload.reply.text.includes('Yeah. This is getting loud.'),
      'Fallback agent did not acknowledge vague student overwhelm.',
    );
    assert(
      (overwhelmPayload.reply.text.match(/\?/g) ?? []).length === 1,
      'Fallback overwhelm reply should ask one focused question.',
    );
  }

  const arbitraryPayload = await request('/api/agent/messages', {
    method: 'POST',
    body: JSON.stringify({ text: 'What should I say to my lab TA if I miss lab?' }),
  });
  assertAgentReply(arbitraryPayload, 'Arbitrary agent message');
  if (arbitraryPayload.reply.source === 'fallback') {
    assert(
      arbitraryPayload.reply.text.includes('I can help with that.'),
      'Fallback agent did not respond to an arbitrary student question.',
    );
    assert(
      arbitraryPayload.reply.text.includes('draft'),
      'Arbitrary-question fallback did not offer a concrete next artifact.',
    );
  }

  await request('/api/students/alex-rivera/select', { method: 'POST' });

  console.log(`Canary smoke passed at ${baseUrl}`);
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
