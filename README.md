# GitScope AI
Your GitHub presence, understood. Monorepo with a Next.js frontend and an independent Fastify API.

```
npm install
cp .env.example .env     # set GEMINI_API_KEY and GEMINI_MODEL; GITHUB_TOKEN is optional
npm run dev              # api on :4000, web on :3000
npm test                 # backend unit + integration tests (external APIs mocked)
npm run test:e2e         # smoke test against running servers
```
| Folder | Responsibility |
|---|---|
| `frontend/` | UI only: pages, components, client state, typed API services. No secrets. |
| `backend/` | Fastify REST API under `/api/v1`: GitHub client, analysis engine, scoring, Gemini, validation, errors. |
| `shared/` | Types and constants used by both sides. |
| `tests/e2e/` | Smoke test across both apps. |

Scores are internal heuristics on public signals, not an official or definitive assessment.
