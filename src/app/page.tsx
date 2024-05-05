import styles from './page.module.css'
import { Suspense } from 'react'
import { getClient } from '@/gql/client'
import {
  GetTokenDocument,
  GetTokenQuery,
} from '@/gql/queries/get-token.generated'
import { GetUserDocument } from '@/gql/queries/get-user.generated'
import { GetUsersByGroupDocument } from '@/gql/queries/get-users-by-group.generated'
import { CognitoGroups } from '@/gql/__generated__/types'
import { GetUsersDocument } from '@/gql/queries/get-users.generated'
import { SignOutDocument } from '@/gql/queries/sign-out.generated'
import { redirect } from 'next/navigation'

function MissingAuthorizationCodeFallback() {
  return <>Fail</>
}

type TokenResponse = {
  access_token: string
  refresh_token: string
  expires_in: number
  token_type: string
}

const getTokenGraphql = async (authorizationCode: string) => {
  const { data, error, errors, networkStatus } = await getClient().query({
    query: GetTokenDocument,
    variables: { code: authorizationCode },
  })
  return data
}
const getToken = async (authorizationCode: string): Promise<TokenResponse> =>
  await fetch('http://localhost:3000/auth', {
    method: 'POST',
    headers: {
      'Content-type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    },
    body: JSON.stringify({ code: authorizationCode }),
  })
    .then((response) => response.json())
    .then((data) => {
      return data
    })
    .catch((error) => {
      console.error(error)
      throw new Error('Failed to fetch data')
    })

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

const getUser = async (token: string) => {
  const { data, error, errors, networkStatus } = await getClient().query({
    query: GetUserDocument,
    context: { headers: { authorization: 'Bearer ' + token } },
  })
  return data.user
}

const getUserByGroup = async (token: string) => {
  const { data, error, errors, networkStatus } = await getClient().query({
    query: GetUsersByGroupDocument,
    context: { headers: { authorization: 'Bearer ' + token } },
    variables: { group: CognitoGroups.Admin },
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

const signOut = async () => {
  redirect('login')
}

const signOut2 = async (idToken: string) => {
  const { data, error, errors, networkStatus } = await getClient().query({
    query: SignOutDocument,
    context: { headers: { authorization: 'Bearer ' + idToken } },
  })
  console.log(data)
}

export default async function Home({
  searchParams,
}: {
  searchParams: { code: string | undefined }
}) {
  const data = searchParams.code
    ? await getTokenGraphql(searchParams.code)
    : undefined
  const d = async (data: GetTokenQuery | undefined) => {
    if (data) {
      const client = await getUser(data.accessToken.accessToken)
      await signOut()
    }
  }
  await d(data)

  return (
    <Suspense fallback={<MissingAuthorizationCodeFallback />}>
      <main className={styles.main}>It works</main>
    </Suspense>
  )
}
