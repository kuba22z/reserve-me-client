'use client'
import { Button } from '@mui/base'
import { useLocationStore } from '@/operations/locationStore'

export default function MyButtonStore({
  children,
}: Readonly<{
  children?: React.ReactNode
}>) {
  const newCity = 'test123'
  const d = {
    city: newCity,
    postalCode: '3123',
    name: Math.random().toString(),
    street: '123',
    houseNumber: 1,
  }

  const createLocation = useLocationStore((state) => state.addLocation2)
  return <Button onClick={(e) => createLocation()}>{children}</Button>
}
