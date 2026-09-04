# FitYear Coach — serverless proxy

The Conversational Coach in FitYear talks to Claude. Claude needs an API key, and
that key **must not** live in the browser app (anyone could read it). This tiny
Cloudflare Worker holds the key server-side and is the only thing the app talks to.

The app itself stays a static PWA — this is the one small piece of backend, and
it's optional: without it, the on-device Smart Coach still works fully offline.

## What you need
- A free [Cloudflare](https://dash.cloudflare.com/sign-up) account
- An [Anthropic API key](https://console.anthropic.com/) (starts with `sk-ant-...`)
- Node.js installed locally (for the `wrangler` CLI)

## Deploy (Cloudflare Workers)
```bash
cd coach-worker
npm install -g wrangler        # Cloudflare's CLI
wrangler login                 # opens the browser to authorize

# create the Worker + set your secret key (paste it when prompted)
wrangler secret put ANTHROPIC_API_KEY

wrangler deploy                # prints your Worker URL, e.g.
                               # https://fityear-coach.<you>.workers.dev
```

Then either paste that URL in FitYear → **Progress → 💬 Coach**, or (for a public
build) set `DEFAULT_COACH_ENDPOINT` near the top of `app.js` so it works for
everyone with no setup.

### Configuration (Worker environment variables)
| Variable | Default | Purpose |
| --- | --- | --- |
| `ANTHROPIC_API_KEY` | — | **Required.** Your Anthropic key (set as a secret, above). |
| `MODEL` | `claude-opus-5` | Switch to `claude-sonnet-5` or `claude-haiku-4-5` for lower cost/latency. |
| `ALLOWED_ORIGIN` | `*` | **Recommended for public builds.** Lock to your app's origin, e.g. `https://yusshhii22.github.io`. Enforced server-side. |
| `APP_TOKEN` | — | Optional shared token; when set, the app must send it (light abuse deterrent, not a real secret). |
| `RATE_PER_MIN` | `8` | Per-IP requests/min (needs `COACH_KV`). |
| `DAILY_CAP` | — | Global max coach calls/day (needs `COACH_KV`). |
| `FEEDBACK_WEBHOOK` | — | Discord/Slack/Zapier webhook that receives in-app feedback. |

Set non-secret vars in `wrangler.toml` under `[vars]`; set secrets with
`wrangler secret put ANTHROPIC_API_KEY` (and `APP_TOKEN` if used).

### Abuse protection for a public beta (do this)
A public endpoint spends **your** Anthropic budget, so:
1. **Set a spend limit** in the Anthropic console — this is the real safety net.
2. **Set `ALLOWED_ORIGIN`** to your Pages URL.
3. **Enable rate limiting**: create a KV namespace and bind it as `COACH_KV`
   (uncomment the block in `wrangler.toml`), then `RATE_PER_MIN` / `DAILY_CAP`
   take effect. Without `COACH_KV` the Worker still runs but is unthrottled.
4. Consider `claude-haiku-4-5` as `MODEL` during testing to keep costs low.

## Feedback capture
The same Worker accepts `POST { feedback, meta }` from the app's **Send feedback**
button. Set `FEEDBACK_WEBHOOK` to a Discord/Slack/Zapier incoming webhook and each
submission arrives there; with `COACH_KV` bound it's also stored (90-day TTL).

## Costs & privacy
- You pay Anthropic per message (Opus is priciest; Haiku is cheapest). Set a
  spend limit in the Anthropic console. Switch `MODEL` to reduce cost.
- The app sends your **profile and progress summary** (no raw photos) to *your*
  Worker, which forwards it to Anthropic to answer. The Worker stores nothing
  except feedback you submit (only when `COACH_KV` is bound).

## Other hosts
The handler is a standard `fetch(request, env)` export. It also runs on
Deno Deploy and Val.town as-is. For Vercel/Netlify/AWS Lambda, wrap the same
logic in that platform's handler signature and read the env vars the same way.
