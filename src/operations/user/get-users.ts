'use server'

import { UserDto } from '@/gql/__generated__/types'
import { getClient } from '@/gql/client'
import { GetUsersDocument } from '@/gql/queries/get-users.generated'

export const getUsers = async (): Promise<ReadonlyArray<UserDto>> => {
  const { data, errors } = await getClient().query({
    query: GetUsersDocument,
  })
  return data!.users
}
