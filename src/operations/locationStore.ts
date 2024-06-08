import { create } from 'zustand'
import { addLocation, getLocations } from '@/operations/locationOperations'
import { LocationDto } from '@/gql/__generated__/types'
import { CreateLocationMutation } from '@/gql/queries/create-location.generated'

interface LocationState {
  locations: LocationDto[]
  getLocations: () => void
  addLocation2: () => Promise<{
    data: CreateLocationMutation | null | undefined
  }>
}

export const useLocationStore = create<LocationState>((set, get) => ({
  locations: [],
  getLocations: async () =>
    getLocations().then((a) => {
      console.log(a)
      set({ locations: [...a] })
    }),
  addLocation2: async () =>
    addLocation().then((a) => {
      set((state) => ({
        locations: [a.data!.createLocation, ...state.locations],
      }))
      return a
    }),
}))
