import { CognitoGroupDto, TokenDto } from '@/gql/__generated__/types'
import { cookies } from 'next/headers'
import type { NextResponse } from 'next/server'
import { ResponseCookie } from 'next/dist/compiled/@edge-runtime/cookies'

type CookieTokenKey = 'accessToken' | 'refreshToken' | 'idToken'
const TokenRoleKey = 'tokenRole'

export namespace CookieToken {
  const ThirtyDaysInSec = 2592000

  export const setTokenDto = async (credentials: TokenDto) => {
    // default expires in = 60 minutes
    await set('accessToken', credentials.accessToken, credentials.expiresIn)
    if (credentials.refreshToken) {
      await set('refreshToken', credentials.refreshToken, ThirtyDaysInSec)
    }
    await set('idToken', credentials.idToken, credentials.expiresIn)
    await setTokenRole(credentials.groups)
  }

  export const get = (key: CookieTokenKey) => {
    return cookies().then((a) => a.get(key)?.value)
  }

  export const getTokenRole = async () => {
    return stringToCognitoGroupDto(
      await cookies().then((cookies) => cookies.get(TokenRoleKey)?.value)
    )
  }

  export const remove = (key: CookieTokenKey) => {
    return cookies().then((cookies) => cookies.delete(key))
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
    response.cookies.set(
      cookieConfig(
        TokenRoleKey,
        cognitoGroupDtoToString(credentials.groups),
        ThirtyDaysInSec
      )
    )
  }

  const cognitoGroupDtoToString = (groups: ReadonlyArray<CognitoGroupDto>) => {
    return groups.map((a) => a.toString()).join(',')
  }

  const stringToCognitoGroupDto = (
    tokenRole?: string
  ): ReadonlyArray<CognitoGroupDto> => {
    return tokenRole
      ? tokenRole.split(',').map((role) => {
          switch (role) {
            case CognitoGroupDto.Admin:
              return CognitoGroupDto.Admin
            case CognitoGroupDto.Employee:
              return CognitoGroupDto.Employee
            case CognitoGroupDto.Client:
              return CognitoGroupDto.Client
            default:
              throw Error
          }
        })
      : []
  }

  const cognitoGroupDtoTo = (groups: ReadonlyArray<CognitoGroupDto>) => {
    return groups.map((a) => a.toString()).join(',')
  }

  const set = async (
    key: CookieTokenKey,
    value: string,
    maxAgeInSec: number
  ) => {
    await cookies().then((cookies) =>
      cookies.set(cookieConfig(key, value, maxAgeInSec))
    )
  }
  const setTokenRole = async (groups: ReadonlyArray<CognitoGroupDto>) => {
    await cookies().then((cookies) =>
      cookies.set(TokenRoleKey, cognitoGroupDtoToString(groups))
    )
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
    key: CookieTokenKey | typeof TokenRoleKey,
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
      //domain: '.localhost',
    }
  }
}
