import {
  ApolloClient,
  ApolloLink,
  concat,
  HttpLink,
  InMemoryCache,
} from '@apollo/client'
import { registerApolloClient } from '@apollo/experimental-nextjs-app-support/rsc'
import { GraphqlConfig } from '@/gql/graphql-config'
import { CookieToken } from '@/app/utils/auth/cookie-token'

const authMiddleware = new ApolloLink((operation, forward) => {
  const accessToken = CookieToken.get('accessToken')

  if (!accessToken) {
    console.error('access token in auth Middleware is null')
  }
  // add the authorization to the headers
  operation.setContext(({ headers = {} }) => {
    return {
      headers: {
        ...headers,
        Authorization: `Bearer ${accessToken}`,
      },
    }
  })
  return forward(operation)
})

// https://medium.com/@cloudapp_dev/nextjs-13-5-6-complete-example-typescript-app-router-contentful-and-a-lot-more-0b43c12cac9f
// alternatives for apollo client
// https://nouance.io/articles/how-to-use-graphql-codegen-with-payload-and-react-query-in-nextjs
// https://plainenglish.io/community/next-js-app-router-graphql-codegen-and-tanstack-query
export const { getClient } = registerApolloClient(() => {
  return new ApolloClient({
    cache: new InMemoryCache(),
    link: concat(
      authMiddleware,
      new HttpLink({
        uri: GraphqlConfig.graphqlUri,
      })
    ),
  })
})
