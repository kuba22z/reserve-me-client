import * as React from 'react'
import type { Metadata } from 'next'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'

import { config } from '@/config'
import { UsersTable } from '@/components/dashboard/users/users-table'
import { UserOperations } from '@/components/dashboard/users/user-operations'
import { isMobileDevice } from '@/lib/isMobileDevice'
import { getUsersByGroup } from '@/operations/user/get-users-by-group'
import { CognitoGroupDto } from '@/gql/__generated__/types'

export const metadata = {
  title: `Users | Dashboard | ${config.site.name}`,
} satisfies Metadata

export default async function Page(): Promise<React.JSX.Element> {
  const usersByGroup = await getUsersByGroup(CognitoGroupDto.Client)

  return (
    <>
      <Stack spacing={3}>
        <Stack direction="row" spacing={3}>
          <Stack spacing={1} sx={{ flex: '1 1 auto' }}>
            <Typography variant="h4">Users</Typography>
            <UserOperations isMobile={await isMobileDevice()} />
          </Stack>
        </Stack>
        <UsersTable users={usersByGroup} />
      </Stack>
    </>
  )
}
