# 2026-06-13 General Agent Responder

## Why

The canary agent could only pretend to be broad. It was still a keyword switchboard with a generic fallback, which meant student questions outside the prepared health/admin paths felt dead or canned.

The tone direction also overcorrected into product and wellness language: too much "THREAD", too much privacy copy, and phrases like "win the week" that do not fit the product.

## Change

- Added a general agent responder seam to `createCanaryStore`.
- Added optional model-backed mode with `THREAD_AGENT_LLM=1`.
- Sends the model full demo context: profile, memory, signals, documents, open actions, modules, weekly summary, and recent messages.
- Records `agent.responder_failed` and falls back locally if the model path fails.
- Changed local fallback copy to a lower-drama private-operator voice.
- Added a visible working state and short minimum dwell so local canary replies do not feel instant or scripted.
- Added tests for arbitrary questions, responder context, and responder failure.
- Added smoke coverage for an arbitrary lab-TA question.

## Runtime Contract

Every student message gets a response.

When model mode is enabled, all messages route through the general responder. When it is not enabled, the local canary fallback keeps the demo responsive without pretending to be the real agent.

## Environment

```sh
THREAD_AGENT_LLM=1
OPENAI_API_KEY=...
THREAD_AGENT_MODEL=gpt-5.4-mini
```

`THREAD_AGENT_OPENAI_API_KEY` can be used instead of `OPENAI_API_KEY` if the canary needs a project-specific key.
