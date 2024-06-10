import * as React from 'react'
import type { Metadata } from 'next'
import Button from '@mui/material/Button'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import { Download as DownloadIcon } from '@phosphor-icons/react/dist/ssr/Download'
import { Plus as PlusIcon } from '@phosphor-icons/react/dist/ssr/Plus'
import { Upload as UploadIcon } from '@phosphor-icons/react/dist/ssr/Upload'

import { config } from '@/config'
import { getClient } from '@/gql/client'
import { GetUsersByGroupDocument } from '@/gql/queries/get-users-by-group.generated'
import { CognitoGroupDto, UserDto } from '@/gql/__generated__/types'
import { UsersFilters } from '@/components/dashboard/users/users-filters'
import { UsersTable } from '@/components/dashboard/users/users-table'

export const metadata = {
  title: `Users | Dashboard | ${config.site.name}`,
} satisfies Metadata

export default async function Page(): Promise<React.JSX.Element> {
  const page = 0
  const rowsPerPage = 5
  const { data, error } = await getClient().query({
    query: GetUsersByGroupDocument,
    variables: { group: CognitoGroupDto.Admin },
  })

  const paginatedUsers = applyPagination(data.usersByGroup, page, rowsPerPage)

  return (
    <Stack spacing={3}>
      <Stack direction="row" spacing={3}>
        <Stack spacing={1} sx={{ flex: '1 1 auto' }}>
          <Typography variant="h4">Users</Typography>
          <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
            <Button
              color="inherit"
              startIcon={<UploadIcon fontSize="var(--icon-fontSize-md)" />}
            >
              Import
            </Button>
            <Button
              color="inherit"
              startIcon={<DownloadIcon fontSize="var(--icon-fontSize-md)" />}
            >
              Export
            </Button>
          </Stack>
        </Stack>
        <div>
          <Button
            startIcon={<PlusIcon fontSize="var(--icon-fontSize-md)" />}
            variant="contained"
          >
            Add
          </Button>
        </div>
      </Stack>
      <UsersFilters />
      <UsersTable
        count={paginatedUsers.length}
        page={page}
        rows={paginatedUsers}
        rowsPerPage={rowsPerPage}
      />
    </Stack>
  )
}

function applyPagination(
  rows: ReadonlyArray<UserDto>,
  page: number,
  rowsPerPage: number
): UserDto[] {
  return rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
}
