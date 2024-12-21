'use client'
import * as React from 'react'
import { MouseEvent, useEffect, useState } from 'react'
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
import { LocationDto, MeetingDto, UserDto } from '@/gql/__generated__/types'
import EventInfo from '@/components/dashboard/calendar/EventInfo'
import { Plus as PlusIcon } from '@phosphor-icons/react/dist/ssr/Plus'
import { useUserContext } from '@/components/core/UserProvider'
import useUserRoleAccessLevel from '@/hooks/use-user-role-access-level'
import { DashboardAccessLevels } from '@/role-permissions'
import { deleteMeetings } from '@/operations/meeting/delete-meetings'
import { createMeeting } from '@/operations/meeting/create-meetings'
import { MeetingsFilterMode } from '@/components/dashboard/calendar/FilterMode'
import AddEventModal from '@/components/dashboard/calendar/AddEventModal'

// const locales = {
//   "en-US": enUS,
// }
// Set the IANA time zone you want to use
//moment.tz.setDefault('Europe/Paris')
const localizer = momentLocalizer(moment) // or globalizeLocalizer

export interface IEventInfo extends Event {
  _id: string
  users: UserDto[]
  location: LocationDto
  todoId?: string
  notes: string
}

export interface EventFormData {
  notes: string
  users: ReadonlyArray<UserDto>
  locations: ReadonlyArray<LocationDto>
  selectedLocation: LocationDto | null
  selectedUserNames: string[]
  todoId?: string
}

export interface DatePickerEventFormData {
  notes: string
  users: ReadonlyArray<UserDto>
  selectedUserNames: string[]
  locations: ReadonlyArray<LocationDto>
  selectedLocation: LocationDto | null
  start?: Date
  end?: Date
}

interface EventCalendarProps {
  meetings: ReadonlyArray<MeetingDto>
  users: ReadonlyArray<UserDto>
  locations: ReadonlyArray<LocationDto>
}

function EventCalendar({
  meetings,
  locations,
  users,
}: Readonly<EventCalendarProps>) {
  const user = useUserContext()
  const accessLevel = useUserRoleAccessLevel() as DashboardAccessLevels

  const [openSlot, setOpenSlot] = useState(false)
  const [openDatepickerModal, setOpenDatepickerModal] = useState(false)
  const [currentEvent, setCurrentEvent] = useState<Event | IEventInfo | null>(
    null
  )
  const [eventInfoModal, setEventInfoModal] = useState(false)

  const getUsersDtoByUserNames = (userNames: ReadonlyArray<string>) => {
    return users.filter((u) => userNames.includes(u.userName))
  }

  const initialEvents = meetings
    .filter((m) => m.schedules && m.schedules.length > 0)
    .flatMap((m) => {
      return m.schedules!.map((schedule) => {
        return {
          start: new Date(schedule.startDate),
          end: new Date(schedule.endDate),
          todoId: m.id.toString(),
          _id: m.id.toString(),
          resource: null,
          users: getUsersDtoByUserNames(m.userNames),
          location: schedule.location,
          notes: m.notes,
        }
      })
    })

  const [events, setEvents] = useState<IEventInfo[]>(initialEvents)
  const [showedEvents, setShowedEvents] = useState<IEventInfo[]>(initialEvents)
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
          events.filter((e) => e.users.map((user) => user.id).includes(user.id))
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
  const initialEventFormState = {
    notes: '',
    users: users,
    selectedUserNames: accessLevel.createOther ? [] : [user.userName],
    locations: locations,
    selectedLocation: null,
    todoId: undefined,
  }
  const [eventFormData, setEventFormData] = useState<EventFormData>(
    initialEventFormState
  )

  const initialDatePickerEventFormData: DatePickerEventFormData = {
    notes: '',
    users: users,
    selectedUserNames: accessLevel.createOther ? [] : [user.userName],
    locations: locations,
    selectedLocation: null,
    start: undefined,
    end: undefined,
  }
  const [datePickerEventFormData, setDatePickerEventFormData] =
    useState<DatePickerEventFormData>(initialDatePickerEventFormData)

  const upperCourtColor = '#ff9800'
  const lowerCourtColor = '#8bc34a'
  const handleSelectSlot = (event: Event) => {
    setOpenSlot(true)
    setCurrentEvent(event)
  }

  const handleSelectEvent = (event: IEventInfo) => {
    setCurrentEvent(event)
    setEventInfoModal(true)
  }

  const handleEventModalClose = () => {
    setEventFormData(initialEventFormState)
    setOpenSlot(false)
  }

  const handleDatePickerClose = () => {
    setDatePickerEventFormData(initialDatePickerEventFormData)
    setOpenDatepickerModal(false)
  }

  const onAddEvent = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    createMeeting({
      priceExcepted: 0,
      createdByExternalRefId: '1',
      schedule: {
        startDate: currentEvent?.start,
        endDate: currentEvent?.end,
        locationId: eventFormData.selectedLocation!.id,
      },
      userNames: eventFormData.selectedUserNames,
      notes: eventFormData.notes,
    }).then((meeting) => {
      const {
        selectedUserNames,
        users,
        selectedLocation,
        ...eventFormDataWithoutUsers
      } = eventFormData
      const newEvents = [
        ...events,
        {
          ...eventFormDataWithoutUsers,
          _id: meeting.id.toString(),
          start: currentEvent?.start,
          end: currentEvent?.end,
          users: getUsersDtoByUserNames(meeting.userNames),
          location: meeting.schedules![0].location,
          notes: meeting.notes,
        },
      ]
      setEvents(newEvents)
      handleEventModalClose()
    })
  }

  const onAddEventFromDatePicker = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()

    const setSecondsToZero = (date: Date | undefined) => {
      if (!date) {
        return undefined
      }
      date.setSeconds(0)
      return date
    }
    createMeeting({
      priceExcepted: 0,
      createdByExternalRefId: '1',
      schedule: {
        startDate: setSecondsToZero(datePickerEventFormData.start),
        endDate: setSecondsToZero(datePickerEventFormData.end),
        locationId: datePickerEventFormData.selectedLocation!.id,
      },
      userNames: datePickerEventFormData.selectedUserNames,
      notes: datePickerEventFormData.notes,
    }).then((meeting) => {
      const newEvents = [
        ...events,
        {
          ...datePickerEventFormData,
          _id: meeting.id.toString(),
          start: setSecondsToZero(datePickerEventFormData.start),
          end: setSecondsToZero(datePickerEventFormData.end),
          users: getUsersDtoByUserNames(meeting.userNames),
          location: meeting.schedules![0].location,
        },
      ]
      setEvents(newEvents)
      setDatePickerEventFormData(initialDatePickerEventFormData)
      handleDatePickerClose()
    })
  }

  const onDeleteEvent = () => {
    const currentEventInfo = currentEvent as IEventInfo
    deleteMeetings([parseInt(currentEventInfo._id)]).then((count) => {
      if (count.count === 1) {
        setShowedEvents(() =>
          [...showedEvents].filter((e) => e._id !== currentEventInfo._id)
        )
        setEventInfoModal(false)
      } else {
        throw Error('Meeting could not be deleted')
      }
    })
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
          <CardHeader subheader="Court Reservations Made Easy: Book and Manage Your Matches" />
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
                variant="contained"
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
              open={openSlot}
              handleClose={handleEventModalClose}
              eventFormData={eventFormData}
              setEventFormData={setEventFormData}
              onAddEvent={onAddEvent}
            />
            <AddDatePickerEventModal
              open={openDatepickerModal}
              handleClose={handleDatePickerClose}
              datePickerEventFormData={datePickerEventFormData}
              setDatePickerEventFormData={setDatePickerEventFormData}
              onAddEvent={onAddEventFromDatePicker}
            />
            <EventInfoModal
              open={eventInfoModal}
              handleClose={() => {
                setEventInfoModal(false)
              }}
              onDeleteEvent={onDeleteEvent}
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
                const color =
                  event.location.name === 'Upper Court'
                    ? upperCourtColor
                    : lowerCourtColor
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

export default EventCalendar
