import { gql } from "@apollo/client";

import { logInfo } from "@/lib/logging/console";

export const MODULE_SUMMARY_FRAGMENT = gql`
  fragment ModuleSummary on Module {
    slug
    name
    status
  }
`;

export const USER_CORE_FRAGMENT = gql`
  fragment UserCore on User {
    id
    email
    fullName
    verified
    mfaEnabled
    modules {
      ...ModuleSummary
    }
  }
  ${MODULE_SUMMARY_FRAGMENT}
`;

export const fragmentsCatalog = {
  MODULE_SUMMARY_FRAGMENT,
  USER_CORE_FRAGMENT,
};

export const logFragmentUsage = (
  fragment: keyof typeof fragmentsCatalog,
) => {
  logInfo({
    scope: "graphql:fragments",
    event: "invoke",
    context: { fragment },
  });
};


