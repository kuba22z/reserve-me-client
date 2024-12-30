export const supportedLanguages = ['en-US', 'pl-PL']
export const defaultLocale = 'en-US'

export const paths = {
  home: '/',
  auth: {
    signIn: '/auth/sign-in',
    signUp: '/auth/sign-up',
    resetPassword: '/auth/reset-password',
  },
  dashboard: {
    overview: '/dashboard',
    account: '/dashboard/account',
    users: '/dashboard/users',
  },
  errors: { notFound: '/errors/not-found' },
} as const

export namespace Paths {
  export const removeLang = (path: string): string => {
    if (!path) {
      return '' // Return empty string for empty input
    }

    const segments = path.split('/').filter(Boolean)
    const potentialLang = segments[0]

    if (supportedLanguages.includes(potentialLang)) {
      return `/${segments.slice(1).join('/')}`
    }
    return path
  }
}
