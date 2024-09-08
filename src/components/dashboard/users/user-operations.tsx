'use client'

import * as React from 'react'
import { useState } from 'react'
import Stack from '@mui/material/Stack'
import Button from '@mui/material/Button'
import { Plus as PlusIcon } from '@phosphor-icons/react/dist/ssr/Plus'
import Dialog from '@mui/material/Dialog'
import { AccountDetailsForm } from '@/components/dashboard/account/account-details-form'
import BottomNavigationAction from '@mui/material/BottomNavigationAction/BottomNavigationAction'
import AddIcon from '@mui/icons-material/Add'
import { BottomNav } from '@/components/dashboard/layout/bottom-nav'

interface UserOperationsProps {
  isMobile: boolean
}

export function UserOperations({
  isMobile,
}: UserOperationsProps): React.JSX.Element {
  const [openCreateUserModal, setOpenCreateUserModal] = useState(false)
  const handleClickOpen = () => {
    setOpenCreateUserModal(true)
  }

  const handleClose = () => {
    setOpenCreateUserModal(false)
  }

  return (
    <>
      <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
        {isMobile ? (
          <BottomNav>
            <BottomNavigationAction
              onClick={handleClickOpen}
              label="Add"
              icon={<AddIcon />}
            />
          </BottomNav>
        ) : (
          <Button
            size={'medium'}
            startIcon={<PlusIcon fontSize="var(--icon-fontSize-md)" />}
            variant="contained"
            onClick={handleClickOpen}
          >
            Add
          </Button>
        )}
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
        fullScreen={isMobile}
        open={openCreateUserModal}
        onClose={handleClose}
        aria-labelledby="responsive-dialog-title"
      >
        <AccountDetailsForm handleClose={handleClose} />
      </Dialog>
    </>
  )
}
