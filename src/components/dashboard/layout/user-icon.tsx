'use client'

import * as React from 'react'
import Avatar from '@mui/material/Avatar'
import { UserPopover } from '@/components/dashboard/layout/user-popover'
import { usePopover } from '@/hooks/use-popover'

export function UserIcon(): React.JSX.Element {
  const userPopover = usePopover<HTMLDivElement>()
  return (
    <>
      <Avatar
        onClick={userPopover.handleOpen}
        ref={userPopover.anchorRef}
        src="/assets/avatar.png"
        sx={{ cursor: 'pointer' }}
      />
      <UserPopover
        anchorEl={userPopover.anchorRef.current}
        onClose={userPopover.handleClose}
        open={userPopover.open}
      />
    </>
  )
}
