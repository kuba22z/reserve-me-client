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

import { DateTimePicker, LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { useTheme } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'
import useUserRoleAccessLevel from '@/hooks/use-user-role-access-level'
import { DashboardAccessLevels } from '@/role-permissions'
import { createMeeting } from '@/operations/meeting/create-meetings'
import {
  getUsersDtoByUserNames,
  IEventInfo,
} from '@/components/dashboard/calendar/EventCalendarUtils'
import { LocationDto, UserDto } from '@/gql/__generated__/types'
import { useUserContext } from '@/components/core/UserProvider'

interface IProps {
  open: boolean
  users: ReadonlyArray<UserDto>
  locations: ReadonlyArray<LocationDto>
  onAddEvent: (e: IEventInfo) => void
  close: () => void
}

interface DatePickerEventFormData {
  notes: string
  selectedUserNames: string[]
  selectedLocation: LocationDto | null
  start?: Date
  end?: Date
}

const AddDatePickerEventModal = ({
  users,
  locations,
  onAddEvent,
  open,
  close,
}: IProps) => {
  const theme = useTheme()
  const user = useUserContext()
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'))
  const accessLevel = useUserRoleAccessLevel() as DashboardAccessLevels

  const initialDatePickerEventFormData: DatePickerEventFormData = {
    notes: '',
    selectedUserNames: accessLevel.createOther ? [] : [user.userName],
    selectedLocation: null,
    start: undefined,
    end: undefined,
  }

  const [datePickerEventFormData, setDatePickerEventFormData] =
    useState<DatePickerEventFormData>(initialDatePickerEventFormData)
  const { selectedUserNames, selectedLocation, start, end, notes } =
    datePickerEventFormData

  const onChange = (event: ChangeEvent<HTMLInputElement>) => {
    setDatePickerEventFormData((prevState) => ({
      ...prevState,
      [event.target.name]: event.target.value,
    }))
  }

  const isDisabled = () => {
    const checkend = () => {
      if (end === null) {
        return true
      }
    }
    return (
      selectedUserNames.length === 0 ||
      selectedLocation === null ||
      start === null ||
      checkend()
    )
  }
  const onClose = () => {
    close()
    setDatePickerEventFormData(initialDatePickerEventFormData)
  }

  const createEvent = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()

    const setMinToZero = (date: any) => {
      date.setSeconds(0)
      return date
    }
    createMeeting({
      priceExcepted: 0,
      createdByExternalRefId: '1',
      schedule: {
        startDate: setMinToZero(start),
        endDate: setMinToZero(end),
        locationId: selectedLocation!.id,
      },
      userNames: selectedUserNames,
      notes: notes,
    }).then((meeting) => {
      onAddEvent({
        ...datePickerEventFormData,
        _id: meeting.id.toString(),
        start: setMinToZero(start),
        end: setMinToZero(end),
        users: getUsersDtoByUserNames(users, meeting.userNames),
        location: meeting.schedules![0].location,
      })
      setDatePickerEventFormData(datePickerEventFormData)
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
            value={notes}
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
              options={users.map((u) => u)}
              onChange={(event, value, reason, details) => {
                setDatePickerEventFormData((prevState) => ({
                  ...prevState,
                  selectedUserNames: value.map((u) => u.userName),
                }))
              }}
              getOptionLabel={(option) => option.name}
              getOptionKey={(option) => option.userName}
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
              setDatePickerEventFormData((prevState) => ({
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
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <Box mb={2} mt={5}>
              <DateTimePicker
                label="Start date"
                value={start ?? null}
                ampm={true}
                minutesStep={30}
                onChange={(newValue) =>
                  setDatePickerEventFormData((prevState) => ({
                    ...prevState,
                    start: newValue ? new Date(newValue) : undefined,
                  }))
                }
              />
            </Box>
            <DateTimePicker
              label="End date"
              minDate={start}
              minutesStep={30}
              ampm={true}
              value={end ?? null}
              onChange={(newValue) => {
                const selectedDate = newValue ? new Date(newValue) : undefined
                if (selectedDate && start && selectedDate <= start) {
                  alert('End date cannot be before start date!')
                  return
                }
                setDatePickerEventFormData((prevState) => ({
                  ...prevState,
                  end: selectedDate,
                }))
              }}
            />
          </LocalizationProvider>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button color="error" onClick={onClose}>
          Cancel
        </Button>
        <Button disabled={isDisabled()} color="success" onClick={createEvent}>
          Add
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default AddDatePickerEventModal
