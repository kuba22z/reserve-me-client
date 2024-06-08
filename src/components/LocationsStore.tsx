'use client'
import React, { useEffect } from 'react'
import { useLocationStore } from '@/operations/locationStore'
import { LocationDto } from '@/gql/__generated__/types'

export function LocationsStore() {
  const locations = useLocationStore<LocationDto[]>((state) => state.locations)
  const getLocations = useLocationStore((state) => state.getLocations)

  useEffect(() => {
    console.log('sd')
    getLocations()
  }, [])

  return <div>{locations ? locations.map((a) => a.city + ' ') : ''}</div>
}
