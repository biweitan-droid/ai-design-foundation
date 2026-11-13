# Taskroom: project instructions

This is a designer's hands-on AI-native delivery exercise. Explain decisions in plain Chinese; keep product copy in English. Work one stage at a time as requested in START_HERE.md. Do not implement later stages prematurely.

## Existing system
- Native JavaScript ES modules, HTML, CSS; Node 22+ for local tooling. No dependencies or npm install required.
- Start: `npm run dev`; checks: `npm run check`; tests: `npm test`; build: `npm run build`.
- App: src/app.js and src/app.css. Library: components.html + src/showcase.js.
- Design tokens: src/design-system/tokens.css; components: src/design-system/components.js + components.css.
- Data: src/data/seed.js and task-service.js; createTask already exists; UI does not.
- Docs: docs/01-product-brief.md through docs/07-company-transfer.md.
- Learner outputs go in outputs/; never claim unperformed validation.

## Design / implementation rules
- Reuse Button, Field, Dialog, Badge, Banner, Toast; use existing CSS tokens.
- Inspect actual component signatures before implementing. Do not invent props.
- No new framework, package, backend, auth, AI feature or unrelated redesign.
- Prefer a feature module; avoid circular imports between app and feature. Pass service and onCreated callback into it.
- Keep all task strings inserted with textContent; do not inject user data via innerHTML.
- Preserve existing rows, demo tools, component library and responsive layout.
- Render field errors inline; focus first invalid field. Loading prevents duplicate submits.
- Failure retains input and permits retry. Only success closes dialog and refreshes the list.
- Use native dialog semantics; test Tab, Shift+Tab, Escape and focus restoration.
- Treat localStorage as a simulated data layer, not a real multi-user backend.

## Git / release
- Feature work on `feat/create-task`, not main. Inspect git status before editing.
- Keep unrelated user edits. Do not force-push or reset --hard.
- Follow the learner's current instruction for commits and remote actions. Do not merge or deploy during planning or implementation stages.
- Release workflow is manual, main-only; merging does not deploy.
- Never put real company data, credentials or private assets into this exercise.
- Check results and diff before describing work as ready. Code tests do not establish visual or keyboard correctness.
