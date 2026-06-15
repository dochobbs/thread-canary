# THREAD

A private life memory and action agent for college students, delivered over iMessage.

THREAD knows one student deeply — their medical history, medications, class schedule, family dynamics, and privacy boundaries — and acts as their private operator during the hardest weeks of their first semester. It answers the questions you can't Google: drinking on ADHD medication, whether chest tightness is real or anxiety, what to tell your mom without revealing everything, how to use insurance for the first time.

Built for the 6H Consulting demo (June 2026).

## What's in this repo

| Directory | What it is |
|-----------|------------|
| `agent/` | The live iMessage agent — Node.js server, system prompt, integrations, setup guide |
| `docs/` | Synthetic student and university dossiers that power the agent's knowledge |
| `src/` | Original web prototype (Canary app — not part of the iMessage agent) |

**Start here:** [`agent/README.md`](agent/README.md) has the full setup guide, architecture, and design decisions.

## How it works

Someone texts the agent over iMessage. The agent already knows their full context — 18 years of medical history, this week's class schedule, which medications are running low, who they trust, and what their parents should and shouldn't see. It responds in 3-4 seconds with the one piece of remembered context that changes the next useful action.

```
Alex texts: "my chest feels tight and I drank this weekend"

THREAD knows: lisdexamfetamine + alcohol + 3 nights of bad sleep +
remote exercise-induced bronchospasm history + fever since Monday +
resting HR up 9bpm + campus clinic closes at 5pm + urgent care
isn't walkable + Alex doesn't want parents to know

THREAD responds: "ok real talk — with the fever, the chest thing,
and your bronchospasm history, this needs eyes on it tonight, not
tomorrow 🫠 riverbend urgent care is open til 9. want me to prep
a symptom note so you don't have to remember everything while
you're there?"
```

## The stack

### Inkbox — communication layer ([inkbox.ai](https://inkbox.ai))

Inkbox gives the agent a real iMessage identity. Users text a triage number, say "connect @thread", and get routed to the agent. Inkbox handles the Apple relay, webhook delivery, and provides a persistent HTTPS tunnel so the server doesn't need a public IP.

The agent also has email (thread@inkboxmail.com) and a phone number for SMS/voice — all through Inkbox.

SDK: [@inkbox/sdk](https://github.com/inkbox-ai/inkbox) | CLI: `@inkbox/cli` | Docs: [inkbox.ai/api/openapi.json](https://inkbox.ai/api/openapi.json)

### OpenRouter — LLM proxy ([openrouter.ai](https://openrouter.ai))

The agent uses Claude Sonnet 4 for responses. OpenRouter provides a single API key and OpenAI-compatible endpoint that works with any model. Each reply costs about $0.06 (20K tokens in for the system prompt + conversation, ~200 tokens out).

You can swap this for direct Anthropic API access by changing two env vars. Or use any other model that handles long system prompts well.

### Sprite — hosting ([sprites.dev](https://sprites.dev))

Sprite is a persistent cloud Linux environment where the agent runs as an always-on service. Think of it as a VM that auto-restarts your process on crash and survives reboots.

**You don't need Sprite.** Any machine with Node.js 18+ works — a VPS, a Raspberry Pi, your laptop. The Inkbox tunnel handles webhook delivery regardless of where the server runs.

### Hermes Agent — development environment ([hermes-agent.nousresearch.com](https://hermes-agent.nousresearch.com))

This agent was built interactively using Hermes Agent, an open-source AI agent framework by Nous Research. Hermes provided the development loop: file editing, terminal access, web search, persistent memory, and skill management. The entire build — from first `npm install` to working iMessage demo with Spotify integration — happened in one Hermes session.

**You don't need Hermes to run the agent.** It's a standalone Node.js server. But if you want to iterate on the prompt, add features, or debug conversationally, Hermes is how this was built.

### Spotify Web API — music ([developer.spotify.com](https://developer.spotify.com))

When the agent mentions music (study playlists, wind-down, anxiety relief), it searches Spotify's API for real playlists and sends links that render as playable cards in iMessage. Uses client_credentials flow — no user login needed, free tier.

### Open-Meteo — weather ([open-meteo.com](https://open-meteo.com))

Live weather for Cedar Falls, Iowa. Free, no API key. The agent uses it naturally when weather matters — walking to urgent care in the rain, whether to layer up for soccer, etc.

## The demo student

**Alex Rivera** — 18, first-year biology student at the fictional Northview State University in Cedar Falls, Iowa. Week 7 of the first semester. Everything is converging: cough that turned into fever and chest tightness, ADHD medication refill running out in 4 days, 3 nights of terrible sleep, chemistry lab that keeps swallowing lunch, midterms in 5 days, a sore ankle from soccer, and parents who pay for everything but shouldn't see any of it.

The full profile is 56KB of longitudinal data — birth to present — in [`docs/alex-rivera-dossier.md`](docs/alex-rivera-dossier.md). The university campus data is another 38KB in [`docs/northview-state-dossier.md`](docs/northview-state-dossier.md).

## Quick start

```bash
cd agent
npm install
cp .env.example .env
# Fill in your Inkbox, OpenRouter, and Spotify credentials
./start.sh
```

Full setup instructions in [`agent/README.md`](agent/README.md).

## Product thesis

THREAD earns trust on shame-adjacent, context-dependent questions that no other tool can answer. The growth model is whisper-loop: Alex tells their roommate Jordan, Jordan texts the triage number, and THREAD has two users. CAC drops toward zero because the product spreads through the moments it handles well.

The wedge is un-Googleable health questions for 18-22 year olds managing their own care for the first time. The long game is a lifelong private health relationship that compounds with every semester.
