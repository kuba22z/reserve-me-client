'use client'
import { Button } from '@mui/base'
import { useMutation } from '@apollo/client'
import { CreateLocationDocument } from '@/gql/queries/create-location.generated'
import { locationsVar } from '@/gql/cache'

export default function MyButtonClient({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const newCity = 'test123'
  const d = {
    city: newCity,
    postalCode: '3123',
    name: Math.random().toString(),
    street: '123',
    houseNumber: 1,
  }

  const [createLocation] = useMutation(CreateLocationDocument)
  return (
    <Button
      onClick={(e) =>
        createLocation({
          variables: {
            location: d,
          },
        }).then((a) =>
          locationsVar([...locationsVar(), a.data!.createLocation])
        )
      }
    >
      {children}
    </Button>
  )
}
