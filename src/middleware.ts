import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import {
  RequestCookies,
  ResponseCookies,
} from 'next/dist/compiled/@edge-runtime/cookies'
import { CookieToken } from '@/app/utils/auth/cookie-token'
import {
  GrantTypeDto,
  TokenDto,
  TokenRequestDto,
} from './gql/__generated__/types'
import { GetTokenDocument } from '@/gql/queries/get-token.generated'
import { getClientNoAuth } from '@/gql/clientNoAuth'
import { externalUrl } from '@/config'
import { RolePermissions } from '@/role-permissions'

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

  if (CookieToken.get('accessToken') && CookieToken.getTokenRole().length > 0) {
    const hasAccess = CookieToken.getTokenRole().some((group) =>
      RolePermissions.hasAccess(group, pathname)
    )
    if (!hasAccess) return NextResponse.redirect(externalUrl.login)

    return NextResponse.next()
  }
  const refreshToken = CookieToken.get('refreshToken')

  if (!refreshToken) {
    console.log('refreshToken is null')
    return NextResponse.redirect(externalUrl.login)
  }
  const tokens = await requestToken(refreshToken)
  return responseWithAccessToken(request, tokens)
}

export async function requestToken(refreshToken: string): Promise<TokenDto> {
  return await getTokenGraphql({
    refreshToken: refreshToken,
    grantType: GrantTypeDto.RefreshToken,
  })
}

export const responseWithAccessToken = (
  request: NextRequest,
  tokens: TokenDto
) => {
  const response = NextResponse.next()
  CookieToken.setTokenDtoInResponse(response, tokens)
  //TODO this is required because of this issue https://github.com/vercel/next.js/issues/49442
  // Next js doesnt set the cookie directly, because of the bug.
  // This bug is already fixed in "next": "14.3.0-canary.38" you should remove this function after the bug fix is
  // merged to the stable version
  applySetCookie(request, response)
  return response
}

export const getTokenGraphql = async (tokenRequest: TokenRequestDto) => {
  const { data, error, errors, networkStatus } = await getClientNoAuth().query({
    query: GetTokenDocument,
    variables: { tokenRequest },
  })
  return data.accessToken
}

/**
 * Copy cookies from the Set-Cookie header of the response to the Cookie header of the request,
 * so that it will appear to SSR/RSC as if the user already has the new cookies.
 */
export function applySetCookie(req: NextRequest, res: NextResponse): void {
  // parse the outgoing Set-Cookie header
  const setCookies = new ResponseCookies(res.headers)
  // Build a new Cookie header for the request by adding the setCookies
  const newReqHeaders = new Headers(req.headers)
  const newReqCookies = new RequestCookies(newReqHeaders)
  setCookies.getAll().forEach((cookie) => newReqCookies.set(cookie))
  // set “request header overrides” on the outgoing response
  NextResponse.next({
    request: { headers: newReqHeaders },
  }).headers.forEach((value, key) => {
    if (
      key === 'x-middleware-override-headers' ||
      key.startsWith('x-middleware-request-')
    ) {
      res.headers.set(key, value)
    }
  })
}

//See "Matching Paths" below to learn more
// export const config = {
//   matcher: ['/((?!.api/auth/token).*$)'],
// }
