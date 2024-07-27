import * as React from 'react'
import type { Metadata } from 'next'

import { config } from '@/config'
import EventCalendar from '@/components/dashboard/calendar/EventCalendar'
import { getClient } from '@/gql/client'
import { GetMeetingDocument } from '@/gql/queries/get-meeting.generated'
import { CreateMeetingDto, MeetingDto } from '@/gql/__generated__/types'
import { CreateMeetingDocument } from '@/gql/queries/create-meeting.generated'

export const metadata = {
  title: `Overview | Dashboard | ${config.site.name}`,
} satisfies Metadata
const getMeetings = async (): Promise<ReadonlyArray<MeetingDto>> => {
  const { data, error, errors, networkStatus } = await getClient().query({
    query: GetMeetingDocument,
    fetchPolicy: 'network-only',
  })
  return data.meetings
}

const createMeeting = async (
  createMeetingDto: CreateMeetingDto
): Promise<MeetingDto> => {
  'use server'
  const { data, errors } = await getClient().mutate({
    mutation: CreateMeetingDocument,
    variables: { meeting: createMeetingDto },
  })
  return data!.createMeeting
}

export default async function Page(): Promise<React.JSX.Element> {
  const meetings = await getMeetings()
  console.log(meetings)
  return (
    <>
      <EventCalendar meetings={meetings} createMeeting={createMeeting} />
    </>
  )
}
