# Portfolio Chat Worker (Cloudflare Workers)

This Worker provides a small API that your GitHub Pages site can call without exposing any OpenAI secrets in the browser.

## Endpoints

- `POST /api/chat`
  - Body: `{ "question": "..." }`
  - Returns: `{ "answer": "..." }`

## Setup

1) Install dependencies

- `cd worker`
- `npm i`

2) Authenticate Wrangler

- `npx wrangler login`

3) Set the OpenAI key as a secret (never commit it)

- `npx wrangler secret put OPENAI_API_KEY`

4) Configure allowed origins + profile URL

Edit `wrangler.toml`:
- `PROFILE_URL` should point to your deployed knowledge base (default: `https://RelCode.github.io/ai/profile.md`).
- `ALLOWED_ORIGINS` should include your GitHub Pages origin.
- `OPENAI_MODEL` pick a model you have access to.

5) Run locally

- `npm run dev`

6) Deploy

- `npm run deploy`

## Frontend wiring

In the React app, set:

- `REACT_APP_AI_CHAT_API_URL` = `https://<your-worker>.<your-subdomain>.workers.dev/api/chat`

For local dev, you can point it to the local Worker URL from `wrangler dev`.
