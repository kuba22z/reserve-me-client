'use client'
import * as React from 'react'
import { createContext, useContext } from 'react'
import { UserDto } from '@/gql/__generated__/types'

export interface UserProviderProps {
  children: React.ReactNode
  user: UserDto
}
const UserContext = createContext<UserDto | null>(null)

export function UserProvider({
  children,
  user,
}: UserProviderProps): React.JSX.Element {
  return <UserContext.Provider value={user}>{children}</UserContext.Provider>
}

export const useUserContext = () => useContext(UserContext)!
