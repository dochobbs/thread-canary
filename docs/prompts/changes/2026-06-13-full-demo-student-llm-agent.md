# 2026-06-13 Full Demo Student + LLM Agent

## Why

The demo needed a student record deep enough for the agent to interrogate like a real college-life file, not a few dashboard facts. It also needed proof that a reply came from the model instead of the local fallback.

## Change

- Expanded Alex Rivera into a full halfway-through-first-semester demo student:
  - demographics, residence, major, pronouns, and care preferences
  - conditions, medications, allergy, immunizations, current concern, and visit prep
  - care timeline, wearable summary, academic calendar, support map, family pressure, finances, insurance, documents, and module signals
- Passes the full profile to the agent responder, not just name, school context, memory, signals, and documents.
- Model-backed mode now turns on by default when `OPENAI_API_KEY` or `THREAD_AGENT_OPENAI_API_KEY` is present.
- `THREAD_AGENT_LLM=0` disables the model path for deterministic local fallback testing.
- Agent replies now carry provenance:
  - `source: "llm"` for model replies
  - `source: "fallback"` for local canary replies
  - `model` when a model generated the reply
- The mobile conversation UI shows a compact source badge on assistant messages.
- Canary smoke coverage is now source-aware and can require `source=llm` with `EXPECT_LLM_AGENT=1`.

## Verification

- Unit and React tests cover the rich profile, full responder context, responder provenance, fallback behavior, and source badge.
- Live canary smoke passed with `EXPECT_LLM_AGENT=1`.
- A live LLM canary question about urgent care returned `source: "llm"` on `gpt-5.4-mini` and used Alex's medications, allergy, red flags, wearable trend, and school conflicts.
