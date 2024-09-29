import { getClient } from '@/gql/client'
import { GetUserDocument } from '@/gql/queries/get-user.generated'
import { LocationDto } from '@/gql/__generated__/types'
import RestoreIcon from '@mui/icons-material/Restore'
import FavoriteIcon from '@mui/icons-material/Favorite'
import LocationOnIcon from '@mui/icons-material/LocationOn'
import {
  BottomNavigation,
  BottomNavigationAction,
  Box,
  Container,
  FormControl,
  Link,
  Typography,
} from '@mui/material'
import NextLink from 'next/link'
import { GetLocationDocument } from '@/gql/queries/get-location.generated'
import React from 'react'
import { addLocation } from '@/operations/addLocation'
import { LocationsVar } from '@/components/LocationsVar'
import MyButtonStore from '@/components/MyButtonStore'
import { LocationsStore } from '@/components/LocationsStore'

function MissingAuthorizationCodeFallback() {
  return <>Fail</>
}

const getUser = async () => {
  const { data, error, errors, networkStatus } = await getClient().query({
    query: GetUserDocument,
  })
  return data.user
}

const createLocation = async () => {
  'use server'
  const { data } = await addLocation()
  return data
}

const getLocations = async (): Promise<ReadonlyArray<Partial<LocationDto>>> => {
  const { data, error, errors, networkStatus } = await getClient().query({
    query: GetLocationDocument,
  })
  return data.locations
}

export default async function Home({
  searchParams,
}: {
  searchParams: { code: string | undefined }
}) {
  //const user = await getUser().catch((a) => console.log(a))
  // const locations = await getLocations().catch((a) => console.log(a))
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
        <Typography variant="h4" component="h1" sx={{ mb: 2 }}>
          Material UI - Next.js App Router example in TypeScript
        </Typography>
        <Link href="/about" color="secondary" component={NextLink}>
          Go to the about page
        </Link>
        {/*<div>{user ? user.userName : ''}</div>*/}
        {/*<Locations locations={locations}></Locations>*/}
        <h3>Location Var</h3>
        <LocationsVar></LocationsVar>
        <h3>Location Store</h3>
        <LocationsStore></LocationsStore>
        <FormControl>
          {/*<MyButton onClick={logout}>logout</MyButton>*/}
          {/*<MyButton onClick={createLocation}>create Location</MyButton>*/}
          {/*<MyButtonClient>create Location</MyButtonClient>*/}
          <MyButtonStore>create Location 2</MyButtonStore>
        </FormControl>
      </Box>
      <BottomNavigation showLabels>
        <BottomNavigationAction label="Recents" icon={<RestoreIcon />} />
        <BottomNavigationAction label="Favorites" icon={<FavoriteIcon />} />
        <BottomNavigationAction label="Nearby" icon={<LocationOnIcon />} />
      </BottomNavigation>
    </Container>
  )
}
