'use client'

import { ButtonGroup, Stack } from '@mui/material'
import Button from '@mui/material/Button'
import { logout } from '@/operations/logout'
import * as React from 'react'
import { paths } from '@/paths'
import useUserRoleAccessLevel from '@/hooks/use-user-role-access-level'
import { AccountAccessLevels } from '@/role-permissions'

export function LogoutButton(): React.JSX.Element {
  const accessLevel = useUserRoleAccessLevel() as AccountAccessLevels
  return (
    <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
      {accessLevel.showOtherUsers ? (
        <ButtonGroup variant={'contained'}>
          <Button href={paths.dashboard.users}>All Users</Button>
        </ButtonGroup>
      ) : (
        <></>
      )}
      <ButtonGroup variant={'contained'}>
        <Button onClick={() => logout()}>Sign out</Button>
      </ButtonGroup>
    </Stack>
  )
}
