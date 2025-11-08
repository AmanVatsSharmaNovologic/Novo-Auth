<!-- README guide for Novo Auth frontend -->

# Novo Auth Frontend

This repository houses the Next.js authentication experience that fronts the Novo platform. The app integrates with the core backend (`https://api.novologic.co`) via GraphQL and centralizes login, signup, MFA, and SSO across all Novo subdomains.

## High-Level Architecture

- **Framework:** Next.js 16 (App Router) with TypeScript and Tailwind CSS 4.
- **Authentication:** NextAuth (v4.24) configured with credential + social providers and GraphQL-backed adapters.
- **API Layer:** Apollo Client 4 with custom auth/retry/error links.
- **Theming:** Multi-mode (light, dark, construction) design system with persistent toggles and cookie/local-storage sync.
- **Forms & Validation:** React Hook Form + Zod resolvers for deterministic UX.
- **MFA:** TOTP via `otplib`, OTP fallbacks via backend mutations.
- **Session Sharing:** Secure cookies scoped to `.novologic.co` enabling cross-module SSO.
- **Logging:** Structured telemetry via `lib/logging/console.ts` helpers.
- **UI System:** Futuristic component library powered by reusable primitives in `components/ui`.

Refer to `docs/auth/architecture.md` for the complete module blueprint.

## Repository Layout (planned)

```
app/
  api/auth/[...nextauth]/route.ts   # NextAuth handler binding
  (public)/                         # Login, signup, verification, reset
  (protected)/                      # Authenticated surfaces (dashboard, MFA)
  not-found.tsx                     # Lost-in-space themed 404 experience
lib/
  apollo/                           # Apollo client + link composition
  auth/                             # NextAuth options + session helpers
  graphql/                          # Document nodes and fragments
  logging/console.ts                # Structured logging helpers
  utils/{cn,cookies,errors}.ts      # Shared utilities
components/
  auth/                             # CredentialForm, SocialProviders, MFA widgets
  layout/                           # AuthContainer, ProtectedRoute, ThemeProvider, ThemeToggle
  ui/                               # Button, Input, Card, Alert primitives
docs/auth/
  architecture.md
  flows.md
  graphql-contract.md
  diagrams/auth-module-flow.md
  roadmap.md
middleware.ts                       # Request logging + future gating
```

## Getting Started

1. **Install dependencies**
   ```bash
   npm install
   ```
2. **Create environment file**
   ```bash
   cp .env.example .env.local
   ```
3. **Populate secrets**
   - `NEXTAUTH_URL` → local URL (e.g., `http://localhost:3000`)
   - `NEXTAUTH_SECRET` → strong random string (use `openssl rand -base64 32`)
   - `GRAPHQL_ENDPOINT` → `https://api.novologic.co/graphql` (staging URL for local dev)
   - OAuth credentials (Google/GitHub) for social login testing
4. **Run development server**
```bash
npm run dev
   ```
5. Access the app at [http://localhost:3000](http://localhost:3000).
6. Run linting to confirm type safety + formatting rules:
   ```bash
   npm run lint
   ```

Keep the README synchronized with the actual setup process—update this section whenever new steps or dependencies are introduced.

## Environment Variables

| Name | Description |
| --- | --- |
| `NEXTAUTH_URL` | Base URL for NextAuth callbacks |
| `NEXTAUTH_SECRET` | NextAuth encryption secret |
| `NEXTAUTH_TRUST_HOST` | Enable multi-domain deployments (set to `true` in prod) |
| `GRAPHQL_ENDPOINT` | Core backend GraphQL endpoint |
| `GRAPHQL_WS_ENDPOINT` | Optional WebSocket endpoint for subscriptions |
| `OAUTH_GOOGLE_CLIENT_ID` / `OAUTH_GOOGLE_CLIENT_SECRET` | Google social login |
| `OAUTH_GITHUB_CLIENT_ID` / `OAUTH_GITHUB_CLIENT_SECRET` | GitHub social login |
| `SMS_PROVIDER_KEY` | Credential for backend-mediated SMS OTP (if required) |

Document any additional variables in this table before shipping features that depend on them.

## Development Workflow

- **Code Style:** TypeScript + ESLint (run `npm run lint`).
- **Testing:** Unit tests (React Testing Library), integration tests for auth flows, Cypress/Playwright for E2E.
- **GraphQL:** Store documents in `lib/graphql`. Use `graphql-code-generator` to keep TypeScript types aligned with the backend schema. Stubs for core mutations/queries are scaffolded for rapid integration.
- **Logging:** Always use `logTrace`, `logInfo`, `logWarn`, `logError`, or `withLogging` from `lib/logging/console.ts`. Raw console calls are disallowed.
- **Error Handling:** Normalize backend errors via `lib/utils/errors.ts`, display user-friendly copy, and emit detailed console logs with correlation IDs.
- **UI Primitives:** Consume the polymorphic components in `components/ui/` (`Button`, `Input`, `Card`, `Alert`) and layout wrappers instead of ad-hoc markup.
- **Styling & Themes:** `app/globals.css` defines the neon/futuristic design tokens across all themes; extend tokens and utilities (`bg-surface-primary`, `bg-panel`, `text-muted`) instead of hardcoding colors.
- **Theme Controls:** Use `ThemeProvider` + `ThemeToggle` when wiring new routes so the light/dark/construction modes stay in sync.

## Documentation Map

- `docs/auth/architecture.md` – overall architecture, dependencies, security guardrails.
- `docs/auth/flows.md` – step-by-step UX flow definitions and logging checkpoints.
- `docs/auth/graphql-contract.md` – GraphQL operations, schemas, and error mapping.
- `docs/auth/diagrams/auth-module-flow.md` – mermaid flowcharts for visual reference.

Always update documentation alongside code changes. Re-run diagram exports (if applicable) so stakeholders can rely on this repository as the source of truth.

## Roadmap Snapshot

- Scaffold NextAuth configuration with credential + social providers.
- Implement GraphQL client and token refresh pipeline.
- Build UI pages/components following flow outlines (currently staged with reusable primitives).
- Integrate MFA enrollment/verification and recovery codes.
- Deliver end-to-end tests for login → MFA → dashboard journey.
- Synchronize auth cookies across Novo subdomains before rolling out to production.

## Support & Contact

- Backend contract owners: identity team @ Novologic.
- Frontend maintainers: reach out on `#novo-auth` Slack channel.
- For production incidents, follow the Novo incident response playbook.

