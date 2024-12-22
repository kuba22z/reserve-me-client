import { Dispatch, SetStateAction } from 'react'
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from '@mui/material'
import useUserRoleAccessLevel from '@/hooks/use-user-role-access-level'
import { DashboardAccessLevels } from '@/role-permissions'
import { useUserContext } from '@/components/core/UserProvider'
import { deleteMeetings } from '@/operations/meeting/delete-meetings'
import { IEventInfo } from '@/components/dashboard/calendar/EventCalendarUtils'

interface IProps {
  open: boolean
  handleClose: Dispatch<SetStateAction<void>>
  onDeleteEvent: (e: IEventInfo) => void
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

  const deleteEvent = () => {
    const currentEventInfo = currentEvent as IEventInfo
    deleteMeetings([parseInt(currentEventInfo._id)]).then((count) => {
      if (count.count === 1) {
        onDeleteEvent(currentEventInfo)
      } else {
        throw Error('Meeting could not be deleted')
      }
    })
  }

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Event Info</DialogTitle>
      <DialogContent>
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
        {currentEvent && currentEvent.notes ? (
          <Typography
            sx={{ fontSize: 14, marginTop: 3 }}
            color="text.secondary"
            gutterBottom
          >
            Notes: {currentEvent.notes}
          </Typography>
        ) : (
          <></>
        )}
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
          <Button color="info" onClick={deleteEvent}>
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
