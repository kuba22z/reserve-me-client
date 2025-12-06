import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { CookieToken } from '@/app/utils/auth/cookie-token'
import { GrantTypeDto, TokenDto } from './gql/__generated__/types'
import { RolePermissions } from '@/role-permissions'
import { getToken } from '@/operations/auth/get-token'
import { getLoginUrl } from '@/operations/auth/get-login-url'
import { match } from '@formatjs/intl-localematcher'
import Negotiator from 'negotiator'
import { defaultLocale, Paths, paths, supportedLanguages } from '@/paths'

// This function can be marked `async` if using `await` inside
export async function proxy(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl
  if (pathname.startsWith('/auth/token')) {
    const code = searchParams.get('code')
    if (!code) throw new Error('code can"t be null')
    const tokens = await getToken({
      authorizationCode: code,
      grantType: GrantTypeDto.AuthorizationCode,
    })
    const overviewResponse = NextResponse.redirect(
      new URL(paths.dashboard.overview, request.url)
    )
    await CookieToken.setTokenDto(tokens)
    return overviewResponse
  }

  const accessToken = await CookieToken.get('accessToken')
  const tokenRole = await CookieToken.getTokenRole()
  if (accessToken && tokenRole.length > 0) {
    const pathWithoutLang = Paths.removeLang(pathname)
    const hasAccess = tokenRole.some((group) =>
      RolePermissions.hasAccess(group, pathWithoutLang)
    )
    if (!hasAccess) return NextResponse.redirect(await getLoginUrl())
    return nextResponse(pathname, request)
  }
  const refreshToken = await CookieToken.get('refreshToken')
  if (!refreshToken) {
    console.log('refreshToken is null')
    return NextResponse.redirect(await getLoginUrl())
  }
  const tokens = await requestToken(refreshToken)
  return responseWithAccessToken(pathname, request, tokens)
}

async function requestToken(refreshToken: string): Promise<TokenDto> {
  return await getToken({
    refreshToken: refreshToken,
    grantType: GrantTypeDto.RefreshToken,
  })
}

const responseWithAccessToken = (
  pathname: string,
  request: NextRequest,
  tokens: TokenDto
) => {
  const response = nextResponse(pathname, request)
  CookieToken.setTokenDtoInResponse(response, tokens)
  return response
}

export const config = {
  matcher: [
    // Exclude Next.js internals, all API routes, static files, public files
    '/((?!_next|api|static|.*\\..*).*)',
  ],
}

const nextResponse = (pathname: string, request: NextRequest) => {
  const pathnameHasLocale = supportedLanguages.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  )
  if (pathnameHasLocale) return NextResponse.next()
  const locale = getLocale(request)

  // e.g. incoming request is /products
  // The new URL is now /en-US/products
  request.nextUrl.pathname = `/${locale}${pathname}`
  return NextResponse.redirect(request.nextUrl)
}

const getLocale = (request: NextRequest): string => {
  const acceptedLanguage = request.headers.get('accept-language') ?? undefined
  const headers = { 'accept-language': acceptedLanguage }
  const languages = new Negotiator({ headers }).languages()

  return match(languages, supportedLanguages, defaultLocale)
}
