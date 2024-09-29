'use server'
import { getClient } from '@/gql/client'
import { SignOutDocument } from '@/gql/queries/sign-out.generated'
import { CookieToken } from '@/app/utils/auth/cookie-token'
import { redirect } from 'next/navigation'

export const logout = async () => {
  const { data, error, errors, networkStatus } = await getClient().query({
    query: SignOutDocument,
  })
  if (error) {
    console.error('Sign out error', error)
    return
  }

  CookieToken.remove('accessToken')
  CookieToken.remove('refreshToken')
  //refresh page -> shows login page
  redirect('/dashboard')
}
