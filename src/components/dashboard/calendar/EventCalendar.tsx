'use client'
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

import { Calendar, type Event, momentLocalizer } from 'react-big-calendar'

import moment from 'moment-timezone'

import 'react-big-calendar/lib/css/react-big-calendar.css'

import EventInfo from './EventInfo'
import AddEventModal from './AddEventModal'
import EventInfoModal from './EventInfoModal'
import { AddTodoModal } from './AddTodoModal'
import AddDatePickerEventModal from './AddDatePickerEventModal'
import 'moment/locale/de'
import {
  CounterDto,
  CreateMeetingDto,
  MeetingDto,
  UserDto,
} from '@/gql/__generated__/types'

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
  todoId?: string
}

export interface EventFormData {
  users: ReadonlyArray<UserDto>
  selectedUserNames: string[]
  todoId?: string
}

export interface DatePickerEventFormData {
  users: ReadonlyArray<UserDto>
  selectedUserNames: string[]
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
  createMeeting: (meeting: CreateMeetingDto) => Promise<MeetingDto>
  deleteMeetings: (ids: number[]) => Promise<CounterDto>
}

function EventCalendar({
  meetings,
  createMeeting,
  deleteMeetings,
  users,
}: EventCalendarProps) {
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

  const [events, setEvents] = useState<IEventInfo[]>(
    meetings
      .filter((m) => m.schedules && m.schedules.length > 0)
      .map((m) => {
        const schedule = m.schedules![0]
        return {
          start: new Date(schedule.startDate),
          end: new Date(schedule.endDate),
          allDay: false,
          todoId: m.id.toString(),
          _id: m.id.toString(),
          resource: null,
          users: getUsersDtoByUserNames(m.userNames),
        }
      })
  )
  const [todos, setTodos] = useState<ITodo[]>([])

  const initialEventFormState = {
    users: users,
    selectedUserNames: [],
    todoId: undefined,
  }
  const [eventFormData, setEventFormData] = useState<EventFormData>(
    initialEventFormState
  )

  const initialDatePickerEventFormData: DatePickerEventFormData = {
    users: users,
    selectedUserNames: [],
    todoId: undefined,
    allDay: false,
    start: undefined,
    end: undefined,
  }
  const [datePickerEventFormData, setDatePickerEventFormData] =
    useState<DatePickerEventFormData>(initialDatePickerEventFormData)

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
        locationId: 585,
      },
      userNames: eventFormData.selectedUserNames,
    }).then((meeting) => {
      const { selectedUserNames, users, ...eventFormDataWithoutUsers } =
        eventFormData
      const newEvents: IEventInfo[] = [
        ...events,
        {
          ...eventFormDataWithoutUsers,
          _id: meeting.id.toString(),
          start: currentEvent?.start,
          end: currentEvent?.end,
          users: getUsersDtoByUserNames(meeting.userNames),
        },
      ]
      setEvents(newEvents)
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
        locationId: 585,
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
      }

      const newEvents = [...events, data]

      setEvents(newEvents)
      setDatePickerEventFormData(initialDatePickerEventFormData)
    })
  }

  const onDeleteEvent = () => {
    const currentEventInfo = currentEvent as IEventInfo
    deleteMeetings([parseInt(currentEventInfo._id)]).then((count) => {
      if (count.count === 1) {
        setEvents(() =>
          [...events].filter((e) => e._id !== currentEventInfo._id)
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
        py: 8,
      }}
    >
      <Container maxWidth={false}>
        <Card>
          <CardHeader
            title="Calendar"
            subheader="Create Events and Todos and manage them easily"
          />
          <Divider />
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <ButtonGroup
                size="large"
                variant="contained"
                aria-label="outlined primary button group"
              >
                <Button
                  onClick={() => {
                    setOpenDatepickerModal(true)
                  }}
                  size="small"
                  variant="contained"
                >
                  Add event
                </Button>
                <Button
                  onClick={() => {
                    setOpenTodoModal(true)
                  }}
                  size="small"
                  variant="contained"
                >
                  Create todo
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
              events={events}
              onSelectEvent={handleSelectEvent}
              onSelectSlot={handleSelectSlot}
              selectable
              startAccessor="start"
              components={{ event: EventInfo }}
              endAccessor="end"
              defaultView="week"
              eventPropGetter={(event) => {
                const hasTodo = todos.find((todo) => todo._id === event.todoId)
                return {
                  style: {
                    backgroundColor: hasTodo ? hasTodo.color : '#b64fc8',
                    borderColor: hasTodo ? hasTodo.color : '#b64fc8',
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
