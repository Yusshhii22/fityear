// FitYear Coach — a tiny serverless proxy that holds your Anthropic API key and
// calls Claude on the app's behalf. The key must NEVER live in the client-side
// app (anyone could read it), so the browser talks to this Worker instead.
// It also captures in-app feedback (POST with { feedback }).
//
// Deploy on Cloudflare Workers (see README.md), set the secret ANTHROPIC_API_KEY,
// then set DEFAULT_COACH_ENDPOINT in app.js (or paste the URL in-app).
//
// Env vars:
//   ANTHROPIC_API_KEY  (secret, required)
//   MODEL              (optional, default "claude-opus-5"; e.g. "claude-sonnet-5"
//                       or "claude-haiku-4-5" for lower cost/latency)
//   ALLOWED_ORIGIN     (optional; set to your app's origin, e.g.
//                       "https://yusshhii22.github.io" — enforced server-side)
//   APP_TOKEN          (optional; if set, requests must send header x-app-token)
//   RATE_PER_MIN       (optional, default 8; per-IP requests/min — needs COACH_KV)
//   DAILY_CAP          (optional; global max coach calls/day — needs COACH_KV)
//   FEEDBACK_WEBHOOK   (optional; a Discord/Slack/Zapier webhook to receive feedback)
//   COACH_KV           (optional KV binding; enables rate limiting + feedback storage)

const ANTHROPIC_URL = "https://api.anthropic.com/v1/messages";

export default {
  async fetch(request, env) {
    const allowed = env.ALLOWED_ORIGIN || "*";
    const reqOrigin = request.headers.get("Origin") || "";
    const cors = {
      "Access-Control-Allow-Origin": allowed === "*" ? "*" : allowed,
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, x-app-token",
      "Vary": "Origin",
    };

    if (request.method === "OPTIONS") return new Response(null, { status: 204, headers: cors });
    if (request.method === "GET") return json({ ok: true, service: "fityear-coach" }, 200, cors);
    if (request.method !== "POST") return json({ error: "Use POST." }, 405, cors);

    // Origin lock: when configured, reject browser calls from other sites.
    if (allowed !== "*" && reqOrigin && reqOrigin !== allowed) {
      return json({ error: "Origin not allowed." }, 403, cors);
    }
    // Optional shared app token (light obfuscation, not a real secret).
    if (env.APP_TOKEN && request.headers.get("x-app-token") !== env.APP_TOKEN) {
      return json({ error: "Unauthorized." }, 401, cors);
    }

    let body;
    try { body = await request.json(); } catch { return json({ error: "Invalid JSON body." }, 400, cors); }

    // Feedback path — same endpoint, distinguished by payload.
    if (typeof body.feedback === "string") return handleFeedback(body, env, cors);

    return handleCoach(body, env, cors, request);
  },
};

async function handleCoach(body, env, cors, request) {
  if (!env.ANTHROPIC_API_KEY) return json({ error: "Server missing ANTHROPIC_API_KEY." }, 500, cors);

  const ip = request.headers.get("cf-connecting-ip") || "anon";
  if (await rateLimited(env, ip)) return json({ error: "Slow down a moment and try again." }, 429, cors);
  if (await overDailyCap(env)) return json({ error: "The coach is resting for today — try again tomorrow." }, 429, cors);

  const history = Array.isArray(body.messages) ? body.messages.slice(-12) : [];
  if (!history.length) return json({ error: "No messages provided." }, 400, cors);

  const system = buildSystemPrompt(body.context || {});

  let res;
  try {
    res = await fetch(ANTHROPIC_URL, {
      method: "POST",
      headers: {
        "x-api-key": env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json",
      },
      body: JSON.stringify({
        model: env.MODEL || "claude-opus-5",
        max_tokens: 1024,
        output_config: { effort: "low" }, // snappy, grounded chat
        system,
        tools: [PROPOSE_TOOL],
        messages: history.map((m) => ({
          role: m.role === "assistant" ? "assistant" : "user",
          content: String(m.content || "").slice(0, 4000),
        })),
      }),
    });
  } catch (e) {
    return json({ error: "Upstream request failed: " + e.message }, 502, cors);
  }

  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    return json({ error: `Claude API error (${res.status}).`, detail: detail.slice(0, 500) }, 502, cors);
  }

  const data = await res.json();
  if (data.stop_reason === "refusal") {
    return json({ reply: "I can't help with that one — let's keep it about your training, nutrition, or recovery." }, 200, cors);
  }
  const blocks = data.content || [];
  const reply = blocks.filter((b) => b.type === "text").map((b) => b.text).join("\n").trim();
  const proposal = blocks.find((b) => b.type === "tool_use" && b.name === PROPOSE_TOOL.name);
  const actions = proposal && Array.isArray(proposal.input && proposal.input.actions) ? proposal.input.actions : [];
  return json({ reply: reply || (actions.length ? "Here's what I'd suggest — tap to apply:" : "(No response — try rephrasing.)"), actions }, 200, cors);
}

async function handleFeedback(body, env, cors) {
  const text = String(body.feedback || "").trim().slice(0, 4000);
  if (!text) return json({ error: "Empty feedback." }, 400, cors);
  const entry = { text, meta: body.meta || {}, at: new Date().toISOString() };

  if (env.FEEDBACK_WEBHOOK) {
    const summary = formatFeedback(entry);
    // content = Discord, text = Slack; harmless extra field for the other.
    await fetch(env.FEEDBACK_WEBHOOK, {
      method: "POST", headers: { "content-type": "application/json" },
      body: JSON.stringify({ content: summary, text: summary }),
    }).catch(() => {});
  }
  if (env.COACH_KV) {
    await env.COACH_KV.put(`fb:${Date.now()}`, JSON.stringify(entry), { expirationTtl: 60 * 60 * 24 * 90 }).catch(() => {});
  }
  return json({ ok: true }, 200, cors);
}

function formatFeedback(e) {
  const m = e.meta || {};
  const meta = [m.appVersion && `v${m.appVersion}`, m.goal, m.experience, m.level && `Lv${m.level}`].filter(Boolean).join(" · ");
  return `📝 FitYear feedback${meta ? ` (${meta})` : ""}\n${e.text}`;
}

// --- Rate limiting (best-effort; needs a COACH_KV namespace binding) ---
async function rateLimited(env, ip) {
  if (!env.COACH_KV) return false;
  const limit = parseInt(env.RATE_PER_MIN || "8", 10);
  const key = `rl:${ip}:${Math.floor(Date.now() / 60000)}`;
  const n = parseInt((await env.COACH_KV.get(key)) || "0", 10);
  if (n >= limit) return true;
  await env.COACH_KV.put(key, String(n + 1), { expirationTtl: 120 }).catch(() => {});
  return false;
}
async function overDailyCap(env) {
  if (!env.COACH_KV || !env.DAILY_CAP) return false;
  const key = `cap:${new Date().toISOString().slice(0, 10)}`;
  const n = parseInt((await env.COACH_KV.get(key)) || "0", 10);
  if (n >= parseInt(env.DAILY_CAP, 10)) return true;
  await env.COACH_KV.put(key, String(n + 1), { expirationTtl: 60 * 60 * 48 }).catch(() => {});
  return false;
}

function json(obj, status, cors) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: { "content-type": "application/json", ...cors },
  });
}

// Turn the app's compact context payload into a grounding system prompt so the
// coach reasons over the user's REAL numbers instead of making them up.
function buildSystemPrompt(ctx) {
  const lines = [
    "You are FitYear Coach, a warm, concise, practical strength & nutrition coach inside the FitYear app.",
    "Answer using the user's real data below. Be specific and encouraging; prefer 2–5 sentences unless asked for detail.",
    "You are not a doctor. For pain, injury, or medical concerns, recommend seeing a professional. Never give medical, drug, or extreme-diet advice.",
    "If data is missing, say what to log so you can help next time.",
    "When a concrete change would help (e.g. nudging calories, setting a reminder, logging weight, marking today done, or doing a monthly check-in), call the propose_plan_changes tool with small, reversible actions AND explain them in your text. The user taps to apply — you never change anything directly.",
    "",
    "== User data ==",
    JSON.stringify(ctx, null, 2),
  ];
  return lines.join("\n");
}

// The one tool the coach can call: propose concrete, reversible changes that the
// APP applies locally after the user taps to confirm. The Worker never mutates
// anything itself — it only relays the proposal.
const PROPOSE_TOOL = {
  name: "propose_plan_changes",
  description: "Propose concrete FitYear changes for the user to confirm and apply with a tap. Call this only when the user asks for a change or would clearly benefit from one. Always ALSO write a short natural-language explanation as text. Keep proposals small and reversible.",
  input_schema: {
    type: "object",
    properties: {
      actions: {
        type: "array",
        description: "One or more proposed changes.",
        items: {
          type: "object",
          properties: {
            type: {
              type: "string",
              enum: ["adjust_calories", "set_workout_reminder", "set_checkin_reminder", "start_checkin", "log_weight", "mark_workout_done"],
              description: "adjust_calories nudges the daily calorie target (capped ±300 total by the app). set_*_reminder toggles/schedules a reminder. start_checkin opens the monthly check-in. log_weight records today's body weight. mark_workout_done marks today's session complete.",
            },
            deltaKcal: { type: "number", description: "For adjust_calories: change per day, e.g. -100 or 100." },
            on: { type: "boolean", description: "For reminder actions: turn the reminder on (true) or off (false)." },
            time: { type: "string", description: "For reminder actions: 24h time HH:MM, e.g. 18:30." },
            kg: { type: "number", description: "For log_weight: today's body weight in kg." },
            label: { type: "string", description: "Short human label for the button, e.g. 'Trim 100 kcal/day'." },
          },
          required: ["type", "label"],
        },
      },
    },
    required: ["actions"],
  },
};
