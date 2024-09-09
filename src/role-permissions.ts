import { CognitoGroupDto } from '@/gql/__generated__/types'
import { paths } from '@/paths'

export namespace RolePermissions {
  export const hasAccess = (role: CognitoGroupDto, url: string) => {
    const accessibleRoutes = pathAccessMap[role] || []
    return accessibleRoutes.some((route) => {
      // Create a regex from the route by replacing dynamic segments
      const regexPattern = route
        .replace(/\[.*?\]/g, '[^/]+')
        .replace('/', '\\/')
      const regex = new RegExp(`^${regexPattern}$`)
      return regex.test(url)
    })
  }

  export const getAccessLevel = (
    userGroups: ReadonlyArray<CognitoGroupDto>,
    path: string
  ) => {
    return mergeObjectsByBoolean(
      userGroups
        .map((group) => accessLevelMap[group])
        .map((accessLevels) => {
          const allPaths = Object.keys(accessLevels)
          if (!allPaths.includes(path)) {
            throw Error(
              'The pathname' +
                path +
                'is unknown. The access level cant be determined'
            )
          }
          type AllPathTypes = keyof typeof accessLevels

          return accessLevels[path as AllPathTypes]
        })
    )
  }
  const mergeObjectsByBoolean = <T extends Record<string, boolean>>(
    array: T[]
  ): T => {
    // Initialize merged as an empty object with the type of T
    const merged = Object.create(null) as T

    for (const current of array) {
      Object.entries(current).forEach(([key, value]) => {
        // Use type assertion to ensure TypeScript understands the assignment
        ;(merged[key as keyof T] as boolean) = merged[key as keyof T] || value
      })
    }

    return merged
  }
}

const pathAccessMap = {
  [CognitoGroupDto.Admin]: [
    paths.home,
    paths.dashboard.overview,
    paths.dashboard.account,
    paths.dashboard.users,
  ],
  [CognitoGroupDto.Employee]: [
    paths.home,
    paths.dashboard.overview,
    paths.dashboard.account,
    paths.dashboard.users,
  ],
  [CognitoGroupDto.Client]: [
    paths.home,
    paths.dashboard.overview,
    paths.dashboard.account,
  ],
}

const accessLevelMap: AccessLevelByRole = {
  [CognitoGroupDto.Admin]: {
    [paths.dashboard.overview]: {
      editOwn: true,
      editOther: true,
      deleteOwn: true,
      deleteOther: true,
      createOwn: true,
      createOther: true,
    },
    [paths.dashboard.account]: {
      showOtherUsers: true,
    },
  },
  [CognitoGroupDto.Employee]: {
    [paths.dashboard.overview]: {
      editOwn: true,
      editOther: true,
      deleteOwn: true,
      deleteOther: true,
      createOwn: true,
      createOther: true,
    },
    [paths.dashboard.account]: {
      showOtherUsers: true,
    },
  },
  [CognitoGroupDto.Client]: {
    [paths.dashboard.overview]: {
      editOwn: true,
      editOther: false,
      deleteOwn: true,
      deleteOther: false,
      createOwn: true,
      createOther: false,
    },
    [paths.dashboard.account]: {
      showOtherUsers: false,
    },
  },
}

export type DashboardAccessLevels = {
  editOwn: boolean
  editOther: boolean
  deleteOwn: boolean
  deleteOther: boolean
  createOwn: boolean
  createOther: boolean
}

export type AccountAccessLevels = {
  showOtherUsers: boolean
}

type AccessLevelByPath = {
  [T in typeof paths.dashboard.overview]: DashboardAccessLevels
} & {
  [T in typeof paths.dashboard.account]: AccountAccessLevels
}

type AccessLevelByRole = {
  [T in CognitoGroupDto]: AccessLevelByPath
}

// const mergeObjectsByBoolean2 = <T extends Record<string, boolean>>(
//   array: T[]
// ): T => {
//   return array.reduce(
//     (a, b) => {
//       const merged = a
//       Object.entries(a).forEach(([key, value]) => {
//         const typedKey = key as keyof T
//         merged[typedKey] = (value || b[typedKey]) as T[keyof T]
//       })
//
//       return merged
//     },
//     Object.create(null) as T
//   )
// }
