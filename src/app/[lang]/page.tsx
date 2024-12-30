import { Box, Container, FormControl, Link } from '@mui/material'
import NextLink from 'next/link'
import React from 'react'

export default async function Home({
  searchParams,
}: {
  searchParams: { code: string | undefined }
}) {
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
        <Link href="/dashboard" color="secondary" component={NextLink}>
          Go to the dashboard
        </Link>
        <h3>Location Store</h3>
        {/*<LocationsStore></LocationsStore>*/}
        <FormControl></FormControl>
      </Box>
    </Container>
  )
}
