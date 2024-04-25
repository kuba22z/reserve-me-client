import {ApolloClient, ApolloLink, concat, HttpLink, InMemoryCache} from "@apollo/client";
import { registerApolloClient } from "@apollo/experimental-nextjs-app-support/rsc";
import {GraphqlConfig} from "@/gql/graphql-config";


const authMiddleware = new ApolloLink((operation, forward) => {
    // add the authorization to the headers
    operation.setContext(({ headers = {} }) =>
    {
      return   {
        headers: {
            ...headers,
        }
    }});
    return forward(operation);
})

export const { getClient } = registerApolloClient(() => {
    return new ApolloClient({
        cache: new InMemoryCache(),
        link: concat(authMiddleware,new HttpLink({
            uri: GraphqlConfig.graphqlUri,
        })),
    });
});