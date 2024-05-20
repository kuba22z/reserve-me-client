'use client'
import { Button } from '@mui/base'

export default function MyButton({
  children,
  onClick,
}: Readonly<{
  children: React.ReactNode
  onClick: () => void
}>) {
  return <Button onClick={(e) => onClick()}>{children}</Button>
}
