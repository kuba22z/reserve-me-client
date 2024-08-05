import Button, { ButtonProps } from '@mui/material/Button'
import { Plus as PlusIcon } from '@phosphor-icons/react/dist/ssr/Plus'
import * as React from 'react'

const ReserveMeBtn = ({ children, ...props }: ButtonProps) => {
  return (
    <Button
      {...props}
      size={'medium'}
      startIcon={<PlusIcon fontSize="var(--icon-fontSize-md)" />}
      variant="contained"
    >
      {children}
    </Button>
  )
}

export default ReserveMeBtn
