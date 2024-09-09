'use server'
import { CreateMeetingDto, MeetingDto } from '@/gql/__generated__/types'
import { getClient } from '@/gql/client'
import { CreateMeetingDocument } from '@/gql/queries/create-meeting.generated'

export const createMeeting = async (
  createMeetingDto: CreateMeetingDto
): Promise<MeetingDto> => {
  const { data, errors } = await getClient().mutate({
    mutation: CreateMeetingDocument,
    variables: { meeting: createMeetingDto },
  })
  return data!.createMeeting
}
