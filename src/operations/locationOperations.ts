'use server'
import { getClient } from '@/gql/client'
import { GetLocationDocument } from '@/gql/queries/get-location.generated'
import {
  CreateLocationDocument,
  LocationFragmentFragmentDoc,
} from '@/gql/queries/create-location.generated'
import { LocationDto } from '@/gql/__generated__/types'

export const getLocations = async (): Promise<ReadonlyArray<LocationDto>> => {
  const { data, error, errors, networkStatus } = await getClient().query({
    query: GetLocationDocument,
  })
  return data.locations
}

export async function addLocation() {
  const newCity = 'test123'
  const d = {
    city: newCity,
    postalCode: '3123',
    name: Math.random().toString(),
    street: '123',
    houseNumber: 1,
  }
  const { data } = await getClient().mutate({
    mutation: CreateLocationDocument,
    variables: {
      location: d,
    },
    update(cache, { data }) {
      cache.modify({
        fields: {
          locations(existingTodos = []) {
            const newTodoRef = cache.writeFragment({
              data: data!.createLocation,
              fragment: LocationFragmentFragmentDoc,
            })
            return existingTodos.concat(newTodoRef)
          },
        },
      })
    },
  })
  return { data }
}
