import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { CookieToken } from '@/app/utils/auth/cookie-token'
import { GrantTypeDto, TokenDto } from './gql/__generated__/types'
import { RolePermissions } from '@/role-permissions'
import { getToken } from '@/operations/auth/get-token'
import { getLoginUrl } from '@/operations/auth/get-login-url'

const PUBLIC_FILE = /\.(.*)$/

// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  if (
    pathname.startsWith('/_next') || // exclude Next.js internals
    pathname.startsWith('/api') || //  exclude all API routes
    pathname.startsWith('/static') || // exclude static files
    PUBLIC_FILE.test(pathname) // exclude all files in the public folder
  ) {
    return NextResponse.next()
  }
  if (pathname.startsWith('/api/auth/token')) {
    return NextResponse.next()
  }

  const accessToken = await CookieToken.get('accessToken')
  const tokenRole = await CookieToken.getTokenRole()
  if (accessToken && tokenRole.length > 0) {
    const hasAccess = tokenRole.some((group) =>
      RolePermissions.hasAccess(group, pathname)
    )
    if (!hasAccess) return NextResponse.redirect(await getLoginUrl())

    return NextResponse.next()
  }
  const refreshToken = await CookieToken.get('refreshToken')

  if (!refreshToken) {
    console.log('refreshToken is null')
    return NextResponse.redirect(await getLoginUrl())
  }
  const tokens = await requestToken(refreshToken)
  return responseWithAccessToken(tokens)
}

async function requestToken(refreshToken: string): Promise<TokenDto> {
  return await getToken({
    refreshToken: refreshToken,
    grantType: GrantTypeDto.RefreshToken,
  })
}

const responseWithAccessToken = (tokens: TokenDto) => {
  const response = NextResponse.next()
  CookieToken.setTokenDtoInResponse(response, tokens)
  return response
}
