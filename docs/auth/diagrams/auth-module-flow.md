<!-- Mermaid diagrams describing Novo Auth flows -->

# Auth Module Flowcharts

```mermaid
flowchart TD
  A[Start: User visits /login] --> B{Has active session?}
  B -- Yes --> Z[Redirect to /dashboard]
  B -- No --> C[Display credential + social options]
  C --> D{Login method}
  D -- Email/Password --> E[submit AuthLogin mutation]
  D -- Social --> F[OAuth provider redirect]
  E --> G{Response}
  G -- MFA Required --> H[Redirect to /mfa/verify]
  G -- Email Unverified --> I[Redirect to /verify-email]
  G -- Success --> Z
  F --> J[NextAuth callback]
  J --> K[AuthSocialLogin mutation]
  K --> G
  H --> L[User provides TOTP]
  L --> M{AuthMfaChallenge result}
  M -- Success --> Z
  M -- Failure --> N[Offer OTP fallback]
  N --> O[AuthOtpRequest + AuthOtpVerify]
  O --> M
```

```mermaid
sequenceDiagram
  participant U as User
  participant FE as Next.js Frontend
  participant NA as NextAuth
  participant API as GraphQL API

  U->>FE: Submit signup form
  FE->>FE: Validate input (Zod)
  FE->>API: AuthSignup mutation
  API-->>FE: {requiresVerification: true}
  FE->>NA: signIn(credentials, redirect=false)
  NA->>API: AuthLogin (post-signup)
  API-->>NA: {mfaRequired: false, verified:false}
  NA-->>FE: Session token bundle
  FE->>U: Redirect to verify-email screen
  API-)U: Send verification email
```

```mermaid
flowchart LR
  R[Reset Password Link Click] --> S[Validate token via AuthResetValidate]
  S -->|Valid| T[Render new password form]
  S -->|Invalid| U[Show expired token message]
  T --> V[Submit AuthResetConfirm]
  V -->|Success| W[Show success + redirect to login]
  V -->|Error| X[Display error + console.error]
```

```mermaid
flowchart TD
  AA[Authenticated user hits /dashboard] --> BB[Fetch Me query]
  BB --> CC{Modules available?}
  CC -- No --> DD[Show request access state]
  CC -- Yes --> EE[Render module cards]
  EE --> FF{User selects module}
  FF --> GG[Call AuthModuleRedirect]
  GG --> HH{URL issued?}
  HH -- Yes --> II[Redirect to target subdomain]
  HH -- No --> JJ[Show error + instructions]
```

All diagrams must stay aligned with the textual flow descriptions in `docs/auth/flows.md`. Update both files together when business logic changes.


