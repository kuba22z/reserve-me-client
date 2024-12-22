import { CognitoGroupDto, MeetingDto } from '@/gql/__generated__/types'
import { getClient } from '@/gql/client'
import { GetMeetingDocument } from '@/gql/queries/get-meeting.generated'
import { getUser } from '@/operations/user/get-user'
import { GetReservedMeetingsDocument } from '@/gql/queries/get-reserved-meetings.generated'

export const getMeetings = async (): Promise<ReadonlyArray<MeetingDto>> => {
  const user = await getUser()
  if (
    user.groups.some(
      (group) => group == CognitoGroupDto.Admin || CognitoGroupDto.Employee
    )
  ) {
    const { data, error, errors, networkStatus } = await getClient().query({
      query: GetMeetingDocument,
      fetchPolicy: 'network-only',
    })
    return data.meetings
  } else {
    const { data, error, errors, networkStatus } = await getClient().query({
      query: GetReservedMeetingsDocument,
      fetchPolicy: 'network-only',
    })
    return data.reservedMeetings
  }
}
