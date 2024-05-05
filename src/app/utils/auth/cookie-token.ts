import { TokenDto } from '@/gql/__generated__/types'
import { cookies } from 'next/headers'
import type { NextResponse } from 'next/server'
import { ResponseCookie } from 'next/dist/compiled/@edge-runtime/cookies'

type CookieTokenKey = 'accessToken' | 'refreshToken' | 'idToken'

export namespace CookieToken {
  const ThirtyDaysInSec = 2592000

  export const setTokenDto = (credentials: TokenDto) => {
    // default expires in = 60 minutes
    set('accessToken', credentials.accessToken, credentials.expiresIn)
    if (credentials.refreshToken) {
      set('refreshToken', credentials.refreshToken, ThirtyDaysInSec)
    }
    set('idToken', credentials.idToken, credentials.expiresIn)
  }

  export const get = (key: CookieTokenKey) => {
    return cookies().get(key)?.value
  }

  export const setTokenDtoInResponse = (
    response: NextResponse,
    credentials: TokenDto
  ) => {
    setInResponse(
      response,
      'idToken',
      credentials.idToken,
      credentials.expiresIn
    )
    if (credentials.refreshToken) {
      setInResponse(
        response,
        'refreshToken',
        credentials.refreshToken,
        ThirtyDaysInSec
      )
    }
    setInResponse(
      response,
      'accessToken',
      credentials.accessToken,
      credentials.expiresIn
    )
  }

  const set = (key: CookieTokenKey, value: string, maxAgeInSec: number) => {
    cookies().set(cookieConfig(key, value, maxAgeInSec))
  }

  const setInResponse = (
    response: NextResponse,
    key: CookieTokenKey,
    value: string,
    maxAgeInSec: number
  ) => {
    response.cookies.set(cookieConfig(key, value, maxAgeInSec))
  }

  const cookieConfig = (
    key: CookieTokenKey,
    value: string,
    maxAgeInSec: number
  ): ResponseCookie => {
    return {
      name: key,
      value: value,
      maxAge: maxAgeInSec,
      httpOnly: true,
      // sameSite: 'strict',
      secure: true,
      path: '/',
      domain: '.localhost',
    }
  }
}
