// FitYear Coach — a tiny serverless proxy that holds your Anthropic API key and
// calls Claude on the app's behalf. The key must NEVER live in the client-side
// app (anyone could read it), so the browser talks to this Worker instead.
//
// Deploy on Cloudflare Workers (see README.md), set the secret ANTHROPIC_API_KEY,
// then paste the Worker URL into FitYear → Progress → Coach.
//
// Env vars:
//   ANTHROPIC_API_KEY  (secret, required)
//   MODEL              (optional, default "claude-opus-5"; e.g. "claude-sonnet-5"
//                       or "claude-haiku-4-5" for lower cost/latency)
//   ALLOWED_ORIGIN     (optional, default "*"; set to your app's origin to lock down)

const ANTHROPIC_URL = "https://api.anthropic.com/v1/messages";

export default {
  async fetch(request, env) {
    const origin = env.ALLOWED_ORIGIN || "*";
    const cors = {
      "Access-Control-Allow-Origin": origin,
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    };

    if (request.method === "OPTIONS") return new Response(null, { headers: cors });
    if (request.method === "GET") return json({ ok: true, service: "fityear-coach" }, 200, cors);
    if (request.method !== "POST") return json({ error: "Use POST." }, 405, cors);
    if (!env.ANTHROPIC_API_KEY) return json({ error: "Server missing ANTHROPIC_API_KEY." }, 500, cors);

    let body;
    try { body = await request.json(); } catch { return json({ error: "Invalid JSON body." }, 400, cors); }

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
    const reply = (data.content || []).filter((b) => b.type === "text").map((b) => b.text).join("\n").trim();
    return json({ reply: reply || "(No response — try rephrasing.)" }, 200, cors);
  },
};

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
    "",
    "== User data ==",
    JSON.stringify(ctx, null, 2),
  ];
  return lines.join("\n");
}
