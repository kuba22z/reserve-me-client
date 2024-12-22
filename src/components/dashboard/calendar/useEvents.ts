import { useEffect, useState } from 'react'
import { IEventInfo } from '@/components/dashboard/calendar/EventCalendarUtils'
import { MeetingsFilterMode } from '@/components/dashboard/calendar/FilterMode'
import { useUserContext } from '@/components/core/UserProvider'

export const useEvents = (initialEvents: IEventInfo[]) => {
  const [showedEvents, setShowedEvents] = useState<IEventInfo[]>(initialEvents)
  const user = useUserContext()

  const [events, setEvents] = useState<IEventInfo[]>(initialEvents)
  const [filterMode, setFilterMode] = useState<MeetingsFilterMode>(
    MeetingsFilterMode.TOTAL
  )

  useEffect(() => {
    applyFilterMode(events)
  }, [events, filterMode])

  const applyFilterMode = (events: IEventInfo[]) => {
    switch (filterMode) {
      case MeetingsFilterMode.TOTAL:
        setShowedEvents(events)
        break
      case MeetingsFilterMode.USER:
        setShowedEvents(
          events.filter((e) =>
            e.users ? e.users.map((user) => user.id).includes(user.id) : false
          )
        )
        break
      case MeetingsFilterMode.LOWER_COURT:
        setShowedEvents(events.filter((e) => e.location.id === 2))
        break
      case MeetingsFilterMode.UPPER_COURT:
        setShowedEvents(events.filter((e) => e.location.id === 1))
        break
      default:
        throw new Error()
    }
  }
  return {
    showedEvents,
    setShowedEvents,
    events,
    setEvents,
    filterMode,
    setFilterMode,
  }
}
