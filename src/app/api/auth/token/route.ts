import { NextApiRequest } from 'next'
import { GetTokenDocument } from '@/gql/queries/get-token.generated'
import { GrantTypeDto, TokenRequestDto } from '@/gql/__generated__/types'
import { redirect } from 'next/navigation'
import { getClientNoAuth } from '@/gql/clientNoAuth'
import { CookieToken } from '@/app/utils/auth/cookie-token'

export async function GET(req: NextApiRequest) {
  if (!req.url) {
    throw Error
  }
  const code = new URL(req.url).searchParams.get('code')
  const tokens = await getTokenGraphql({
    authorizationCode: code,
    grantType: GrantTypeDto.AuthorizationCode,
  })
  CookieToken.setTokenDto(tokens)
  redirect('/')
}

export const getTokenGraphql = async (tokenRequest: TokenRequestDto) => {
  const { data, error, errors, networkStatus } = await getClientNoAuth().query({
    query: GetTokenDocument,
    variables: { tokenRequest },
  })
  return data.accessToken
}
