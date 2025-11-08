import { gql } from "@apollo/client";

import { logInfo } from "@/lib/logging/console";

import { USER_CORE_FRAGMENT } from "./fragments";

export const ME_QUERY = gql`
  query Me {
    me {
      ...UserCore
    }
  }
  ${USER_CORE_FRAGMENT}
`;

export const SESSION_STATUS_QUERY = gql`
  query SessionStatus {
    sessionStatus {
      session {
        expiresAt
      }
      environment {
        maintenanceMode
      }
    }
  }
`;

export const queriesCatalog = {
  ME_QUERY,
  SESSION_STATUS_QUERY,
};

export const logQueryUsage = (operation: keyof typeof queriesCatalog) => {
  logInfo({
    scope: "graphql:queries",
    event: "invoke",
    context: { operation },
  });
};


