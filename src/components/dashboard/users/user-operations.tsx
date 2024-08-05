'use client'

import * as React from 'react'
import { useState } from 'react'
import Stack from '@mui/material/Stack'
import Button from '@mui/material/Button'
import { Plus as PlusIcon } from '@phosphor-icons/react/dist/ssr/Plus'
import useMediaQuery from '@mui/material/useMediaQuery'
import { useTheme } from '@mui/material/styles'
import Dialog from '@mui/material/Dialog'
import { AccountDetailsForm } from '@/components/dashboard/account/account-details-form'

export function UserOperations(): React.JSX.Element {
  const [openCreateUserModal, setOpenCreateUserModal] = useState(false)
  const theme = useTheme()
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'))
  const handleClickOpen = () => {
    setOpenCreateUserModal(true)
  }

  const handleClose = () => {
    setOpenCreateUserModal(false)
  }

  return (
    <>
      <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
        <Button
          size={'medium'}
          startIcon={<PlusIcon fontSize="var(--icon-fontSize-md)" />}
          variant="contained"
          onClick={handleClickOpen}
        >
          Add
        </Button>
        {/*<Button*/}
        {/*  color="inherit"*/}
        {/*  startIcon={<UploadIcon fontSize="var(--icon-fontSize-md)" />}*/}
        {/*>*/}
        {/*  Import*/}
        {/*</Button>*/}
        {/*<Button*/}
        {/*  color="inherit"*/}
        {/*  startIcon={<DownloadIcon fontSize="var(--icon-fontSize-md)" />}*/}
        {/*>*/}
        {/*  Export*/}
        {/*</Button>*/}
      </Stack>
      <Dialog
        fullScreen={fullScreen}
        open={openCreateUserModal}
        onClose={handleClose}
        aria-labelledby="responsive-dialog-title"
      >
        <AccountDetailsForm handleClose={handleClose} />
      </Dialog>
    </>
  )
}
