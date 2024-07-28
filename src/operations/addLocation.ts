import { UpdateLocationDocument } from '@/gql/queries/update-location.generated'
import { getClient } from '@/gql/client'
import {
  CreateLocationDocument,
  LocationFragmentFragmentDoc,
} from '@/gql/queries/create-location.generated'

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
      console.log(data)
      cache.modify({
        fields: {
          locations(existingTodos = []) {
            console.log(existingTodos)
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

export async function updateLocation() {
  const { data } = await getClient().mutate({
    mutation: UpdateLocationDocument,
    variables: { location: { id: 1, city: 'my New21312321213 City' } },
  })
  return { data }
}
