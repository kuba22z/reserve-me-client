'use server'
import { UserWithGroupDto } from '@/gql/__generated__/types'
import { getClient } from '@/gql/client'
import { GetUserDocument } from '@/gql/queries/get-user.generated'
import assert from 'assert'
import { logger } from '@/lib/default-logger'
import { redirect } from 'next/navigation'
import { getLoginUrl } from '@/operations/auth/get-login-url'

export const getUser = async (): Promise<UserWithGroupDto> => {
  const { data, error, errors, networkStatus } = await getClient().query({
    query: GetUserDocument,
    fetchPolicy: 'network-only',
  })
  if (error) {
    logger.debug('[AuthGuard]: User is not logged in, redirecting to sign in')
    redirect(await getLoginUrl())
  }

  assert(data.user)
  return data.user
}
