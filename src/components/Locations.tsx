'use client'
import { LocationDto } from '@/gql/__generated__/types'
import React from 'react'

export function Locations({
  locations,
}: {
  locations: void | readonly Partial<LocationDto>[]
}) {
  return <div>{locations ? locations.map((a) => a.city + ' ') : ''}</div>
}
