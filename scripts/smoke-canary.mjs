const baseUrl = process.env.CANARY_URL ?? 'http://127.0.0.1:8787';

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

async function main() {
  const health = await request('/api/health');
  assert(health.ok === true, 'Health endpoint did not return ok=true.');

  const html = await request('/');
  assert(typeof html === 'string' && html.includes('id="root"'), 'Root route did not serve the built app shell.');

  const state = await request('/api/canary-state');
  assert(state.profile?.name === 'Alex Rivera', 'Canary state did not include the week-7 demo student profile.');
  assert(
    state.profile?.schoolContext?.includes('Week 7'),
    'Canary state did not include the halfway-through-first-semester context.',
  );
  assert(
    state.profile?.availableModuleIds?.length === 10,
    'Canary state did not include the full on-demand module library.',
  );
  assert(Array.isArray(state.actions) && state.actions.length > 0, 'Canary state did not include agent actions.');

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
  assert(
    agentPayload.reply?.text?.toLowerCase().includes('care level'),
    'Agent message did not return a state-grounded care-level reply.',
  );
  assert(
    agentPayload.state?.agentMessages?.some((message) => message.role === 'assistant'),
    'Agent conversation did not persist through the API.',
  );

  const parentPayload = await request('/api/agent/messages', {
    method: 'POST',
    body: JSON.stringify({ text: 'Draft a parent-safe update that calms worries.' }),
  });
  assert(
    parentPayload.reply?.text?.includes('Here is the parent-safe version I would send'),
    'Agent did not draft a parent-safe reassurance update.',
  );
  assert(
    parentPayload.reply?.text?.includes('without sharing symptoms, medication details, or records'),
    'Parent-safe update did not preserve student privacy boundaries.',
  );

  const overwhelmPayload = await request('/api/agent/messages', {
    method: 'POST',
    body: JSON.stringify({ text: "I'm overwhelmed and my mom keeps asking if I'm okay." }),
  });
  assert(
    overwhelmPayload.reply?.text?.includes("You don't have to sort the whole pile at once."),
    'Agent did not acknowledge vague student overwhelm.',
  );
  assert(
    (overwhelmPayload.reply?.text?.match(/\?/g) ?? []).length === 1,
    'Agent overwhelm reply should ask one focused question.',
  );

  console.log(`Canary smoke passed at ${baseUrl}`);
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
