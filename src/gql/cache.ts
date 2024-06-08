import { InMemoryCache, makeVar } from '@apollo/client'
import { LocationDto } from './__generated__/types'

export const locationsVar = makeVar<LocationDto[]>([])

export const cache = new InMemoryCache({
  typePolicies: {
    Query: {
      fields: {
        locations2: {
          read() {
            return locationsVar()
          },
        },
      },
    },
  },
})
