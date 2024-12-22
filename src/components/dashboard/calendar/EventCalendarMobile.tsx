'use client'
import * as React from 'react'
import { useState } from 'react'
import { Button, ButtonGroup, Divider } from '@mui/material'
import {
  Calendar,
  type Event,
  momentLocalizer,
  Views,
} from 'react-big-calendar'

import moment from 'moment-timezone'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import AddEventModal from './AddEventModal'
import EventInfoModal from './EventInfoModal'
import AddDatePickerEventModal from './AddDatePickerEventModal'
import 'moment/locale/de'
import EventInfo from '@/components/dashboard/calendar/EventInfo'
import { BottomNav } from '@/components/dashboard/layout/bottom-nav'
import AddIcon from '@mui/icons-material/Add'
import BottomNavigationAction from '@mui/material/BottomNavigationAction/BottomNavigationAction'
import { MeetingsFilterMode } from '@/components/dashboard/calendar/FilterMode'
import {
  determineColor,
  EventCalendarProps,
  IEventInfo,
  lowerCourtColor,
  totalCourtColor,
  upperCourtColor,
} from '@/components/dashboard/calendar/EventCalendarUtils'
import { useEvents } from '@/components/dashboard/calendar/useEvents' // const locales = {

// const locales = {
//   "en-US": enUS,
// }
// Set the IANA time zone you want to use
//moment.tz.setDefault('Europe/Paris')
const localizer = momentLocalizer(moment) // or globalizeLocalizer

function EventCalendarMobile({
  initialEvents,
  locations,
  users,
}: Readonly<EventCalendarProps>) {
  const [openEventModal, setOpenEventModal] = useState(false)
  const [openDatepickerModal, setOpenDatepickerModal] = useState(false)
  const [currentEvent, setCurrentEvent] = useState<Event | IEventInfo | null>(
    null
  )
  const [openEventInfoModal, setOpenEventInfoModal] = useState(false)
  const { events, setEvents, showedEvents, setShowedEvents, setFilterMode } =
    useEvents(initialEvents)

  const handleSelectSlot = (event: Event) => {
    setOpenEventModal(true)
    setCurrentEvent(event)
  }

  const handleSelectEvent = (event: IEventInfo) => {
    setCurrentEvent(event)
    setOpenEventInfoModal(true)
  }
  return (
    <>
      <h4>Tennis Court Reservations Made Easy: Book and Manage Your Matches</h4>
      <ButtonGroup size="medium" aria-label="outlined primary button group">
        <Button
          id={'users-meetings'}
          onClick={() => {
            setFilterMode(MeetingsFilterMode.USER)
          }}
          size="medium"
          variant="contained"
        >
          My Meetings
        </Button>
        <Button
          onClick={() => {
            setFilterMode(MeetingsFilterMode.TOTAL)
          }}
          size="medium"
          variant="contained"
          style={{ backgroundColor: totalCourtColor }}
        >
          Total
        </Button>
        <Button
          onClick={() => {
            setFilterMode(MeetingsFilterMode.UPPER_COURT)
          }}
          size="medium"
          variant="contained"
          style={{ backgroundColor: upperCourtColor }}
        >
          Upper Court
        </Button>
        <Button
          onClick={() => {
            setFilterMode(MeetingsFilterMode.LOWER_COURT)
          }}
          size="medium"
          variant="contained"
          style={{ backgroundColor: lowerCourtColor }}
        >
          Lower Court
        </Button>
      </ButtonGroup>
      <Divider style={{ margin: 10 }} />
      <AddEventModal
        open={openEventModal}
        users={users}
        locations={locations}
        onAddEvent={(e) => setEvents([...events, e])}
        close={() => setOpenEventModal(false)}
        currentEvent={currentEvent as IEventInfo}
      />
      <AddDatePickerEventModal
        open={openDatepickerModal}
        users={users}
        locations={locations}
        onAddEvent={(e) => setEvents([...events, e])}
        close={() => setOpenDatepickerModal(false)}
      />
      <EventInfoModal
        open={openEventInfoModal}
        handleClose={() => {
          setOpenEventInfoModal(false)
        }}
        onDeleteEvent={(currentEventInfo) => {
          setShowedEvents(() =>
            [...showedEvents].filter((e) => e._id !== currentEventInfo._id)
          )
        }}
        currentEvent={currentEvent as IEventInfo}
      />
      <Calendar
        localizer={localizer}
        events={showedEvents}
        onSelectEvent={handleSelectEvent}
        onSelectSlot={handleSelectSlot}
        selectable
        startAccessor="start"
        endAccessor={'end'}
        components={{ event: EventInfo }}
        scrollToTime={localizer.startOf(new Date(), 'day')}
        defaultView={Views.DAY}
        views={[Views.DAY]}
        eventPropGetter={(event) => {
          const color = determineColor(event)
          return {
            style: {
              backgroundColor: color,
              borderColor: color,
            },
          }
        }}
        style={{
          height: 1150,
        }}
      />
      <BottomNav>
        <BottomNavigationAction
          onClick={() => setOpenDatepickerModal(true)}
          label="Add"
          icon={<AddIcon />}
        />
      </BottomNav>
    </>
  )
}

export default EventCalendarMobile
