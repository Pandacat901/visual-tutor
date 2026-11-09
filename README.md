# Visually

Visually is a whiteboard-first AI tutor prototype. Students bring a question, problem, image, or document; the tutor builds a progressive visual explanation, checks comprehension, and adapts without forcing a traditional chat experience.

**Static demo:** [https://pandacat901.github.io/visual-tutor/](https://pandacat901.github.io/visual-tutor/)

## What is in this prototype

- Student inquiry composer with image/PDF attachment UI
- Progressive, hand-drawn whiteboard lessons
- Guided comprehension checks
- A spoiler ladder: nudge, next step, or full solution
- Follow-up questions added directly to the board
- Demonstrations for mathematics, science, and abstract theory
- Responsive student workspace

The GitHub Pages site is a frozen static demonstration. The application now includes a server-side OpenAI planner that returns validated `Lesson` and `BoardElement` actions, rather than a prose chat response. Without an API key it deliberately falls back to a labeled demonstration lesson.

## Deploy the live AI tutor

GitHub Pages cannot run server API routes or keep an OpenAI key secret, so deploy the live app on Vercel:

1. In Vercel, import `Pandacat901/visual-tutor` from GitHub.
2. In the project environment variables, add `OPENAI_API_KEY` (as a secret) and optionally `OPENAI_MODEL=gpt-5-mini`.
3. Deploy. Vercel detects this Next.js app automatically.

Do not put an OpenAI key in a `NEXT_PUBLIC_` variable, source file, or GitHub commit. The current planner accepts text inquiries; secure image/PDF reading and AI-generated follow-up boards are the next implementation steps.

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
