import { create } from 'zustand'
import { LocationDto } from '@/gql/__generated__/types'
import { CreateLocationMutation } from '@/gql/queries/create-location.generated'
import { getLocations } from '@/operations/location/get-locations'
import { createLocation } from '@/operations/location/create-location'

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
      set({ locations: [...a] })
    }),
  addLocation2: async () =>
    createLocation().then((a) => {
      set((state) => ({
        locations: [a.data!.createLocation, ...state.locations],
      }))
      return a
    }),
}))
