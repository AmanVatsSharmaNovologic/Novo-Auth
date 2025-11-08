<!-- Auth module architecture blueprint for the Novo Auth frontend -->

# Novo Auth Frontend Architecture

This document captures the module-level blueprint for the Next.js authentication experience that integrates with the `api.novologic.co` GraphQL backend and synchronizes authentication sessions across all Novo subdomains.

## Objectives

- Provide a single cohesive authentication module covering signup, login, social logins, multi-factor authentication (TOTP + SMS/email OTP), password recovery, email verification, and post-auth module selection.
- Leverage NextAuth for session management, persisting secure cookies across `*.novologic.co` to enable seamless SSO.
- Consume the backend GraphQL API with a resilient client, emphasizing robust error handling, extensive console logging for debugging, and clear inline documentation for future maintainers.

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Auth Library:** NextAuth (latest) with custom GraphQL adapter
- **GraphQL Client:** `@apollo/client` (SSR-aware) with link middleware for auth tokens and retry logic
- **Styling:** Tailwind CSS 4 + multi-theme design tokens (light, dark, construction) driven by CSS variables
- **State/Forms:** React Hook Form + Zod for schema validation
- **MFA Helpers:** `otplib` for TOTP, dedicated GraphQL mutations for OTP delivery/verification
- **Observability:** `@vercel/analytics` (optional), console logging at each flow checkpoint, and structured error reporting hook

## Directory Layout (proposed)

```
app/
  api/auth/[...nextauth]/route.ts # NextAuth binding
  (public)/
    layout.tsx                    # Shared shell for unauthenticated routes
    login/page.tsx
    signup/page.tsx
    verify-email/page.tsx
    reset-password/page.tsx
  (protected)/
    layout.tsx
    dashboard/page.tsx
    mfa/setup/page.tsx
    mfa/verify/page.tsx
  not-found.tsx                   # Themed 404 experience
components/
  auth/                           # Credential + MFA building blocks
  layout/                         # AuthContainer, ProtectedRoute, ThemeProvider, ThemeToggle
  ui/                             # Button, Input, Card, Alert primitives
lib/
  apollo/{client,links}.ts        # Apollo client + link stack
  auth/{next-auth-options,session}.ts
  graphql/{mutations,queries,fragments}.ts
  logging/console.ts
  utils/{cn,cookies,errors}.ts
docs/auth/{architecture,flows,graphql-contract,diagrams,roadmap}.md
middleware.ts                     # Logs + future auth gating
```

> Console statements must be present inside service helpers and page-level actions to trace request lifecycles, including success/failure states, input validation results, and redirection decisions.

### Logging Helpers

- Use `logTrace`, `logInfo`, `logWarn`, and `logError` from `lib/logging/console.ts` instead of raw `console.*` calls.
- Every helper auto-injects an ISO timestamp and expects a `scope` + `event` pair; include sanitized `context` objects when additional metadata helps debugging.
- Wrap async GraphQL operations with `withLogging({ scope, context }, action)` to guarantee consistent success/error telemetry.

## NextAuth Configuration

- The credential provider currently validates input and logs structured events before delegating to the future GraphQL `authLogin` mutation.
- OAuth providers (Google, GitHub) are pre-wired with environment-variable credentials and log selections via `logInfo`.
- JWT/session callbacks will hydrate NextAuth tokens with GraphQL payloads (access/refresh tokens, module memberships, MFA requirements).
- Events feed into the logging pipeline to aid observability.

- **Credential provider:** Delegates email/password authentication to GraphQL `authLogin` mutation. Expects MFA requirement flags and session tokens in the response.
- **Social providers:** Use NextAuth OAuth flow; upon callback, invoke `authSocialLogin` mutation with provider token to obtain Novo session credentials. Include console debug logs before/after GraphQL round-trips.
- **JWT callback:** Store `accessToken`, `refreshToken`, `mfaRequired`, `verified` flags from backend. Log each mutation result and validation step.
- **Session callback:** Expose normalized session object to client components, including `modules` membership for the dashboard.

## Session & SSO Strategy

- Issue HttpOnly secure cookies scoped to `.novologic.co` to enable single sign-on across subdomains (NextAuth session cookie + backend refresh cookie if needed).
- Utilize backend-issued `accessToken` for GraphQL operations; refresh via `authRefresh` mutation when tokens expire. Implement Apollo link to intercept `UNAUTHENTICATED` errors, trigger refresh, log attempts, and retry once.
- Mirror session state in NextAuth JWT to drive UI gating; use middleware to redirect unauthenticated users to `/login`.

## MFA & Recovery Flows

1. **Enrollment:**
   - After successful login without active MFA, direct users to `/mfa/setup`.
   - Fetch shared secret via `authMfaEnroll` (GraphQL), render QR + manual key through `TotpSetup`.
   - Submit initial TOTP code via `authMfaVerify` mutation; on success, display recovery codes and persist acknowledgement. Log all states.
2. **Verification Prompt:**
   - When backend flags `mfaRequired`, NextAuth callback reroutes to `/mfa/verify` with context.
   - User provides TOTP; fallback to requesting SMS/email OTP via `authOtpRequest`.
   - Validate code through `authOtpVerify`; errors logged with sanitized payloads.
3. **Recovery Codes:**
   - `RecoveryCodes.tsx` surfaces backup codes; allow regeneration via GraphQL mutation. Prevent caching with appropriate headers.

## Error Handling & Logging

- Centralize console logging in `lib/logging/console.ts` with helpers: `logInfo`, `logWarning`, `logError`, `logTrace`. Include correlation IDs from backend responses when available.
- Integrate error boundaries for page segments to capture render-time failures.
- Normalize GraphQL errors via `lib/utils/errors.ts`, mapping to user-friendly messages while logging raw details for debugging.
- Enforce exhaustive try/catch around every server action and mutation invocation with console logs in both success and failure branches.

## Required Dependencies (to be installed)

- `next-auth`
- `@apollo/client`, `graphql`
- `react-hook-form`, `@hookform/resolvers`, `zod`
- `otplib`
- `clsx`, `tailwind-merge`, `@radix-ui/react-slot` (UI utilities)
- `@vercel/analytics` (optional observability)

### Theming & UI Conventions

- Theme switching is handled by `ThemeProvider` + `ThemeToggle`; consume utilities such as `bg-surface-primary`, `bg-panel`, `text-foreground`, and `text-muted`.
- Tailwind design tokens and color variables live in `app/globals.css`; avoid hardcoding colors so all three themes stay aligned.
- Reusable UI primitives (`components/ui`) should be used across all flows. Extend them rather than writing raw elements.

> Install dependencies incrementally; keep README in sync with the exact versions used.

## Environment Variables (draft)

| Variable | Purpose |
| --- | --- |
| `NEXTAUTH_URL` | Base URL for NextAuth callbacks |
| `NEXTAUTH_SECRET` | Encryption key for NextAuth JWT/cookies |
| `NEXTAUTH_TRUST_HOST` | Required for multi-domain deployments |
| `GRAPHQL_ENDPOINT` | `https://api.novologic.co/graphql` |
| `GRAPHQL_WS_ENDPOINT` | Optional for subscriptions |
| `OAUTH_GOOGLE_CLIENT_ID` / `SECRET` | Google OAuth |
| `OAUTH_GITHUB_CLIENT_ID` / `SECRET` | GitHub OAuth |
| `SMS_PROVIDER_KEY` | Backend-provided if proxying SMS OTP |

## Security Guardrails

- Enforce HTTPS-only cookies, SameSite `lax`, and CSRF protection via NextAuth.
- Rate-limit sensitive mutations (signup, OTP) server-side; expose `Retry-After` hints client-side.
- Obfuscate console logs for secrets (never print tokens or passwords); log hashed user identifiers.
- Adopt Content Security Policy once UI stabilizes.

## Deployment Considerations

- Configure Next.js middleware to detect session tokens and redirect unauthenticated requests.
- Ensure `*.novologic.co` subdomains share the same cookie domain and TLS certificate.
- Plan blue/green rollout to validate session federation before migrating existing modules.

## Next Steps

- Finalize GraphQL contract with backend team.
- Produce detailed flow documentation (`flows.md`) with sequence diagrams.
- Scaffold client libraries and NextAuth config once dependencies are added.
- Update top-level `README.md` with summarized setup instructions and troubleshooting matrix.


