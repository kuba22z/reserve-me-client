import React, { ChangeEvent, MouseEvent, useState } from 'react'
import {
  Autocomplete,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
} from '@mui/material'
import { useTheme } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'
import useUserRoleAccessLevel from '@/hooks/use-user-role-access-level'
import { DashboardAccessLevels } from '@/role-permissions'
import { LocationDto, UserDto } from '@/gql/__generated__/types'
import {
  getUsersDtoByUserNames,
  IEventInfo,
} from '@/components/dashboard/calendar/EventCalendarUtils'
import { useUserContext } from '@/components/core/UserProvider'
import { createMeeting } from '@/operations/meeting/create-meetings'

interface IProps {
  open: boolean
  users: ReadonlyArray<UserDto>
  locations: ReadonlyArray<LocationDto>
  currentEvent: IEventInfo
  onAddEvent: (e: IEventInfo) => void
  close: () => void
}

interface AddEventFormData {
  notes: string
  selectedUserNames: string[]
  selectedLocation: LocationDto | null
  start?: Date
  end?: Date
}

const AddEventModal = ({
  users,
  locations,
  onAddEvent,
  open,
  close,
  currentEvent,
}: IProps) => {
  const theme = useTheme()
  const user = useUserContext()
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'))
  const accessLevel = useUserRoleAccessLevel() as DashboardAccessLevels

  const initialDatePickerEventFormData: AddEventFormData = {
    notes: '',
    selectedUserNames: accessLevel.createOther ? [] : [user.userName],
    selectedLocation: null,
    start: undefined,
    end: undefined,
  }

  const [eventFormData, setEventFormData] = useState<AddEventFormData>(
    initialDatePickerEventFormData
  )
  const { selectedUserNames, selectedLocation, notes } = eventFormData

  const onChange = (event: ChangeEvent<HTMLInputElement>) => {
    setEventFormData((prevState) => ({
      ...prevState,
      [event.target.name]: event.target.value,
    }))
  }
  const onClose = () => {
    setEventFormData(initialDatePickerEventFormData)
    close()
  }

  const createEvent = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    createMeeting({
      priceExcepted: 0,
      createdByExternalRefId: '1',
      schedule: {
        startDate: currentEvent?.start,
        endDate: currentEvent?.end,
        locationId: eventFormData.selectedLocation!.id,
      },
      userNames: selectedUserNames,
      notes: notes,
    }).then((meeting) => {
      onAddEvent({
        ...eventFormData,
        _id: meeting.id.toString(),
        start: currentEvent?.start,
        end: currentEvent?.end,
        users: getUsersDtoByUserNames(users, meeting.userNames),
        location: meeting.schedules![0].location,
        notes: meeting.notes ?? undefined,
      })
      onClose()
    })
  }

  return (
    <Dialog fullScreen={fullScreen} open={open} onClose={onClose}>
      <DialogTitle>Add event</DialogTitle>
      <DialogContent>
        <DialogContentText>
          To add a event, please fill in the information below.
        </DialogContentText>
        <Box component="form">
          <TextField
            name="notes"
            margin="dense"
            required={false}
            id="notes"
            label="Notes"
            type="text"
            fullWidth
            variant="outlined"
            onChange={onChange}
          />
          {accessLevel.createOther ? (
            <Autocomplete
              multiple
              id="select-user-for-meeting"
              options={[...users]}
              getOptionLabel={(option) => option.name}
              getOptionKey={(option) => option.userName}
              onChange={(event, value, reason, details) =>
                setEventFormData((prevState) => ({
                  ...prevState,
                  selectedUserNames: value.map((u) => u.userName),
                }))
              }
              renderInput={(params) => (
                <TextField {...params} variant="standard" label="Names" />
              )}
            />
          ) : (
            <></>
          )}
          <Autocomplete
            options={locations}
            getOptionLabel={(option) => option.name}
            id="select-location"
            clearOnEscape
            onChange={(event, value, reason, details) => {
              setEventFormData((prevState) => ({
                ...prevState,
                selectedLocation: value,
              }))
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                required
                label="Location"
                variant="standard"
              />
            )}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button color="error" onClick={onClose}>
          Cancel
        </Button>
        <Button
          disabled={selectedUserNames.length === 0 || selectedLocation === null}
          color="success"
          onClick={createEvent}
        >
          Add
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default AddEventModal
