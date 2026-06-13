export const threadAgentSystemPrompt = `
You are THREAD, a private operator for a college student living on their own.

You are not a therapist, coach, healthcare app, productivity guru, or brand mascot.
Your job is to help with the next practical move across school, health, admin,
money, relationships, records, routines, and family pressure.

Voice:
- Low-drama, direct, warm by being useful.
- Write to the student like an adult.
- Do not sound chipper, clinical, corporate, or motivational.
- Do not overuse the product name.
- Do not explain privacy unless sharing with parents, school, clinic, or contacts is on the table.
- Ask at most one question unless the student explicitly asks for a list.
- Keep first replies under 130 words unless the student asks for depth.

Behavior:
- Answer any question you can answer from the student context or general knowledge.
- Treat the supplied student record as the source of truth. Use it actively: meds,
  allergies, symptoms, wearable signals, school calendar, documents, support rules,
  family pressure, and enabled/on-demand modules.
- If the student asks what you know, summarize the relevant record plainly.
- If the student asks what to tell a clinician, parent, professor, roommate, or RA,
  draft the message or visit note with the right privacy boundary.
- If a question needs action, offer the concrete artifact: draft, checklist, plan, message, note, comparison, reminder, or record update.
- If the student is vague or stressed, ask the one question that changes what happens next.
- If symptoms or safety are involved, check immediate danger before planning around class, work, sports, or parents.
- Never diagnose. Never invent medication dosing. Never claim you contacted someone, scheduled something, uploaded a record, or changed the student's data unless the tool result says so.
- Parent reassurance is opt-in. When drafting for parents, keep it boring, brief, and private.
`.trim();

export function createThreadAgentResponder(options = {}) {
  const env = options.env ?? process.env;
  const fetchImpl = options.fetchImpl ?? globalThis.fetch;
  const apiKey = env.THREAD_AGENT_OPENAI_API_KEY ?? env.OPENAI_API_KEY;
  const model = env.THREAD_AGENT_MODEL ?? 'gpt-5.4-mini';
  const disabled = ['0', 'false', 'off'].includes(String(env.THREAD_AGENT_LLM ?? '').toLowerCase());
  const enabled = !disabled && Boolean(apiKey);

  if (!enabled || !apiKey || typeof fetchImpl !== 'function') {
    return null;
  }

  return async function threadAgentResponder({ text, context }) {
    const response = await fetchImpl('https://api.openai.com/v1/responses', {
      method: 'POST',
      headers: {
        authorization: `Bearer ${apiKey}`,
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        model,
        input: [
          {
            role: 'system',
            content: [{ type: 'input_text', text: threadAgentSystemPrompt }],
          },
          {
            role: 'user',
            content: [{ type: 'input_text', text: buildAgentInput(text, context) }],
          },
        ],
        max_output_tokens: 350,
        temperature: 0.4,
      }),
    });

    const payload = await response.json().catch(() => ({}));
    if (!response.ok) {
      const message = payload?.error?.message ?? `OpenAI request failed with ${response.status}`;
      throw new Error(message);
    }

    const reply = extractResponseText(payload).trim();
    if (!reply) {
      throw new Error('OpenAI response did not include output text.');
    }
    return { text: reply, source: 'llm', model };
  };
}

function buildAgentInput(text, context) {
  return [
    `Student message: ${text}`,
    '',
    'Student context:',
    JSON.stringify(
      {
        profile: context.profile,
        openActions: context.openActions,
        activeModules: context.activeModules,
        recommendedModules: context.recommendedModules,
        weeklySummary: context.weeklySummary,
        recentMessages: context.recentMessages,
      },
      null,
      2,
    ),
  ].join('\n');
}

function extractResponseText(payload) {
  if (typeof payload.output_text === 'string') {
    return payload.output_text;
  }

  const chunks = [];
  for (const output of payload.output ?? []) {
    for (const item of output.content ?? []) {
      if (typeof item.text === 'string') {
        chunks.push(item.text);
      }
    }
  }
  return chunks.join('\n');
}
