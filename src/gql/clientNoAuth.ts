import { ApolloClient, HttpLink, InMemoryCache } from '@apollo/client'
import { GraphqlConfig } from '@/gql/graphql-config'

const getClient = () =>
  new ApolloClient({
    cache: new InMemoryCache(),
    link: new HttpLink({
      uri: GraphqlConfig.graphqlUri,
    }),
  })

export { getClient as getClientNoAuth }
