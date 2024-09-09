'use client'
import * as React from 'react'
import { MouseEvent, useState } from 'react'
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
import AddEventModal from './AddEventModal'
import EventInfoModal from './EventInfoModal'
import { AddTodoModal } from './AddTodoModal'
import AddDatePickerEventModal from './AddDatePickerEventModal'
import 'moment/locale/de'
import { LocationDto, MeetingDto, UserDto } from '@/gql/__generated__/types'
import EventInfo from '@/components/dashboard/calendar/EventInfo'
import { Plus as PlusIcon } from '@phosphor-icons/react/dist/ssr/Plus'
import { useUserContext } from '@/components/core/UserProvider'
import useUserRoleAccessLevel from '@/hooks/use-user-role-access-level'
import { DashboardAccessLevels } from '@/role-permissions'
import { deleteMeetings } from '@/operations/meeting/deleteMeetings'
import { createMeeting } from '@/operations/meeting/createMeetings'

// const locales = {
//   "en-US": enUS,
// }
// Set the IANA time zone you want to use
//moment.tz.setDefault('Europe/Paris')
const localizer = momentLocalizer(moment) // or globalizeLocalizer
export interface ITodo {
  _id: string
  title: string
  color?: string
}

export interface IEventInfo extends Event {
  _id: string
  users: UserDto[]
  location: LocationDto
  todoId?: string
}

export interface EventFormData {
  users: ReadonlyArray<UserDto>
  locations: ReadonlyArray<LocationDto>
  selectedLocation: LocationDto | null
  selectedUserNames: string[]
  todoId?: string
}

export interface DatePickerEventFormData {
  users: ReadonlyArray<UserDto>
  selectedUserNames: string[]
  locations: ReadonlyArray<LocationDto>
  selectedLocation: LocationDto | null
  todoId?: string
  allDay: boolean
  start?: Date
  end?: Date
}

export const generateId = () =>
  (Math.floor(Math.random() * 10000) + 1).toString()

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
  const [openTodoModal, setOpenTodoModal] = useState(false)
  const [currentEvent, setCurrentEvent] = useState<Event | IEventInfo | null>(
    null
  )
  const [eventInfoModal, setEventInfoModal] = useState(false)

  const getUsersDtoByUserNames = (userNames: ReadonlyArray<string>) => {
    return users.filter((u) => userNames.includes(u.userName))
  }
  const events = meetings
    .filter((m) => m.schedules && m.schedules.length > 0)
    .flatMap((m) => {
      return m.schedules!.map((schedule) => {
        return {
          start: new Date(schedule.startDate),
          end: new Date(schedule.endDate),
          allDay: false,
          todoId: m.id.toString(),
          _id: m.id.toString(),
          resource: null,
          users: getUsersDtoByUserNames(m.userNames),
          location: schedule.location,
        }
      })
    })

  const [showedEvents, setShowedEvents] = useState<IEventInfo[]>(events)
  const [todos, setTodos] = useState<ITodo[]>([])

  const initialEventFormState = {
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
    users: users,
    selectedUserNames: accessLevel.createOther ? [] : [user.userName],
    locations: locations,
    selectedLocation: null,
    todoId: undefined,
    allDay: false,
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

  const handleClose = () => {
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
    }).then((meeting) => {
      const {
        selectedUserNames,
        users,
        selectedLocation,
        ...eventFormDataWithoutUsers
      } = eventFormData
      const newEvents: IEventInfo[] = [
        ...showedEvents,
        {
          ...eventFormDataWithoutUsers,
          _id: meeting.id.toString(),
          start: currentEvent?.start,
          end: currentEvent?.end,
          users: getUsersDtoByUserNames(meeting.userNames),
          location: meeting.schedules![0].location,
        },
      ]
      setShowedEvents(newEvents)
      handleClose()
    })
  }

  const onAddEventFromDatePicker = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()

    const addHours = (date: Date | undefined, hours: number) => {
      return date ? date.setHours(date.getHours() + hours) : undefined
    }

    const setMinToZero = (date: any) => {
      date.setSeconds(0)

      return date
    }
    createMeeting({
      priceExcepted: 0,
      createdByExternalRefId: '1',
      schedule: {
        startDate: setMinToZero(datePickerEventFormData.start),
        endDate: datePickerEventFormData.allDay
          ? addHours(datePickerEventFormData.start, 12)
          : setMinToZero(datePickerEventFormData.end),
        locationId: datePickerEventFormData.selectedLocation!.id,
      },
      userNames: datePickerEventFormData.selectedUserNames,
    }).then((meeting) => {
      const data: IEventInfo = {
        ...datePickerEventFormData,
        _id: meeting.id.toString(),
        start: setMinToZero(datePickerEventFormData.start),
        end: datePickerEventFormData.allDay
          ? addHours(datePickerEventFormData.start, 12)
          : setMinToZero(datePickerEventFormData.end),
        users: getUsersDtoByUserNames(meeting.userNames),
        location: meeting.schedules![0].location,
      }

      const newEvents = [...showedEvents, data]

      setShowedEvents(newEvents)
      setDatePickerEventFormData(initialDatePickerEventFormData)
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
          <CardHeader subheader="Create Events and Todos and manage them easily" />
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
                  onClick={() => {
                    setShowedEvents(
                      events.filter((e) =>
                        e.users.map((user) => user.id).includes(user.id)
                      )
                    )
                  }}
                  size="medium"
                  variant="contained"
                >
                  My Meetings
                </Button>
                <Button
                  onClick={() => {
                    setShowedEvents(events)
                  }}
                  size="medium"
                  variant="contained"
                >
                  Total
                </Button>
                <Button
                  onClick={() => {
                    setShowedEvents(
                      events.filter((e) => e.location.name === 'location2')
                    )
                  }}
                  size="medium"
                  variant="contained"
                  style={{ backgroundColor: upperCourtColor }}
                >
                  Upper Court
                </Button>
                <Button
                  onClick={() => {
                    setShowedEvents(
                      events.filter((e) => e.location.name === 'location1')
                    )
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
              handleClose={handleClose}
              eventFormData={eventFormData}
              setEventFormData={setEventFormData}
              onAddEvent={onAddEvent}
              todos={todos}
            />
            <AddDatePickerEventModal
              open={openDatepickerModal}
              handleClose={handleDatePickerClose}
              datePickerEventFormData={datePickerEventFormData}
              setDatePickerEventFormData={setDatePickerEventFormData}
              onAddEvent={onAddEventFromDatePicker}
              todos={todos}
            />
            <EventInfoModal
              open={eventInfoModal}
              handleClose={() => {
                setEventInfoModal(false)
              }}
              onDeleteEvent={onDeleteEvent}
              currentEvent={currentEvent as IEventInfo}
            />
            <AddTodoModal
              open={openTodoModal}
              handleClose={() => {
                setOpenTodoModal(false)
              }}
              todos={todos}
              setTodos={setTodos}
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
