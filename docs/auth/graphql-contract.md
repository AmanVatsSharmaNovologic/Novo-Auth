<!-- GraphQL operation specifications for Novo Auth frontend -->

# GraphQL Contract Reference

This document captures the expected GraphQL operations consumed by the Novo Auth frontend when communicating with `https://api.novologic.co/graphql`. Keep the contract synchronized with backend evolution; update this file whenever schema changes impact the authentication module.

## Endpoint Summary

- **HTTP Endpoint:** `POST https://api.novologic.co/graphql`
- **WebSocket Endpoint:** `wss://api.novologic.co/graphql` (optional, for session revocation notifications)
- **Headers:**
  - `authorization: Bearer <accessToken>` for authenticated calls
  - `x-novo-client: novo-auth-frontend`
  - `x-request-id: <uuid>` (generated client-side for tracing)

All GraphQL requests must log the operation name, variables (sanitized), and correlation ID from the response headers.

## Mutation Catalogue

| Operation | Purpose | Variables | Response Shape | Notes |
| --- | --- | --- | --- | --- |
| `AuthSignup` | Register new user | `input: { email, password, fullName, consent }` | `{ user { id, email, status }, requiresVerification, correlationId }` | On success, `requiresVerification=true`; backend sends email magic link |
| `AuthLogin` | Email/password login | `input: { email, password, device }` | `{ session { accessToken, refreshToken, expiresAt }, mfa { required, methods }, user { id, modules } }` | Returns `errorCode` union on failure |
| `AuthSocialLogin` | OAuth login | `input: { provider, providerToken, device }` | Same as `AuthLogin` | Called from NextAuth `signIn` callback |
| `AuthRefresh` | Refresh tokens | `input: { refreshToken }` | `{ session { accessToken, refreshToken, expiresAt } }` | Use Apollo link to trigger; log refresh attempts |
| `AuthLogout` | Revoke session | none (token inferred) | `{ success }` | Optional but recommended on signOut |
| `AuthVerifyEmail` | Confirm email token | `input: { token }` | `{ status, user { id, verified } }` | `status` can be `VERIFIED`, `EXPIRED`, `ALREADY_VERIFIED` |
| `AuthResendVerification` | Resend email | `input: { email }` | `{ success, retryAfter }` | Guard for rate limiting |
| `AuthResetRequest` | Forgot password | `input: { email }` | `{ success, retryAfter }` | Use to display acknowledgement |
| `AuthResetValidate` | Validate reset token | `input: { token }` | `{ valid, reason }` | `reason` enumerates failure cause |
| `AuthResetConfirm` | Complete password reset | `input: { token, password }` | `{ success }` | On success, prompt login |
| `AuthMfaEnroll` | Request TOTP secret | none | `{ secret { base32, otpauthUrl }, recoveryCodes }` | Only accessible when authenticated |
| `AuthMfaVerify` | Confirm TOTP setup | `input: { code }` | `{ success, recoveryCodes }` | Use for both setup and verify flows |
| `AuthOtpRequest` | Request SMS/email OTP | `input: { channel }` | `{ success, retryAfter }` | `channel` = `SMS` or `EMAIL` |
| `AuthOtpVerify` | Verify OTP | `input: { code, channel }` | `{ success }` | On success, backend clears pending MFA |
| `AuthModuleRedirect` | Generate SSO hand-off | `input: { moduleSlug }` | `{ url, expiresAt }` | Use for dashboard module navigation |

## Query Catalogue

| Operation | Purpose | Variables | Response Shape | Usage |
| --- | --- | --- | --- | --- |
| `Me` | Fetch current user profile | none | `{ user { id, email, fullName, verified, mfaEnabled, modules { slug, name, status } } }` | Run in protected layout |
| `SessionStatus` | Lightweight session check | none | `{ session { expiresAt }, environment { maintenanceMode } }` | Optional ping for keep-alive banner |
| `AuthAuditTrail` | Recent login attempts | `limit` | `{ entries { timestamp, ip, device, status } }` | Use within security settings (future) |

## Common Input Validation

- Emails must be normalized to lowercase before mutation submission; log sanitized version.
- Passwords validated client-side with Zod (min length 12, complexity rules) before hitting backend.
- All mutations include `device` payload containing `userAgent`, `ip` (if provided by edge), and `fingerprint` hash to aid backend risk analysis.

## Error Code Mapping

Backend errors return structured objects: `{ error: { code, message, correlationId, retryAfter } }`. Map codes to UI treatments:

| Code | UI Message | Severity | Logging |
| --- | --- | --- | --- |
| `INVALID_CREDENTIALS` | “Email or password is incorrect.” | High | `console.error("[graphql:error] INVALID_CREDENTIALS", meta)` |
| `EMAIL_UNVERIFIED` | Prompt to verify email and offer resend. | Medium | `console.warn("[graphql:error] EMAIL_UNVERIFIED", meta)` |
| `ACCOUNT_LOCKED` | “Your account is locked. Contact support.” | Critical | `console.error("[graphql:error] ACCOUNT_LOCKED", meta)` |
| `MFA_REQUIRED` | Redirect to `/mfa/verify`. | Info | `console.info("[graphql:info] MFA_REQUIRED", meta)` |
| `RATE_LIMITED` | “Too many requests. Try again later.” | Warn | include `retryAfter` |
| `TOKEN_EXPIRED` | Display token-specific message (reset/verify). | Warn | `console.warn` |
| `SERVER_ERROR` | Generic fallback with support link. | Error | include correlation ID |

Meta payload must avoid sensitive fields (e.g., raw password) but include `operationName`, `userId` if available, and `correlationId`. Always call `logError` helper with sanitized context.

## Subscription (Optional)

`subscription SessionRevoked { sessionRevoked { reason, correlationId } }`

- Use to force logout across tabs/devices. On receipt, call `next-auth` `signOut`.
- Console: `console.warn("[graphql:subscription] sessionRevoked", { reason })`

## Apollo Link Strategy

1. **Auth Link:** Inject `Authorization` header with current `accessToken`. Log each injection at debug level.
2. **Retry Link:** On `UNAUTHENTICATED`, call `AuthRefresh`. If refresh fails, log error and trigger signOut.
3. **Error Link:** Capture GraphQL and network errors, map via table above, surface via toast, and rethrow for UI handling.
4. **Tracing Link:** Append `x-request-id` header and log it for correlation.

## Testing Checklist

- ✅ Each mutation has a positive test using mocked backend responses.
- ✅ Negative paths assert error mapping + console output.
- ✅ Integration tests cover login→MFA→dashboard happy path.
- ✅ Contract tests ensure GraphQL document signatures match backend schema (use `graphql-codegen`).

## Maintenance Notes

- Keep `graphql` documents colocated in `lib/graphql`. Run codegen after schema updates.
- Update this contract whenever backend adds/removes fields. Highlight deltas in PR description and README.
- Coordinate TTL and retry policies with backend DevOps team to avoid rate limit issues.


