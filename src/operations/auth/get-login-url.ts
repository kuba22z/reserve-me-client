'use server'

import { getClientNoAuth } from '@/gql/clientNoAuth'
import { GetLoginUrlDocument } from '@/gql/queries/get-login.generated'

export async function getLoginUrl() {
  const { data, error } = await getClientNoAuth()
    .query({
      query: GetLoginUrlDocument,
    })
    .catch((e) => {
      console.error('Server is not available')
      throw e
    })
  return data.login
}
