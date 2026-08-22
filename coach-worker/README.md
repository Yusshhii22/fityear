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

Then open FitYear → **Progress → 💬 Coach**, paste that URL, and start chatting.

### Optional configuration (Worker environment variables)
| Variable | Default | Purpose |
| --- | --- | --- |
| `ANTHROPIC_API_KEY` | — | **Required.** Your Anthropic key (set as a secret, above). |
| `MODEL` | `claude-opus-5` | Switch to `claude-sonnet-5` or `claude-haiku-4-5` for lower cost/latency. |
| `ALLOWED_ORIGIN` | `*` | Lock CORS to your app's origin, e.g. `https://yourname.github.io`. |

Set non-secret vars in `wrangler.toml` under `[vars]`, or with
`wrangler deploy --var MODEL:claude-sonnet-5`.

## Costs & privacy
- You pay Anthropic per message (Opus is priciest; Haiku is cheapest). Set a
  spend limit in the Anthropic console. Switch `MODEL` to reduce cost.
- The app sends your **profile and progress summary** (no raw photos) to *your*
  Worker, which forwards it to Anthropic to answer. Nothing is stored by the Worker.

## Other hosts
The handler is a standard `fetch(request, env)` export. It also runs on
Deno Deploy and Val.town as-is. For Vercel/Netlify/AWS Lambda, wrap the same
logic in that platform's handler signature and read the env vars the same way.
