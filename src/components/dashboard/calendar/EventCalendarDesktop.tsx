'use client'
import * as React from 'react'
import { useState } from 'react'
import {
  Box,
  Button,
  ButtonGroup,
  Card,
  CardContent,
  CardHeader,
  Container,
  Divider,
} from '@mui/material'

import {
  Calendar,
  type Event,
  momentLocalizer,
  Views,
} from 'react-big-calendar'

import moment from 'moment-timezone'

import 'react-big-calendar/lib/css/react-big-calendar.css'
import EventInfoModal from './EventInfoModal'
import AddDatePickerEventModal from './AddDatePickerEventModal'
import 'moment/locale/de'
import EventInfo from '@/components/dashboard/calendar/EventInfo'
import { Plus as PlusIcon } from '@phosphor-icons/react/dist/ssr/Plus'
import { MeetingsFilterMode } from '@/components/dashboard/calendar/FilterMode'
import AddEventModal from '@/components/dashboard/calendar/AddEventModal'
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

function EventCalendarDesktop({
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
    <Box
      mt={2}
      mb={2}
      component="main"
      sx={{
        flexGrow: 1,
        py: 0,
      }}
    >
      <Container maxWidth={false}>
        <Card>
          <CardHeader subheader="Tennis Court Reservations Made Easy: Book and Manage Your Matches" />
          <Divider />
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <ButtonGroup
                size="medium"
                variant="contained"
                aria-label="outlined primary button group"
              >
                <Button
                  onClick={() => {
                    setOpenDatepickerModal(true)
                  }}
                  size="medium"
                  variant="contained"
                  startIcon={<PlusIcon fontSize="var(--icon-fontSize-md)" />}
                >
                  Add event
                </Button>
              </ButtonGroup>
              <ButtonGroup
                size="medium"
                aria-label="outlined primary button group"
              >
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
            </Box>
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
                  [...showedEvents].filter(
                    (e) => e._id !== currentEventInfo._id
                  )
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
              components={{ event: EventInfo }}
              endAccessor="end"
              defaultView={Views.WEEK}
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
          </CardContent>
        </Card>
      </Container>
    </Box>
  )
}

export default EventCalendarDesktop
