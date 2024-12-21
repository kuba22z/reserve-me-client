import * as React from 'react'
import { redirect } from 'next/navigation'

import { logger } from '@/lib/default-logger'
import { CognitoGroupDto } from '@/gql/__generated__/types'

import { getLoginUrl } from '@/operations/auth/get-login-url'
import { getUser } from '@/operations/user/get-user'

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
  const user = await getUser()
  const checkPermissions = async () => {
    if (!user.groups || !roles.some((r) => user.groups?.includes(r))) {
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
