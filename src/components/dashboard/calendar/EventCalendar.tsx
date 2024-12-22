import * as React from 'react'
import EventCalendarDesktop from '@/components/dashboard/calendar/EventCalendarDesktop'
import SwitchMobileComponent from '@/components/common/SwitchMobileComponent'
import EventCalendarMobile from '@/components/dashboard/calendar/EventCalendarMobile'
import { getUsers } from '@/operations/user/get-users'
import { getMeetings } from '@/operations/meeting/get-meetings'
import { getLocations } from '@/operations/location/get-locations'
import { MeetingDto } from '@/gql/__generated__/types'
import {
  getUsersDtoByUserNames,
  IEventInfo,
} from '@/components/dashboard/calendar/EventCalendarUtils'

export default async function EventCalendar(): Promise<React.JSX.Element> {
  const meetingToEvents = (
    meetings: ReadonlyArray<MeetingDto>
  ): IEventInfo[] => {
    return meetings
      .filter((m) => m.schedules && m.schedules.length > 0)
      .flatMap((m) => {
        return m.schedules!.map((schedule) => {
          return {
            start: new Date(schedule.startDate),
            end: new Date(schedule.endDate),
            _id: m.id.toString(),
            resource: null,
            users: getUsersDtoByUserNames(users, m.userNames),
            location: schedule.location,
            notes: m.notes ?? undefined,
          }
        })
      })
  }

  const meetings = await getMeetings()
  const users = await getUsers()
  const locations = await getLocations()
  const events = meetingToEvents(meetings)

  return (
    <>
      <SwitchMobileComponent
        desktopChild={
          <EventCalendarDesktop
            initialEvents={events}
            users={users}
            locations={locations}
          />
        }
        mobileChild={
          <EventCalendarMobile
            initialEvents={events}
            users={users}
            locations={locations}
          />
        }
      ></SwitchMobileComponent>
    </>
  )
}
