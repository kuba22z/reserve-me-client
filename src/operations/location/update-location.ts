import { getClient } from '@/gql/client'
import { UpdateLocationDocument } from '@/gql/queries/update-location.generated'

export async function updateLocation() {
  const { data } = await getClient().mutate({
    mutation: UpdateLocationDocument,
    variables: { location: { id: 1, city: 'my New21312321213 City' } },
  })
  return { data }
}
