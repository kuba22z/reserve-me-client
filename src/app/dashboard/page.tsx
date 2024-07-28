import * as React from 'react'
import type { Metadata } from 'next'

import { config } from '@/config'
import EventCalendar from '@/components/dashboard/calendar/EventCalendar'
import { getClient } from '@/gql/client'
import { GetMeetingDocument } from '@/gql/queries/get-meeting.generated'
import {
  CounterDto,
  CreateMeetingDto,
  LocationDto,
  MeetingDto,
  UserDto,
} from '@/gql/__generated__/types'
import { CreateMeetingDocument } from '@/gql/queries/create-meeting.generated'
import { GetUsersDocument } from '@/gql/queries/get-users.generated'
import { DeleteMeetingDocument } from '@/gql/queries/delete-meeting.generated'
import { GetLocationDocument } from '@/gql/queries/get-location.generated'

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

const getUsers = async (): Promise<ReadonlyArray<UserDto>> => {
  'use server'
  const { data, errors } = await getClient().query({
    query: GetUsersDocument,
  })
  return data!.users
}

const getLocations = async (): Promise<ReadonlyArray<LocationDto>> => {
  'use server'
  const { data, errors } = await getClient().query({
    query: GetLocationDocument,
  })
  return data!.locations
}

const deleteMeetings = async (ids: number[]): Promise<CounterDto> => {
  'use server'
  const { data, errors } = await getClient().mutate({
    mutation: DeleteMeetingDocument,
    variables: { ids: ids },
  })
  return data!.deleteMeetings
}

export default async function Page(): Promise<React.JSX.Element> {
  const meetings = await getMeetings()
  const users = await getUsers()
  const locations = await getLocations()
  return (
    <>
      <EventCalendar
        meetings={meetings}
        createMeeting={createMeeting}
        deleteMeetings={deleteMeetings}
        users={users}
        locations={locations}
      />
    </>
  )
}
