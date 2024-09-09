'use server'
import { CounterDto } from '@/gql/__generated__/types'
import { getClient } from '@/gql/client'
import { DeleteMeetingDocument } from '@/gql/queries/delete-meeting.generated'

export const deleteMeetings = async (ids: number[]): Promise<CounterDto> => {
  const { data, errors } = await getClient().mutate({
    mutation: DeleteMeetingDocument,
    variables: { ids: ids },
  })
  return data!.deleteMeetings
}
