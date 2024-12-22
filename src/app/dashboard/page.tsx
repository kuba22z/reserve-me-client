import * as React from 'react'
import type { Metadata } from 'next'

import { config } from '@/config'
import EventCalendar from '@/components/dashboard/calendar/EventCalendar'

export const metadata = {
  title: `Overview | Dashboard | ${config.site.name}`,
} satisfies Metadata

export default async function Page(): Promise<React.JSX.Element> {
  return (
    <>
      <EventCalendar />
    </>
  )
}
