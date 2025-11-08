import {
  ApolloClient,
  InMemoryCache,
  type NormalizedCacheObject,
} from "@apollo/client";

import { logError, logInfo } from "@/lib/logging/console";

import { createApolloLinks } from "./links";

type CreateApolloClientOptions = {
  /**
   * Optional async function that returns the latest access token. Provide this
   * when constructing clients that operate on behalf of logged-in users.
   */
  getAccessToken?: () => Promise<string | null>;
  /**
   * Override the GraphQL endpoint. Defaults to the `GRAPHQL_ENDPOINT`
   * environment variable.
   */
  endpoint?: string;
};

const resolveEndpoint = (override?: string) => {
  const computed = override ?? process.env.GRAPHQL_ENDPOINT;

  if (!computed) {
    logError({
      scope: "apollo:client",
      event: "missing-endpoint",
    });
    throw new Error("GRAPHQL_ENDPOINT is not defined.");
  }

  return computed;
};

export const createApolloClient = (
  options: CreateApolloClientOptions = {},
): ApolloClient<NormalizedCacheObject> => {
  const endpoint = resolveEndpoint(options.endpoint);

  logInfo({
    scope: "apollo:client",
    event: "create",
    context: { endpoint },
  });

  return new ApolloClient({
    link: createApolloLinks({
      endpoint,
      getAccessToken: options.getAccessToken,
    }),
    cache: new InMemoryCache(),
    defaultOptions: {
      watchQuery: {
        fetchPolicy: "cache-and-network",
      },
      query: {
        fetchPolicy: "network-only",
      },
    },
  });
};


