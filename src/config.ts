import { getSiteURL } from '@/lib/get-site-url'
import { LogLevel } from '@/lib/logger'
import { getClientNoAuth } from '@/gql/clientNoAuth'
import { GetLoginUrlDocument } from '@/gql/queries/get-login.generated'

export interface Config {
  site: { name: string; description: string; themeColor: string; url: string }
  logLevel: keyof typeof LogLevel
}

async function getLoginUrl() {
  const { data, error } = await getClientNoAuth()
    .query({
      query: GetLoginUrlDocument,
    })
    .catch((e) => {
      console.error('Server is not available')
      throw e
    })
  return data.login
}
export const externalUrl = {
  login: await getLoginUrl(),
}

export const config: Config = {
  site: {
    name: 'Reserve Me',
    description: '',
    themeColor: '#090a0b',
    url: getSiteURL(),
  },
  logLevel:
    (process.env.NEXT_PUBLIC_LOG_LEVEL as keyof typeof LogLevel) ??
    LogLevel.ALL,
}
