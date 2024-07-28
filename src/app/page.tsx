import { getClient } from '@/gql/client'
import { GetUserDocument } from '@/gql/queries/get-user.generated'
import { GetUsersByGroupDocument } from '@/gql/queries/get-users-by-group.generated'
import { CognitoGroupDto, LocationDto } from '@/gql/__generated__/types'
import { GetUsersDocument } from '@/gql/queries/get-users.generated'
import { SignOutDocument } from '@/gql/queries/sign-out.generated'
import { cookies } from 'next/headers'
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
import { CookieToken } from '@/app/utils/auth/cookie-token'
import NextLink from 'next/link'
import MyButton from '@/components/MyButton'
import { GetLocationDocument } from '@/gql/queries/get-location.generated'
import React from 'react'
import { addLocation } from '@/operations/addLocation'
import { Locations } from '@/components/Locations'
import { LocationsVar } from '@/components/LocationsVar'
import MyButtonStore from '@/components/MyButtonStore'
import { LocationsStore } from '@/components/LocationsStore'

function MissingAuthorizationCodeFallback() {
  return <>Fail</>
}
const logout = async () => {
  'use server'
  const { data, error, errors, networkStatus } = await getClient().query({
    query: SignOutDocument,
  })
  cookies().delete('accessToken')
  cookies().delete('refreshToken')
  return data.logout
}

const getAllClients = async (token: string) =>
  await fetch('http://localhost:3000/client', {
    method: 'GET',
    headers: {
      'Content-type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      Authorization: 'Bearer ' + token,
    },
  })
    .then((response) => response.json())
    .then((data) => {
      return data
    })
    .catch((error) => {
      throw new Error('Failed to fetch data')
    })

const getUser = async () => {
  const { data, error, errors, networkStatus } = await getClient().query({
    query: GetUserDocument,
  })
  return data.user
}

const getUserByGroup = async (token: string) => {
  const { data, error, errors, networkStatus } = await getClient().query({
    query: GetUsersByGroupDocument,
    context: { headers: { authorization: 'Bearer ' + token } },
    variables: { group: CognitoGroupDto.Admin },
  })
  return data.usersByGroup
}

const getUsers = async (token: string) => {
  const { data, error, errors, networkStatus } = await getClient().query({
    query: GetUsersDocument,
    context: { headers: { authorization: 'Bearer ' + token } },
  })
  return data.users
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
  const user = await getUser().catch((a) => console.log(a))
  const locations = await getLocations().catch((a) => console.log(a))
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
        <div>{user ? user.userName : ''}</div>
        <Locations locations={locations}></Locations>
        <h3>Location Var</h3>
        <LocationsVar></LocationsVar>
        <h3>Location Store</h3>
        <LocationsStore></LocationsStore>
        <div>Access token: {CookieToken.get('accessToken')}</div>{' '}
        <FormControl>
          {/*<MyButton onClick={logout}>logout</MyButton>*/}
          <MyButton onClick={createLocation}>create Location</MyButton>
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
