'use server'
import { getClient } from '@/gql/client'
import { CreateUserDocument } from '@/gql/queries/create-user.generated'
import { CreateUserDto, UserDto } from '@/gql/__generated__/types'
import assert from 'assert'

export const createUser = async (user: CreateUserDto): Promise<UserDto> => {
  const { data, errors } = await getClient().mutate({
    mutation: CreateUserDocument,
    variables: { user },
  })
  assert(data)
  return data.createUser
}
