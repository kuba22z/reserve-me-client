import * as React from 'react'
import { redirect } from 'next/navigation'

import { logger } from '@/lib/default-logger'
import { getClient } from '@/gql/client'
import { GetUserDocument } from '@/gql/queries/get-user.generated'
import { CognitoGroupDto } from '@/gql/__generated__/types'

import { getLoginUrl } from '@/operations/auth/get-login-url'

//export type CognitoGroupStringDto = `${CognitoGroupDto}`

export interface AuthGuardProps {
  children: React.ReactNode
  roles?: CognitoGroupDto[]
}

export async function AuthGuard({
  children,
  roles = [
    CognitoGroupDto.Admin,
    CognitoGroupDto.Client,
    CognitoGroupDto.Employee,
  ],
}: AuthGuardProps): Promise<React.JSX.Element> {
  const { data, error, errors, networkStatus } = await getClient().query({
    query: GetUserDocument,
    fetchPolicy: 'network-only',
  })
  const checkPermissions = async () => {
    if (error) {
      logger.debug('[AuthGuard]: User is not logged in, redirecting to sign in')
      redirect(await getLoginUrl())
    }

    if (
      !data.user.groups ||
      !roles.some((r) => data.user.groups?.includes(r))
    ) {
      logger.debug(
        '[AuthGuard]: User has not the required roles, redirecting to sign in'
      )
      redirect(await getLoginUrl())
    }
  }
  await checkPermissions()
  // if (error) {
  //   return <Alert color="error">{error.message}</Alert>
  // }

  return <React.Fragment>{children}</React.Fragment>
}
