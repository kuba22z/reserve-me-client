import { Dispatch, MouseEvent, SetStateAction } from 'react'
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Typography,
} from '@mui/material'
import { IEventInfo } from './EventCalendar'
import useUserRoleAccessLevel from '@/hooks/use-user-role-access-level'
import { DashboardAccessLevels } from '@/role-permissions'
import { useUserContext } from '@/components/core/UserProvider'

interface IProps {
  open: boolean
  handleClose: Dispatch<SetStateAction<void>>
  onDeleteEvent: (e: MouseEvent<HTMLButtonElement>) => void
  currentEvent: IEventInfo | null
}

const EventInfoModal = ({
  open,
  handleClose,
  onDeleteEvent,
  currentEvent,
}: IProps) => {
  const accessLevel = useUserRoleAccessLevel() as DashboardAccessLevels
  const user = useUserContext()
  const onClose = () => {
    handleClose()
  }

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Event Info</DialogTitle>
      <DialogContent>
        <DialogContentText>
          <Typography
            sx={{ fontSize: 14, marginTop: 3 }}
            color="text.secondary"
            gutterBottom
          >
            {currentEvent && currentEvent.users
              ? currentEvent.users.map((a) => a.name).join(',')
              : ''}
          </Typography>
          <Typography
            sx={{ fontSize: 14, marginTop: 3 }}
            color="text.secondary"
            gutterBottom
          >
            {currentEvent && currentEvent.location
              ? currentEvent.location.name
              : ''}
          </Typography>
        </DialogContentText>
        <Box component="form"></Box>
      </DialogContent>
      <DialogActions>
        <Button color="error" onClick={onClose}>
          Cancel
        </Button>
        {accessLevel.deleteOther ||
        (currentEvent &&
          currentEvent.users &&
          currentEvent.users
            .map((user) => user.userName)
            .includes(user.userName)) ? (
          <Button color="info" onClick={onDeleteEvent}>
            Delete Event
          </Button>
        ) : (
          <></>
        )}
      </DialogActions>
    </Dialog>
  )
}

export default EventInfoModal
