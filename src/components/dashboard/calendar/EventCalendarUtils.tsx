import type { Event } from 'react-big-calendar'
import { Maybe } from '@graphql-tools/utils'
import { LocationDto, UserDto } from '@/gql/__generated__/types'

export const upperCourtColor = '#ffa700'
export const lowerCourtColor = '#82c331'
export const totalCourtColor = '#ca1d1d'
export const reservedColor = '#5e5b5b'

export const determineColor = (e: IEventInfo) => {
  if (!e.users) {
    return reservedColor
  }
  return e.location.id === 1 ? upperCourtColor : lowerCourtColor
}

export interface IEventInfo extends Event {
  _id: string
  users?: UserDto[]
  location: LocationDto
  notes?: string
}

export interface EventCalendarProps {
  initialEvents: IEventInfo[]
  users: ReadonlyArray<UserDto>
  locations: ReadonlyArray<LocationDto>
}

export const getUsersDtoByUserNames = (
  users: ReadonlyArray<UserDto>,
  userNames: Maybe<ReadonlyArray<string>>
) => {
  if (!userNames) {
    return undefined
  }
  return users.filter((u) => userNames.includes(u.userName))
}
