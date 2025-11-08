import { gql } from "@apollo/client";

import { logInfo } from "@/lib/logging/console";

import { USER_CORE_FRAGMENT } from "./fragments";

/**
 * Placeholder GraphQL mutations. Replace the field selections with the actual
 * schema once the backend contract is finalized.
 */
export const AUTH_LOGIN_MUTATION = gql`
  mutation AuthLogin($input: AuthLoginInput!) {
    authLogin(input: $input) {
      session {
        accessToken
        refreshToken
        expiresAt
      }
      mfa {
        required
        methods
      }
      user {
        ...UserCore
      }
    }
  }
  ${USER_CORE_FRAGMENT}
`;

export const AUTH_SIGNUP_MUTATION = gql`
  mutation AuthSignup($input: AuthSignupInput!) {
    authSignup(input: $input) {
      requiresVerification
      user {
        id
        email
        status
      }
    }
  }
`;

export const AUTH_VERIFY_EMAIL_MUTATION = gql`
  mutation AuthVerifyEmail($input: AuthVerifyEmailInput!) {
    authVerifyEmail(input: $input) {
      status
      user {
        id
        verified
      }
    }
  }
`;

export const AUTH_MFA_ENROLL_MUTATION = gql`
  mutation AuthMfaEnroll {
    authMfaEnroll {
      secret {
        base32
        otpauthUrl
      }
      recoveryCodes
    }
  }
`;

export const AUTH_MFA_VERIFY_MUTATION = gql`
  mutation AuthMfaVerify($input: AuthMfaVerifyInput!) {
    authMfaVerify(input: $input) {
      success
      recoveryCodes
    }
  }
`;

export const AUTH_MODULE_REDIRECT_MUTATION = gql`
  mutation AuthModuleRedirect($input: AuthModuleRedirectInput!) {
    authModuleRedirect(input: $input) {
      url
      expiresAt
    }
  }
`;

export const mutationsCatalog = {
  AUTH_LOGIN_MUTATION,
  AUTH_SIGNUP_MUTATION,
  AUTH_VERIFY_EMAIL_MUTATION,
  AUTH_MFA_ENROLL_MUTATION,
  AUTH_MFA_VERIFY_MUTATION,
  AUTH_MODULE_REDIRECT_MUTATION,
};

export const logMutationUsage = (operation: keyof typeof mutationsCatalog) => {
  logInfo({
    scope: "graphql:mutations",
    event: "invoke",
    context: { operation },
  });
};


