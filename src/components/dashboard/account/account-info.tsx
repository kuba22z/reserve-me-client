'use client'

import * as React from 'react'
import Avatar from '@mui/material/Avatar'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import { useUserContext } from '@/components/core/UserProvider'

export function AccountInfo(): React.JSX.Element {
  const user = useUserContext()

  return (
    <Card>
      <CardContent>
        <Stack spacing={2} sx={{ alignItems: 'center' }}>
          <div>
            <Avatar sx={{ height: '80px', width: '80px' }} />
          </div>
          <Stack spacing={1} sx={{ textAlign: 'center' }}>
            <Typography variant="h5">{user.name}</Typography>
            <Typography color="text.secondary" variant="body2">
              {user.userName}
            </Typography>
            <Typography color="text.secondary" variant="body2">
              {user.phoneNumber}
            </Typography>
          </Stack>
        </Stack>
      </CardContent>
      {/*<Divider />*/}
      {/*<CardActions>*/}
      {/*  <Button fullWidth variant="text">*/}
      {/*    Upload picture*/}
      {/*  </Button>*/}
      {/*</CardActions>*/}
    </Card>
  )
}
