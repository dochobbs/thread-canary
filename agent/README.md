# THREAD iMessage Agent

A private life memory and action agent for college students, delivered over iMessage via [Inkbox](https://inkbox.ai).

Built for the 6H Consulting demo (June 2026). This agent knows one student deeply — Alex Rivera, a first-year biology student at the fictional Northview State University in Cedar Falls, Iowa — and acts as their private operator: remembering medical history, campus logistics, schedules, medications, and privacy boundaries so Alex doesn't have to hold it all in their head during the hardest week of their first semester.

## Product Thesis

THREAD earns trust on the questions you can't Google: "I drank at the tailgate and I'm on Vyvanse, is that bad?", "my chest feels tight again, should I be scared?", "what do I tell my mom without giving her everything?" These are shame-adjacent, context-dependent questions that require knowing the student's full situation — medications, allergies, schedule, family dynamics, privacy boundaries. No chatbot, search engine, or campus health portal can answer them. THREAD can because it already has the context.

The growth model is whisper-loop: Alex tells Jordan, Jordan texts the triage number, and THREAD has two users instead of one. CAC drops toward zero because the product spreads through the moments it handles well.

## Platform Dependencies

### Inkbox (inkbox.ai)

Inkbox is the communication and identity layer. It gives the agent:

- **An iMessage identity** — the agent sends and receives real iMessages through an Inkbox-managed Apple relay. Users text a triage number, say "connect @thread", and get routed to the agent's identity.
- **Email** — the agent has its own email address (thread@inkboxmail.com) for sending visit prep notes, demo prompts, etc.
- **Phone number** — for SMS/voice (not used in this demo, but available).
- **Tunnel** — Inkbox provides a persistent HTTPS tunnel (thread.inkboxwire.com) that forwards webhook events to the local server. No ngrok or cloudflare needed.
- **Webhook subscriptions** — Inkbox fires `imessage.received` events to the tunnel URL when a message arrives.

The Inkbox SDK (`@inkbox/sdk`) and CLI (`@inkbox/cli`) handle all of this. Docs: https://inkbox.ai/api/openapi.json. SDK repo: https://github.com/inkbox-ai/inkbox.

### Sprite (sprites.dev)

Sprite is the cloud compute environment where the agent runs. Think of it as a persistent Linux VM with:

- **Always-on services** — `sprite-env services create` registers a process that auto-restarts on crash. The agent runs as a Sprite service called `thread-agent`.
- **Persistent filesystem** — code, node_modules, .env all survive reboots.
- **Network access** — can reach Inkbox, OpenRouter, Spotify, Open-Meteo, etc.
- **No public URL for webhooks** — Sprite URLs are auth-protected, which is why we use the Inkbox tunnel instead.

You don't need Sprite to run this. Any server, VPS, or even a laptop with Node.js can run the agent — you just need the Inkbox tunnel for webhook delivery.

### OpenRouter (openrouter.ai)

LLM proxy that gives access to Claude Sonnet 4 (and other models) through a single API key and OpenAI-compatible endpoint. The agent talks to `https://openrouter.ai/api/v1` using the standard OpenAI SDK. You could swap this for direct Anthropic API access by changing `OPENAI_BASE_URL` and `OPENAI_API_KEY` in `.env`.

### Hermes Agent (hermes-agent.nousresearch.com)

This agent was built interactively using Hermes Agent — an open-source AI agent framework by Nous Research that runs in your terminal. Hermes provided the development environment: file editing, terminal access, web search, persistent memory across sessions, and skill management. The Hermes skills installed during development (inkbox-cli, inkbox-python, inkbox-ts) provided SDK documentation and CLI reference.

You don't need Hermes to run the THREAD agent — it's a standalone Node.js server. But if you want to iterate on the prompt, add features, or debug issues conversationally, Hermes is how this was built.

## Architecture

```
iMessage (Alex's phone)
    ↓
Inkbox triage number (+1-650-397-9720)
    ↓ text "connect @thread"
Inkbox iMessage relay
    ↓ webhook (imessage.received)
Inkbox tunnel (thread.inkboxwire.com)
    ↓
Express server (server.mjs, port 8181)
    ↓
Claude Sonnet 4 (via OpenRouter)
    ↓
Inkbox SDK → iMessage reply
```

**Why webhook, not polling:** Polling adds 3-15 seconds of latency per message. For a demo where you're watching someone text in real time, that kills the magic. The webhook + tunnel approach gives sub-4-second end-to-end response times.

**Why Node.js, not Python:** Python venv creation kept failing/timing out on the Sprite environment. Node.js had working npm + the Inkbox SDK already published. The server is ~300 lines — framework choice doesn't matter much.

**Why Inkbox tunnel, not Sprite URL:** The Sprite URL is auth-protected and couldn't be made public for webhook delivery. The Inkbox tunnel provides a dedicated, unauthenticated webhook endpoint.

**Running without Sprite:** Any machine with Node.js 18+ and internet access works. The Inkbox tunnel handles webhook delivery regardless of where the server runs — no public IP or domain needed.

## Integrations

| Service | Purpose | Auth |
|---------|---------|------|
| [Inkbox](https://inkbox.ai) | iMessage send/receive, tunnel, identity | API key |
| [OpenRouter](https://openrouter.ai) | LLM (Claude Sonnet 4) | API key |
| [Spotify Web API](https://developer.spotify.com) | Playlist search for study/sleep/mood | Client credentials (no user login) |
| [Open-Meteo](https://open-meteo.com) | Weather for Cedar Falls, Iowa | Free, no key |
| Apple Maps | Care navigation links | URL scheme, no key |

## Files

```
agent/
  server.mjs       — Main webhook server (Express + Inkbox + OpenAI + Spotify)
  prompt.mjs       — System prompt with full Alex Rivera profile, voice rules,
                     campus knowledge, behavioral patterns, and draft templates
  services.mjs     — Weather API (Open-Meteo) + campus knowledge base
  spotify.mjs      — Spotify Web API client (search, curated fallbacks)
  start.sh         — Service wrapper (sources .env, runs node)
  package.json     — Dependencies
  .env.example     — Template for credentials
  DEMO-PROMPTS.md  — Categorized demo prompt guide with suggested flows

docs/
  alex-rivera-dossier.md           — Full Alex Rivera longitudinal profile
  northview-state-dossier.md       — Full Northview State University dossier
  assets/
    alex-rivera-class-schedule.csv
    alex-rivera-campus-walking-times.csv
    alex-rivera-document-index.csv
    northview-state-building-directory.csv
    northview-state-contact-directory.csv
    northview-state-health-access.csv
    northview-state-shuttle-schedule.csv
    northview-state-dining-allergy-matrix.csv
    northview-state-academic-calendar.csv
    northview-state-policy-index.csv
```

## Setup Guide

### Prerequisites

- Node.js 18+
- An [Inkbox](https://inkbox.ai) account with an agent identity that has iMessage enabled
- An [OpenRouter](https://openrouter.ai) API key with access to `anthropic/claude-sonnet-4`
- A [Spotify Developer](https://developer.spotify.com/dashboard) app (for playlist search)

### 1. Clone and install

```bash
git clone https://github.com/dochobbs/thread-canary.git
cd thread-canary/agent
npm install
```

### 2. Create your Inkbox identity

Sign up at [inkbox.ai](https://inkbox.ai) and create an agent identity. You'll need:
- Identity handle (e.g., `thread`)
- API key

Enable iMessage on the identity:
```bash
npm install -g @inkbox/cli
export INKBOX_API_KEY="your_key"
inkbox identity update <handle> --imessage-enabled true --base-url https://inkbox.ai
```

Create a webhook subscription:
```bash
inkbox webhook create \
  --url https://<your-tunnel>.inkboxwire.com/webhook \
  --events imessage.received \
  --base-url https://inkbox.ai
```

### 3. Create a Spotify app

1. Go to [developer.spotify.com/dashboard](https://developer.spotify.com/dashboard)
2. Create an app (name: THREAD, redirect URI: https://localhost/callback)
3. Copy the Client ID and Client Secret

### 4. Configure environment

```bash
cp .env.example .env
```

Edit `.env` with your credentials:
```
INKBOX_API_KEY=ApiKey_...
INKBOX_SIGNING_KEY=...          # From webhook creation (optional, for signature verification)
OPENAI_API_KEY=sk-or-v1-...    # OpenRouter API key
OPENAI_BASE_URL=https://openrouter.ai/api/v1
THREAD_MODEL=anthropic/claude-sonnet-4
SPOTIFY_CLIENT_ID=...
SPOTIFY_CLIENT_SECRET=...
```

### 5. Run

```bash
# Source env and start
source .env
node server.mjs
```

Or use the start script:
```bash
chmod +x start.sh
./start.sh
```

The server will:
1. Connect to Inkbox and verify the identity
2. Enable iMessage if not already enabled
3. Start an Express server on port 8181
4. Open an Inkbox tunnel for webhook delivery
5. Print the tunnel URL and webhook endpoint

### 6. Test

Text "connect @thread" to the Inkbox iMessage triage number, then send a message. You should see the webhook fire in the server logs and get a response within 3-5 seconds.

### Running as a Sprite service

If deploying on [Sprites](https://sprites.dev):

```bash
sprite-env services create thread-agent \
  --cmd /bin/bash \
  --args "/path/to/start.sh" \
  --dir /path/to/agent
```

The `start.sh` script sources `.env` automatically. The service will auto-restart on crashes.

## How It Works

### Message flow

1. Alex texts the Inkbox triage number and connects to @thread
2. Each incoming iMessage hits the webhook at `/webhook`
3. Server sends a typing indicator via Inkbox
4. Message + conversation history is sent to Claude Sonnet 4 with the full system prompt
5. Claude's response is post-processed: `[SPOTIFY:query]` tags are resolved to real Spotify playlist URLs
6. Response is split into natural message chunks and sent as iMessage replies

### System prompt structure

The prompt in `prompt.mjs` contains:
- **Voice rules**: casual, emoji-friendly, friend-not-therapist tone
- **Alex's full profile**: medical history, medications, allergies, schedule, support map
- **Behavioral patterns**: routine chain, parent pressure loop, care avoidance
- **Privacy rules**: what to share with each audience (parents, roommate, TA, coach, clinic)
- **Draft templates**: how Alex would text each person
- **Campus knowledge**: injected from `services.mjs` (dining, pharmacy, routes, insurance basics)
- **Weather**: live data injected when relevant

### Rich iMessage features

The server supports:
- **Tapback reactions**: heart, thumbs up, ha ha, etc.
- **Typing indicators**: sent before LLM call starts
- **Send styles**: slam, loud, gentle, invisible ink, confetti, etc.
- **Read receipts**: acknowledged on webhook receive
- **Natural message splitting**: long replies are broken into 2-3 messages with realistic timing
- **Apple Maps links**: render as rich previews in iMessage
- **Spotify links**: render as playable cards in iMessage

### Spotify integration

When Claude includes a `[SPOTIFY:query]` tag in its response, the server:
1. Searches the Spotify Web API for matching playlists
2. Replaces the tag with the real Spotify URL
3. Falls back to curated playlists if the API fails

This happens transparently — Claude just writes the tag, the server resolves it.

### Weather

Live weather for Cedar Falls, Iowa is fetched from Open-Meteo (free, no key) and injected into the conversation context when:
- The conversation is new (first message)
- The message mentions weather, walking, outside, jacket, ride, uber, etc.

## Key Design Decisions

### Privacy model

Alex owns the memory. Parents can pay but don't get access. Every audience has different share rules:
- **Parents**: logistics only ("I have a plan, please don't call around")
- **Roommate Jordan**: rides, meals, pharmacy pickup — no medication names
- **Aunt Lena**: trusted adult, contact only after Alex opts in
- **RA Sam**: campus resources, no health details
- **TA Ren Ortiz**: lab logistics only, no medical detail beyond "illness"
- **Coach Paige Lin**: practice logistics, no medication or fever details
- **Clinic/urgent care**: full health summary including meds, allergies, history

### Care navigation, not diagnosis

THREAD never diagnoses. When Alex reports chest tightness + fever, it:
1. Asks one safety-relevant question
2. Prepares a symptom timeline with meds/allergies
3. Compares care options (clinic hours, urgent care route, emergency)
4. Drafts messages for the relevant people
5. Protects refill, food, and sleep after safety is handled

### The "un-Googleable" questions

The product moat is context-dependent answers to shame-adjacent questions:
- Drinking on ADHD medication
- Whether chest tightness is anxiety or real
- How to use insurance for the first time
- What to tell a parent without revealing everything
- Whether to go to lab with a fever

These require knowing Alex's specific medications, history, schedule, and family dynamics. No other tool has this context.

## Dossier Files

The `docs/` directory contains the full synthetic datasets that power the agent:

- **`alex-rivera-dossier.md`**: Alex's complete longitudinal profile — birth to Week 7, medical records, medication history, behavioral patterns, family system, support map, document vault, and agent memory hooks.

- **`northview-state-dossier.md`**: The fictional university's complete campus data — buildings, health services, dining, pharmacy, shuttles, safety, counseling, disability services, policies, contacts, and academic calendar.

These are synthetic demo data. They are not real medical records, real university policies, or clinical decision-making templates.

## Cost

- **LLM (Claude Sonnet 4 via OpenRouter)**: ~$0.06 per message exchange (20K tokens in, 200 tokens out)
- **Inkbox**: per-message pricing (see inkbox.ai)
- **Spotify**: free (client_credentials flow)
- **Weather**: free (Open-Meteo)
- **A full demo conversation (~20 messages)**: ~$1.20 in LLM costs
