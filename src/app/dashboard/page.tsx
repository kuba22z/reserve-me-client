import * as React from 'react'
import type { Metadata } from 'next'

import { config } from '@/config'
import EventCalendar from '@/components/dashboard/calendar/EventCalendar'
import { getClient } from '@/gql/client'
import { GetMeetingDocument } from '@/gql/queries/get-meeting.generated'
import { LocationDto, MeetingDto, UserDto } from '@/gql/__generated__/types'
import { GetUsersDocument } from '@/gql/queries/get-users.generated'
import { GetLocationDocument } from '@/gql/queries/get-location.generated'
import SwitchMobileComponent from '@/components/common/SwitchMobileComponent'
import EventCalendarMobile from '@/components/dashboard/calendar/EventCalendarMobile'

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

export default async function Page(): Promise<React.JSX.Element> {
  const meetings = await getMeetings()
  const users = await getUsers()
  const locations = await getLocations()

  return (
    <>
      <SwitchMobileComponent
        stationaryChild={
          <EventCalendar
            meetings={meetings}
            users={users}
            locations={locations}
          />
        }
        mobileChild={
          <EventCalendarMobile
            meetings={meetings}
            users={users}
            locations={locations}
          />
        }
      ></SwitchMobileComponent>
    </>
  )
}
