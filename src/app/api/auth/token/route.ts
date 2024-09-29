import { GrantTypeDto } from '@/gql/__generated__/types'
import { redirect } from 'next/navigation'
import { CookieToken } from '@/app/utils/auth/cookie-token'
import { paths } from '@/paths'
import { getToken } from '@/operations/auth/get-token'
import { NextRequest } from 'next/server'

export async function GET(req: NextRequest | Request) {
  if (!req.url) {
    throw Error
  }
  const code = new URL(req.url).searchParams.get('code')
  const tokens = await getToken({
    authorizationCode: code,
    grantType: GrantTypeDto.AuthorizationCode,
  })
  CookieToken.setTokenDto(tokens)
  redirect(paths.dashboard.overview)
}
