import * as React from 'react'
import type { Metadata } from 'next'

import { config } from '@/config'
import EventCalendar from '@/components/dashboard/calendar/EventCalendar'
import SwitchMobileComponent from '@/components/common/SwitchMobileComponent'
import EventCalendarMobile from '@/components/dashboard/calendar/EventCalendarMobile'
import { getUsers } from '@/operations/user/get-users'
import { getMeetings } from '@/operations/meeting/get-meetings'
import { getLocations } from '@/operations/location/get-locations'

export const metadata = {
  title: `Overview | Dashboard | ${config.site.name}`,
} satisfies Metadata

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
