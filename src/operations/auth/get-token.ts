'use server'

import { TokenRequestDto } from '@/gql/__generated__/types'
import { getClientNoAuth } from '@/gql/clientNoAuth'
import { GetTokenDocument } from '@/gql/queries/get-token.generated'

export const getToken = async (tokenRequest: TokenRequestDto) => {
  const { data, error, errors, networkStatus } = await getClientNoAuth().query({
    query: GetTokenDocument,
    variables: { tokenRequest },
  })
  return data.accessToken
}
