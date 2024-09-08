import * as React from 'react'
import type { Metadata } from 'next'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'

import { config } from '@/config'
import { getClient } from '@/gql/client'
import { GetUsersByGroupDocument } from '@/gql/queries/get-users-by-group.generated'
import { CognitoGroupDto } from '@/gql/__generated__/types'
import { UsersTable } from '@/components/dashboard/users/users-table'
import { UserOperations } from '@/components/dashboard/users/user-operations'
import { isMobileDevice } from '@/lib/isMobileDevice'

export const metadata = {
  title: `Users | Dashboard | ${config.site.name}`,
} satisfies Metadata

export default async function Page(): Promise<React.JSX.Element> {
  const { data, error } = await getClient().query({
    query: GetUsersByGroupDocument,
    variables: { group: CognitoGroupDto.Client },
  })

  return (
    <>
      <Stack spacing={3}>
        <Stack direction="row" spacing={3}>
          <Stack spacing={1} sx={{ flex: '1 1 auto' }}>
            <Typography variant="h4">Users</Typography>
            <UserOperations isMobile={isMobileDevice()} />
          </Stack>
        </Stack>
        <UsersTable users={data.usersByGroup} />
      </Stack>
    </>
  )
}
