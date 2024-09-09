import * as React from 'react'
import type { Metadata } from 'next'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import Grid from '@mui/material/Unstable_Grid2'

import { config } from '@/config'
import { AccountInfo } from '@/components/dashboard/account/account-info'
import { BottomNav } from '@/components/dashboard/layout/bottom-nav'
import Mobile from '@/components/common/Mobile'
import { LogoutButton } from '@/components/dashboard/account/LogoutButton'

export const metadata = {
  title: `Account | Dashboard | ${config.site.name}`,
} satisfies Metadata

export default function Page(): React.JSX.Element {
  return (
    <>
      <Stack direction={'column'} spacing={3}>
        <div>
          <Typography variant="h4">Account</Typography>
        </div>
        <Grid container spacing={3}>
          <Grid lg={4} md={6} xs={12}>
            <AccountInfo />
          </Grid>
          {/*<Grid lg={8} md={6} xs={12}>*/}
          {/*  <AccountDetailsForm />*/}
          {/*</Grid>*/}
        </Grid>
        <LogoutButton />
      </Stack>

      <Mobile>
        <BottomNav></BottomNav>
      </Mobile>
    </>
  )
}
