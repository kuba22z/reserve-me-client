'use server'
import { CognitoGroupDto } from '@/gql/__generated__/types'
import { getClient } from '@/gql/client'
import { GetUsersByGroupDocument } from '@/gql/queries/get-users-by-group.generated'

export const getUsersByGroup = async (group: CognitoGroupDto) => {
  const { data, error } = await getClient().query({
    query: GetUsersByGroupDocument,
    variables: { group: group },
  })
  return data.usersByGroup
}
