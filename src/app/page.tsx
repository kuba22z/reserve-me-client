import { Suspense } from 'react'
import { getClient } from '@/gql/client'
import { GetUserDocument } from '@/gql/queries/get-user.generated'
import { GetUsersByGroupDocument } from '@/gql/queries/get-users-by-group.generated'
import { CognitoGroupDto } from '@/gql/__generated__/types'
import { GetUsersDocument } from '@/gql/queries/get-users.generated'
import { SignOutDocument } from '@/gql/queries/sign-out.generated'
import { cookies } from 'next/headers'
import { CookieToken } from '@/app/utils/auth/cookie-token'

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
  console.log(data.usersByGroup)
  return data.usersByGroup
}

const getUsers = async (token: string) => {
  const { data, error, errors, networkStatus } = await getClient().query({
    query: GetUsersDocument,
    context: { headers: { authorization: 'Bearer ' + token } },
  })
  console.log(networkStatus)
  return data.users
}

export default async function Home({
  searchParams,
}: {
  searchParams: { code: string | undefined }
}) {
  const user = await getUser().catch((a) => console.log(a))

  return (
    <Suspense fallback={<MissingAuthorizationCodeFallback />}>
      <div>{user ? user.userName : ''}</div>
      <div>Access token: {CookieToken.get('accessToken')}</div>

      <form action={logout}>
        <button type={'submit'}>logout</button>
      </form>
    </Suspense>
  )
}
