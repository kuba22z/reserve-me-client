import { LocationDto } from '@/gql/__generated__/types'
import { getClient } from '@/gql/client'
import { GetLocationDocument } from '@/gql/queries/get-location.generated'

export const getLocations = async (): Promise<ReadonlyArray<LocationDto>> => {
  const { data, error, errors, networkStatus } = await getClient().query({
    query: GetLocationDocument,
  })
  return data.locations
}
