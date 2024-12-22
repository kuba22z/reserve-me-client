import { getClient } from '@/gql/client'
import {
  CreateLocationDocument,
  LocationFragmentFragmentDoc,
} from '@/gql/queries/create-location.generated'

export async function createLocation() {
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
