'use client'
import { Button } from '@mui/base'
import { CreateLocationMutation } from '@/gql/queries/create-location.generated'
import { locationsVar } from '@/gql/cache'

export default function MyButton({
  children,
  onClick,
}: Readonly<{
  children: React.ReactNode
  onClick: () => Promise<CreateLocationMutation | null | undefined> | void
}>) {
  return (
    <Button
      onClick={(e) => {
        onClick()!.then((a) => {
          if (a) {
            locationsVar([...locationsVar(), a.createLocation])
          }
          return a
        })
      }}
    >
      {children}
    </Button>
  )
}
