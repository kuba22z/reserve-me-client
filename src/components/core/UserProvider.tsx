'use client'
import * as React from 'react'
import { createContext, useContext } from 'react'
import { UserWithGroupDto } from '@/gql/__generated__/types'

export interface UserProviderProps {
  children: React.ReactNode
  user: UserWithGroupDto
}
const UserContext = createContext<UserWithGroupDto | null>(null)

export function UserProvider({
  children,
  user,
}: UserProviderProps): React.JSX.Element {
  return <UserContext.Provider value={user}>{children}</UserContext.Provider>
}

export const useUserContext = () => useContext(UserContext)!
