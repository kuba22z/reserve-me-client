'use client'
import React from 'react'
import { useReactiveVar } from '@apollo/client'
import { locationsVar } from '@/gql/cache'

export function LocationsVar() {
  const locations = useReactiveVar(locationsVar)
  return <div>{locations ? locations.map((a) => a.city + ' ') : ''}</div>
}
