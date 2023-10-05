/* eslint-disable no-console */
import { ApolloClient, createHttpLink, InMemoryCache } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import cookie from "js-cookie";

const getClient = (token?: string) => {
  let tkn = token;

  const baseUrl = typeof window !== "undefined" ? "" : `http://localhost:3000`;
  const httpLink = createHttpLink({
    uri: `${baseUrl}/api/graphql`,
  });

  const authLink = setContext((t, { headers }) => {
    if (typeof window !== "undefined") {
        tkn = cookie.get("token") || "";
    }
    
    const header = {
      ...headers,
      authorization: tkn ? `Bearer ${tkn}` : "",
    };
    return {
      headers: {
        ...header,
      },
    };
  });

  const cache = new InMemoryCache();

  const client = new ApolloClient({
    link: authLink.concat(httpLink),
    cache,
  });

  return client;
};

export default getClient;
