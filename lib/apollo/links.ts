import { ApolloLink, HttpLink, from } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { onError } from "@apollo/client/link/error";
import { RetryLink } from "@apollo/client/link/retry";

import { logError, logInfo, logWarn } from "@/lib/logging/console";

type CreateLinksOptions = {
  endpoint: string;
  /**
   * Async accessor that resolves the current access token. Until session
   * orchestration is complete, the stub merely returns null.
   */
  getAccessToken?: () => Promise<string | null>;
};

const createHttpLink = (endpoint: string) =>
  new HttpLink({
    uri: endpoint,
    credentials: "include",
  });

const createAuthLink = (
  options: CreateLinksOptions,
) =>
  setContext(async (_, { headers }) => {
    const token = options.getAccessToken
      ? await options.getAccessToken()
      : null;

    if (token) {
      logInfo({
        scope: "apollo:link:auth",
        event: "inject-token",
      });
    } else {
      logWarn({
        scope: "apollo:link:auth",
        event: "missing-token",
      });
    }

    return {
      headers: {
        ...headers,
        authorization: token ? `Bearer ${token}` : headers?.authorization,
      },
    };
  });

const createRetryLink = () =>
  new RetryLink({
    delay: {
      initial: 300,
      max: 2000,
      jitter: true,
    },
    attempts: {
      max: 2,
      retryIf: (error) => {
        const shouldRetry = Boolean(error);
        if (shouldRetry) {
          logWarn({
            scope: "apollo:link:retry",
            event: "retrying",
            context: { message: error.message },
          });
        }
        return shouldRetry;
      },
    },
  });

const createErrorLink = () =>
  onError(({ graphQLErrors, networkError, operation }) => {
    if (graphQLErrors?.length) {
      for (const graphQLError of graphQLErrors) {
        logError({
          scope: "apollo:link:error",
          event: "graphql",
          context: {
            operation: operation.operationName,
            message: graphQLError.message,
            path: graphQLError.path,
            extensions: graphQLError.extensions,
          },
        });
      }
    }

    if (networkError) {
      logError({
        scope: "apollo:link:error",
        event: "network",
        context: { message: networkError.message },
      });
    }
  });

const createTracingLink = () =>
  new ApolloLink((operation, forward) => {
    logInfo({
      scope: "apollo:link:trace",
      event: "forward",
      context: {
        operation: operation.operationName,
      },
    });

    return forward(operation);
  });

export const createApolloLinks = (options: CreateLinksOptions) => {
  logInfo({
    scope: "apollo:links",
    event: "create",
    context: {
      endpoint: options.endpoint,
    },
  });

  const httpLink = createHttpLink(options.endpoint);
  const authLink = createAuthLink(options);
  const retryLink = createRetryLink();
  const errorLink = createErrorLink();
  const tracingLink = createTracingLink();

  return from([tracingLink, retryLink, errorLink, authLink, httpLink]);
};


