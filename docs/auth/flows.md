<!-- Auth module flow outlines and logging points -->

# Authentication UX Flows

This document enumerates every major user journey for the Novo Auth module, noting UI states, backend interactions, logging requirements, and error handling conventions. Each step must include explicit console statements (info/success/warn/error) to simplify debugging in lower environments.

## Conventions

- **Console Prefixes:** `[auth:flow:<name>]` followed by stage (e.g., `start`, `success`, `error`).
- **Error Surfaces:** Display normalized message to user, log raw error object with sanitized payloads.
- **Retry UX:** Provide retry CTA for transient failures (network, timeouts) and direct the user to support when backend returns blocking errors.

## 1. Signup Flow

1. **Landing:** `GET /signup`
   - Render `CredentialForm` with name/email/password fields, policy consent checkbox.
   - Console: `logInfo({ scope: "auth:flow:signup", event: "start", context: { locale } })`
2. **Client Validation:** Use Zod schema; display inline errors.
   - Console: `logTrace({ scope: "auth:flow:signup", event: "validation:success" })` or `logWarn` with issues.
3. **Mutation:** Trigger `authSignup` GraphQL mutation (email, password, metadata).
   - Wrap in try/catch; show loading state.
   - Console: `logInfo({ scope: "auth:flow:signup", event: "mutation:pending" })`
4. **Response Handling:**
   - Success → redirect to `verify-email` page.
   - Backend may include `isMfaRequired` (for staff invites) or `mustResetPassword`.
   - Console: `logInfo({ scope: "auth:flow:signup", event: "mutation:success", context: { userId, mfa: false } })`
5. **Failure Cases:**
   - Validation errors (email exists, weak password) → show inline message.
   - Unknown errors → show toast with support link.
   - Console: `logError({ scope: "auth:flow:signup", event: "mutation:error", context: { code, correlationId } })`

## 2. Email Verification Flow

1. **Status Page:** `GET /verify-email?token=...`
   - On mount, fire `authVerifyEmail` mutation with token.
   - Console: `logInfo({ scope: "auth:flow:verify-email", event: "start" })`
2. **Success:** Show confirmation and CTA to login; automatically sign in if backend issues session.
   - Console: `logInfo({ scope: "auth:flow:verify-email", event: "success", context: { userId } })`
3. **Failure:** Expired token → render resend CTA. Too many attempts → escalate.
   - Console: `logWarn({ scope: "auth:flow:verify-email", event: "token:expired" })`

## 3. Login Flow (Email/Password)

1. **Landing:** `GET /login` with optional `callbackUrl`.
   - Console: `logInfo({ scope: "auth:flow:login", event: "start", context: { callbackUrl } })`
2. **Credential Submission:** NextAuth `signIn("credentials")`.
   - Before call: `logInfo({ scope: "auth:flow:login", event: "credentials:submit" })`
3. **Backend Response:**
   - `mfaRequired` → redirect to `/mfa/verify`.
   - `emailUnverified` → prompt to resend verification.
   - Console: `logInfo({ scope: "auth:flow:login", event: "credentials:success", context: { mfaRequired } })`
4. **Failure:** Wrong password / rate limit.
   - Console: `logError({ scope: "auth:flow:login", event: "credentials:error", context: { code } })`
5. **Post-Login:** On success, server actions set cookies; redirect to dashboard.
   - Console: `logInfo({ scope: "auth:flow:login", event: "redirect", context: { destination: "/dashboard" } })`

## 4. Social Login Flow

1. **Provider CTA:** Buttons via `SocialProviders`.
   - Console: `logInfo({ scope: "auth:flow:social", event: "start", context: { provider } })`
2. **OAuth Redirect:** Use NextAuth `signIn(provider)`, skip extra logs to avoid duplicate noise.
3. **Callback:** NextAuth `signIn` callback hits GraphQL `authSocialLogin` with provider access token.
   - Console: `logInfo({ scope: "auth:flow:social", event: "callback", context: { provider } })`
4. **Result Handling:**
   - New user → kickoff onboarding (profile completion).
   - Existing user with MFA → redirect to `/mfa/verify`.
   - Console: `logInfo({ scope: "auth:flow:social", event: "success", context: { provider, mfaRequired } })`
5. **Error:** Unknown email or provider mismatch.
   - Console: `logError({ scope: "auth:flow:social", event: "error", context: { provider, code } })`

## 5. MFA Setup Flow

1. **Entry Gate:** Middleware ensures user is authenticated but `mfaEnabled=false`.
   - Console: `logInfo({ scope: "auth:flow:mfa-setup", event: "start" })`
2. **Enroll Secret:** Call `authMfaEnroll` to fetch shared secret + otpauth URL.
   - Console: `logInfo({ scope: "auth:flow:mfa-setup", event: "enroll:success", context: { otpType: "totp" } })`
3. **Display:** Show QR code + manual entry instructions alongside recovery codes preview.
4. **Verification:** Submit first TOTP via `authMfaVerify`.
   - Success: display recovery codes from response.
   - Console: `logInfo({ scope: "auth:flow:mfa-setup", event: "verify:success" })`
5. **Failure:** Wrong code, rate limit.
   - Console: `logWarn({ scope: "auth:flow:mfa-setup", event: "verify:invalid", context: { attempts } })`

## 6. MFA Verification Flow

1. **Trigger:** Redirected from login/NextAuth callback with `mfaRequired=true`.
   - Console: `logInfo({ scope: "auth:flow:mfa-verify", event: "start", context: { methodsAvailable } })`
2. **Primary:** TOTP input with auto-advance.
   - Submit `authMfaChallenge` mutation.
   - Console: `logInfo({ scope: "auth:flow:mfa-verify", event: "totp:submit" })`
3. **Fallback:** Button to request SMS/email OTP via `authOtpRequest`.
   - Console: `logInfo({ scope: "auth:flow:mfa-verify", event: "otp:request", context: { channel } })`
4. **Validation:** `authOtpVerify`.
   - Success: redirect to dashboard.
   - Console: `logInfo({ scope: "auth:flow:mfa-verify", event: "success" })`
5. **Errors:** Expired OTP, too many attempts, locked account.
   - Console: `logError({ scope: "auth:flow:mfa-verify", event: "error", context: { code } })`

## 7. Password Reset Flow

1. **Forgot Password:** `GET /login?tab=forgot` or dedicated route.
   - Submit email to `authResetRequest`.
   - Console: `logInfo({ scope: "auth:flow:reset", event: "request", context: { obfuscatedEmail } })`
2. **Email Link:** `GET /reset-password?token=...`
   - Validate token via `authResetValidate`.
   - Console: `logInfo({ scope: "auth:flow:reset", event: "token:valid" })`
3. **Set New Password:** Form posts to `authResetConfirm`.
   - On success: redirect to login with success toast.
   - Console: `logInfo({ scope: "auth:flow:reset", event: "confirm:success" })`
4. **Failures:** Expired token, weak password, conflict.
   - Console: `logError({ scope: "auth:flow:reset", event: "error", context: { code } })`

## 8. Session Dashboard Flow

1. **Protected Route:** `/dashboard` served within `(protected)` layout.
   - On load, fetch `me` query to get modules + permissions.
   - Console: `logInfo({ scope: "auth:flow:dashboard", event: "start" })`
2. **Module Selection:** Cards linking to other subdomains (e.g., `billing.novologic.co`).
   - Use `next/link` with `prefetch`.
   - Console: `logInfo({ scope: "auth:flow:dashboard", event: "module:selected", context: { module } })`
3. **SSO Hand-off:** Clicking module may need signed redirect URL from backend (`authModuleRedirect`).
   - Console: `logInfo({ scope: "auth:flow:dashboard", event: "redirect:issue", context: { target } })`
4. **Errors:** Missing modules, permission mismatches.
   - Console: `logWarn({ scope: "auth:flow:dashboard", event: "permissions:insufficient", context: { module } })`

## 9. Logout Flow

1. **Action:** Button triggers NextAuth `signOut({ redirectTo: "/login" })`.
   - Console: `logInfo({ scope: "auth:flow:logout", event: "start" })`
2. **Backend Call:** Optional `authLogout` mutation to invalidate refresh tokens.
   - Console: `logInfo({ scope: "auth:flow:logout", event: "backend:success" })`
3. **Complete:** Redirect to login, flush caches, clear local storage.
   - Console: `logInfo({ scope: "auth:flow:logout", event: "complete" })`

## Error Handling Summary

- Always pair user-facing errors with `logError` entries including `correlationId`.
- Network failures trigger `logWarn` and display retry option.
- For security-sensitive failures (e.g., brute force detection), log `console.error` with reason but do not expose details to user.

## Future Enhancements

- Capture structured logs via optional APM integration.
- Add instrumentation for time-to-auth metrics and conversion tracking.
- Expand to hardware key (WebAuthn) MFA in subsequent iterations.


