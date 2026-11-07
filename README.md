# Visually

Visually is a whiteboard-first AI tutor prototype. Students bring a question, problem, image, or document; the tutor builds a progressive visual explanation, checks comprehension, and adapts without forcing a traditional chat experience.

**Cloud demo:** [https://pandacat901.github.io/visual-tutor/](https://pandacat901.github.io/visual-tutor/)

## What is in this prototype

- Student inquiry composer with image/PDF attachment UI
- Progressive, hand-drawn whiteboard lessons
- Guided comprehension checks
- A spoiler ladder: nudge, next step, or full solution
- Follow-up questions added directly to the board
- Demonstrations for mathematics, science, and abstract theory
- Responsive student workspace

The current build uses deterministic demonstration lessons so it runs without credentials. The whiteboard model is structured (`Lesson` and `BoardElement`), ready to accept actions produced by a server-side AI planner.

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

## Next milestone

Add a server-side tutoring planner that converts uploaded inquiries into validated board actions, with document extraction, mathematical verification, and source citations.
