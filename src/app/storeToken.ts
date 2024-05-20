'use server'

import { cookies } from 'next/headers'

interface StoreTokenRequest {
  token: string
  refresh_token: string
  expires_in: number
}

export async function storeToken(request: StoreTokenRequest) {
  cookies().set({
    name: 'accessToken',
    value: request.token,
    httpOnly: true,
    sameSite: 'strict',
    secure: true,
    expires: request.expires_in,
  })

  cookies().set({
    name: 'refreshToken',
    value: request.refresh_token,
    httpOnly: true,
    sameSite: 'strict',
    secure: true,
  })
}
