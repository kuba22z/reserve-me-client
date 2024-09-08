'use client'

import { ButtonGroup, Stack } from '@mui/material'
import Button from '@mui/material/Button'
import { logout } from '@/operations/logout'
import * as React from 'react'

export function LogoutButton(): React.JSX.Element {
  return (
    <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
      <ButtonGroup variant={'contained'}>
        <Button onClick={() => logout()}>Sign out</Button>
      </ButtonGroup>
    </Stack>
  )
}
