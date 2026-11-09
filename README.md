# Visually

Visually is a whiteboard-first tutor prototype for students. Instead of leading with a long chat response, it explains an inquiry by progressively drawing a structured board, then checks understanding before showing the next move.

**Static demo:** [https://pandacat901.github.io/visual-tutor/](https://pandacat901.github.io/visual-tutor/)

## Current status

- The public GitHub Pages link above is a free, static demonstration with predefined math, science, and theory boards.
- The `main` branch contains a Vercel-ready Next.js application with a server-side OpenAI lesson planner for custom text inquiries.
- The planner requests validated board actions (`Lesson` and `BoardElement`), rather than displaying the model's prose response.
- Without `OPENAI_API_KEY`, the server deployment deliberately falls back to a labeled demonstration lesson.
- Image/PDF attachment extraction and AI-generated follow-up boards are represented in the interface, but are not implemented yet.

The Pages demo is intentionally frozen at the last static deployment. GitHub Pages cannot run a server API route or securely hold an API key.

## Student experience in the prototype

- Start with a problem, question, or difficult concept.
- Watch the explanation arrive as a hand-drawn whiteboard sequence.
- Answer a short comprehension check, or use the spoiler controls to reveal more.
- Use the built-in examples to explore the visual interaction without an AI account or usage costs.

## Deploy the live AI tutor

GitHub Pages cannot run server API routes or keep an OpenAI key secret, so deploy the live app on Vercel:

1. In Vercel, import `Pandacat901/visual-tutor` from GitHub.
2. Add `OPENAI_API_KEY` as a **Secret** environment variable. Never prefix it with `NEXT_PUBLIC_`.
3. Optionally add `OPENAI_MODEL=gpt-5-mini`; the app uses that model by default.
4. Deploy or redeploy after saving the variables. Vercel detects the Next.js application automatically.

An OpenAI key is not shown to visitors, but a public app can still spend its owner's API balance when visitors submit requests. Do not enable paid API access on an unrestricted public deployment. Add authentication/access control, per-user rate limits, and OpenAI budget alerts first.

## Next build priorities

1. Private tester access, rate limits, and usage monitoring before any public AI launch.
2. Secure image/PDF/text extraction so uploaded context can reach the planner.
3. AI follow-up planning that extends the existing board instead of adding a demo note.
4. Subject-specific evaluation: mathematical checking, source-aware research mode, and visual-layout quality tests.

## Run locally

```bash
npm install
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000).

## Validation

```bash
npm run typecheck
npm run lint
npm run build
```
