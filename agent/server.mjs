// server.mjs — THREAD iMessage agent server
//
// Receives iMessage webhooks from Inkbox via tunnel,
// calls Claude via OpenRouter, responds with rich iMessage features.

import { config } from "dotenv";
config({ path: new URL(".env", import.meta.url).pathname });

import { createServer } from "http";
import crypto from "crypto";
import { Inkbox } from "@inkbox/sdk";
import { connect } from "@inkbox/sdk/tunnels/connect";
import OpenAI from "openai";
import { SYSTEM_PROMPT } from "./prompt.mjs";
import { findPlaylist, searchPlaylists } from "./spotify.mjs";
import { getWeather, CAMPUS_KNOWLEDGE } from "./services.mjs";

// ---------------------------------------------------------------------------
// Config
// ---------------------------------------------------------------------------

const INKBOX_API_KEY = process.env.INKBOX_API_KEY || "";
const INKBOX_SIGNING_KEY = process.env.INKBOX_SIGNING_KEY || "";
const OPENAI_API_KEY = process.env.OPENAI_API_KEY || "";
const OPENAI_BASE_URL = process.env.OPENAI_BASE_URL || "https://openrouter.ai/api/v1";
const MODEL = process.env.THREAD_MODEL || "anthropic/claude-sonnet-4";
const IDENTITY_HANDLE = "thread";
const SPOTIFY_CLIENT_ID = process.env.SPOTIFY_CLIENT_ID || "";
const SPOTIFY_CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET || "";

if (!INKBOX_API_KEY) throw new Error("INKBOX_API_KEY is required");
if (!OPENAI_API_KEY) throw new Error("OPENAI_API_KEY is required");

// ---------------------------------------------------------------------------
// Clients
// ---------------------------------------------------------------------------

const inkbox = new Inkbox({ apiKey: INKBOX_API_KEY, baseUrl: "https://inkbox.ai" });
const openai = new OpenAI({ apiKey: OPENAI_API_KEY, baseURL: OPENAI_BASE_URL });

let identity = null;

// ---------------------------------------------------------------------------
// Conversation state (in-memory, keyed by conversationId)
// ---------------------------------------------------------------------------

const conversations = new Map();

function getConversation(conversationId) {
  if (!conversations.has(conversationId)) {
    conversations.set(conversationId, {
      messages: [{ role: "system", content: SYSTEM_PROMPT + "\n\n" + CAMPUS_KNOWLEDGE }],
      lastActivity: Date.now(),
    });
  }
  const conv = conversations.get(conversationId);
  conv.lastActivity = Date.now();
  return conv;
}

// ---------------------------------------------------------------------------
// Webhook signature verification
// ---------------------------------------------------------------------------

function verifySignature(body, headers) {
  if (!INKBOX_SIGNING_KEY) return true;
  const signature = headers["x-inkbox-signature"];
  const requestId = headers["x-inkbox-request-id"];
  const timestamp = headers["x-inkbox-timestamp"];
  if (!signature || !requestId || !timestamp) return false;

  const payload = `${requestId}.${timestamp}.${body}`;
  const expected = crypto
    .createHmac("sha256", INKBOX_SIGNING_KEY)
    .update(payload)
    .digest("hex");
  try {
    return crypto.timingSafeEqual(
      Buffer.from(signature, "utf8"),
      Buffer.from(expected, "utf8"),
    );
  } catch {
    return false;
  }
}

// ---------------------------------------------------------------------------
// Rich iMessage helpers
// ---------------------------------------------------------------------------

async function sendTyping(conversationId) {
  try {
    await identity.sendIMessageTyping(conversationId);
  } catch (e) {
    console.error("  ⚠ Typing failed:", e.message);
  }
}

async function sendReaction(messageId, reaction) {
  try {
    await identity.sendIMessageReaction({ messageId, reaction });
  } catch (e) {
    console.error("  ⚠ Reaction failed:", e.message);
  }
}

async function markRead(conversationId) {
  try {
    await identity.markIMessageConversationRead(conversationId);
  } catch (e) {
    console.error("  ⚠ Mark read failed:", e.message);
  }
}

function pickReaction(userMessage) {
  const lower = userMessage.toLowerCase();
  if (/\b(i (already|just|did)|done|took|started|called|went|scheduled|signed up)\b/i.test(lower)) return "love";
  if (/\b(lol|lmao|haha|😂|😅)\b/i.test(lower)) return "laugh";
  if (/\b(chest|can't breathe|emergency|scared|worse|fever|hurt)\b/i.test(lower)) return "emphasize";
  return null;
}

function pickSendStyle(agentMessage) {
  const lower = agentMessage.toLowerCase();
  if (/\b(go now|emergency|call 911|urgent care now|get help now|do not wait)\b/i.test(lower)) return "slam";
  if (/\b(done|sent|refill (started|submitted)|plan.*set|you('re| are) (good|set))\b/i.test(lower)) return "confetti";
  if (/\b(safety|self-harm|crisis|here for you)\b/i.test(lower)) return "gentle";
  return undefined;
}

// ---------------------------------------------------------------------------
// LLM call
// ---------------------------------------------------------------------------

async function getAgentResponse(conversationId, userMessage) {
  const conv = getConversation(conversationId);

  // Inject fresh weather if the conversation is new or weather might be relevant
  if (conv.messages.length <= 2 || /weather|cold|rain|walk|outside|jacket|umbrella|ride|uber|lyft/.test(userMessage.toLowerCase())) {
    const weather = await getWeather();
    if (weather) {
      // Update or add weather context as second message (after system)
      const weatherMsg = { role: "system", content: `[Current weather at Northview State: ${weather.summary}. This is live data.]` };
      if (conv.messages.length >= 2 && conv.messages[1].role === "system" && conv.messages[1].content.includes("[Current weather")) {
        conv.messages[1] = weatherMsg;
      } else {
        conv.messages.splice(1, 0, weatherMsg);
      }
    }
  }

  conv.messages.push({ role: "user", content: userMessage });

  if (conv.messages.length > 42) {
    conv.messages = [conv.messages[0], ...conv.messages.slice(-40)];
  }

  const completion = await openai.chat.completions.create({
    model: MODEL,
    messages: conv.messages,
    max_tokens: 1024,
    temperature: 0.7,
  });

  const reply = completion.choices[0]?.message?.content || "I'm here. Say more and I'll help.";
  conv.messages.push({ role: "assistant", content: reply });
  return reply;
}

// ---------------------------------------------------------------------------
// Message handler
// ---------------------------------------------------------------------------


// Resolve [SPOTIFY:query] tags in agent replies to real Spotify links
async function resolveSpotifyTags(text) {
  const tagPattern = /\[SPOTIFY:([^\]]+)\]/g;
  const matches = [...text.matchAll(tagPattern)];
  if (matches.length === 0) return text;

  for (const match of matches) {
    const query = match[1].trim();
    console.log(`  🎵 Spotify search: "${query}"`);
    try {
      const playlist = await findPlaylist(query, SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET);
      if (playlist && playlist.url) {
        const replacement = `${playlist.url}`;
        text = text.replace(match[0], replacement);
        console.log(`  🎵 Found: ${playlist.name} — ${playlist.url}`);
      } else {
        text = text.replace(match[0], "");
      }
    } catch (e) {
      console.error(`  🎵 Spotify failed for "${query}":`, e.message);
      text = text.replace(match[0], "");
    }
  }
  return text.replace(/\n{3,}/g, "\n\n").trim();
}

async function handleIncomingMessage(payload) {
  const message = payload.data?.message;
  if (!message) {
    console.log("Webhook: no message data");
    return;
  }

  const conversationId = message.conversation_id;
  const remoteNumber = message.remote_number || message.remote_phone_number;
  const text = message.content || message.text || "";
  const messageId = message.id;

  console.log(`\n📨 iMessage from ${remoteNumber}: "${text}"`);
  if (!text.trim()) return;

  // 1. Mark as read
  await markRead(conversationId);

  // 2. Tapback
  const reaction = pickReaction(text);
  if (reaction) {
    console.log(`  👍 Reacting: ${reaction}`);
    await sendReaction(messageId, reaction);
  }

  // 3. Typing indicator
  await sendTyping(conversationId);

  // 4. LLM response
  console.log("  🤖 Calling LLM...");
  let reply;
  try {
    reply = await getAgentResponse(conversationId, text);
  } catch (e) {
    console.error("  ❌ LLM error:", e.message);
    reply = "Having a moment — try again in a sec.";
  }

  // Post-process: resolve [SPOTIFY:query] tags into real links
  reply = await resolveSpotifyTags(reply);

  console.log(`  💬 Reply (${reply.length} chars): "${reply.substring(0, 120)}..."`);

  // 5. Send style
  const sendStyle = pickSendStyle(reply);
  if (sendStyle) console.log(`  ✨ Send style: ${sendStyle}`);

  // 6. Split and send
  const parts = splitReply(reply);

  for (let i = 0; i < parts.length; i++) {
    const isLast = i === parts.length - 1;
    const opts = { conversationId, text: parts[i] };
    if (isLast && sendStyle) opts.sendStyle = sendStyle;

    try {
      await identity.sendIMessage(opts);
      if (!isLast) {
        await sleep(800);
        await sendTyping(conversationId);
        await sleep(400);
      }
    } catch (e) {
      console.error(`  ❌ Send failed (part ${i + 1}):`, e.message);
    }
  }

  console.log("  ✅ Response sent");
}

function splitReply(text) {
  if (text.length <= 500) return [text];
  const paragraphs = text.split(/\n\n+/).filter((p) => p.trim());
  if (paragraphs.length > 1 && paragraphs.every((p) => p.length <= 600)) return paragraphs;
  const chunks = [];
  let current = "";
  for (const sentence of text.split(/(?<=[.!?])\s+/)) {
    if (current.length + sentence.length > 400 && current.length > 0) {
      chunks.push(current.trim());
      current = sentence;
    } else {
      current += (current ? " " : "") + sentence;
    }
  }
  if (current.trim()) chunks.push(current.trim());
  return chunks.length > 0 ? chunks : [text];
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

// ---------------------------------------------------------------------------
// HTTP handler (for the Inkbox tunnel to forward to)
// ---------------------------------------------------------------------------

function readBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on("data", (c) => chunks.push(c));
    req.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")));
    req.on("error", reject);
  });
}

const httpHandler = async (req, res) => {
  if (req.method === "GET" && req.url === "/__health") {
    res.writeHead(200, { "content-type": "application/json" });
    res.end(JSON.stringify({ ok: true, service: "thread-imessage-agent" }));
    return;
  }

  if (req.method === "POST" && req.url === "/webhook") {
    const rawBody = await readBody(req);

    if (INKBOX_SIGNING_KEY && !verifySignature(rawBody, req.headers)) {
      console.log("⚠️  Signature verification failed — processing anyway");
    }

    let payload;
    try {
      payload = JSON.parse(rawBody);
    } catch {
      res.writeHead(422, { "content-type": "application/json" });
      res.end(JSON.stringify({ error: "Invalid JSON" }));
      return;
    }

    const eventType = payload.event_type;
    if (eventType !== "imessage.sent" && eventType !== "imessage.delivered") {
      console.log(`\n🔔 Webhook: ${eventType}`);
    }

    if (eventType === "imessage.received") {
      handleIncomingMessage(payload).catch((e) => console.error("Handler error:", e));
    } else if (eventType === "imessage.reaction_received") {
      const r = payload.data?.reaction;
      console.log(`  💜 Reaction: ${r?.reaction} on ${r?.message_id}`);
    } else {
      console.log(`  ℹ️  Event: ${eventType}`);
    }

    res.writeHead(200, { "content-type": "application/json" });
    res.end(JSON.stringify({ ok: true }));
    return;
  }

  res.writeHead(404, { "content-type": "application/json" });
  res.end(JSON.stringify({ error: "Not found" }));
};

// ---------------------------------------------------------------------------
// Startup — HTTP server first, then tunnel with wait()
// ---------------------------------------------------------------------------

async function main() {
  console.log("🧵 THREAD iMessage Agent starting...");
  console.log(`   Model: ${MODEL}`);
  console.log(`   LLM endpoint: ${OPENAI_BASE_URL}`);

  identity = await inkbox.getIdentity(IDENTITY_HANDLE);
  console.log(`   Identity: @${IDENTITY_HANDLE} (${identity.emailAddress})`);
  console.log(`   iMessage: ${identity.imessageEnabled ? "enabled ✅" : "DISABLED ❌"}`);

  // Start local HTTP server first (tunnel needs something to forward to)
  const server = createServer(httpHandler);
  await new Promise((resolve) => {
    server.listen(8181, "127.0.0.1", () => {
      console.log("   Local HTTP server on :8181");
      resolve();
    });
  });

  // Connect tunnel — this opens the persistent H2 data-plane connection
  console.log("\n🔗 Connecting Inkbox tunnel...");
  const listener = await connect(inkbox, {
    name: IDENTITY_HANDLE,
    forwardTo: "http://127.0.0.1:8181",
  });
  console.log(`   Tunnel live at: ${listener.publicUrl}`);
  console.log(`   Webhook URL: ${listener.publicUrl}/webhook`);
  console.log("\n🚀 Ready for iMessages!");
  console.log(`   Triage: text "connect @thread" to the iMessage triage number\n`);

  // CRITICAL: wait() blocks and keeps the tunnel connection alive.
  // Without this, the H2 data-plane connection drops silently.
  try {
    await listener.wait();
  } finally {
    listener.close();
    server.close();
  }
}

main().catch((e) => {
  console.error("Fatal:", e);
  process.exit(1);
});