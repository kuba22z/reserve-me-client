import { MeetingDto } from '@/gql/__generated__/types'
import { getClient } from '@/gql/client'
import { GetMeetingDocument } from '@/gql/queries/get-meeting.generated'

export const getMeetings = async (): Promise<ReadonlyArray<MeetingDto>> => {
  const { data, error, errors, networkStatus } = await getClient().query({
    query: GetMeetingDocument,
    fetchPolicy: 'network-only',
  })
  return data.meetings
}
