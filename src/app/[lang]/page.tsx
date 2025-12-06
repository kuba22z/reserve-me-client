'use server'
import { Box, Container, FormControl } from '@mui/material'
import React from 'react'
import DashboardLink from '@/app/[lang]/dashboard-link'

export default async function Home() {
  return (
    <Container maxWidth="lg">
      <Box
        sx={{
          my: 4,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <DashboardLink></DashboardLink>
        <h3>Location Store</h3>
        {/*<LocationsStore></LocationsStore>*/}
        <FormControl></FormControl>
      </Box>
    </Container>
  )
}
