import type { Event } from 'react-big-calendar'
import { Maybe } from '@graphql-tools/utils'
import assert from 'assert'
import { LocationDto, UserDto } from '@/gql/__generated__/types'

export const upperCourtColor = '#ffa700'
export const lowerCourtColor = '#82c331'
export const totalCourtColor = '#ca1d1d'

export interface IEventInfo extends Event {
  _id: string
  users: UserDto[]
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
  assert(userNames)
  return users.filter((u) => userNames.includes(u.userName))
}
