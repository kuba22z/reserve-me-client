import React, { ChangeEvent, Dispatch, MouseEvent, SetStateAction } from 'react'
import {
  Autocomplete,
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  Typography,
} from '@mui/material'

import { DateTimePicker, LocalizationProvider } from '@mui/x-date-pickers'
import { DatePickerEventFormData, ITodo } from './EventCalendar'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'

interface IProps {
  open: boolean
  handleClose: Dispatch<SetStateAction<void>>
  datePickerEventFormData: DatePickerEventFormData
  setDatePickerEventFormData: Dispatch<SetStateAction<DatePickerEventFormData>>
  onAddEvent: (e: MouseEvent<HTMLButtonElement>) => void
  todos: ITodo[]
}

const AddDatePickerEventModal = ({
  open,
  handleClose,
  datePickerEventFormData,
  setDatePickerEventFormData,
  onAddEvent,
  todos,
}: IProps) => {
  const {
    users,
    selectedUserNames,
    locations,
    selectedLocation,
    start,
    end,
    allDay,
  } = datePickerEventFormData

  const onClose = () => {
    handleClose()
  }

  const onChange = (event: ChangeEvent<HTMLInputElement>) => {
    setDatePickerEventFormData((prevState) => ({
      ...prevState,
      [event.target.name]: event.target.value,
    }))
  }

  const handleCheckboxChange = (event: ChangeEvent<HTMLInputElement>) => {
    setDatePickerEventFormData((prevState) => ({
      ...prevState,
      allDay: event.target.checked,
    }))
  }

  const handleTodoChange = (e: React.SyntheticEvent, value: ITodo | null) => {
    setDatePickerEventFormData((prevState) => ({
      ...prevState,
      todoId: value?._id,
    }))
  }

  const isDisabled = () => {
    const checkend = () => {
      if (!allDay && end === null) {
        return true
      }
    }
    if (
      selectedUserNames.length === 0 ||
      selectedLocation === null ||
      start === null ||
      checkend()
    ) {
      return true
    }
    return false
  }

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Add event</DialogTitle>
      <DialogContent>
        <DialogContentText>
          To add a event, please fill in the information below.
        </DialogContentText>
        <Box component="form">
          <TextField
            name="description"
            value={''}
            margin="dense"
            required={false}
            id="description"
            label="Description"
            type="text"
            fullWidth
            variant="outlined"
            onChange={onChange}
          />
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
                value={start}
                ampm={true}
                minutesStep={30}
                onChange={(newValue) =>
                  setDatePickerEventFormData((prevState) => ({
                    ...prevState,
                    start: new Date(newValue!),
                  }))
                }
              />
            </Box>

            <Box>
              <Typography variant="caption" color="text" component={'span'}>
                All day?
              </Typography>
              <Checkbox onChange={handleCheckboxChange} value={allDay} />
            </Box>

            <DateTimePicker
              label="End date"
              disabled={allDay}
              minDate={start}
              minutesStep={30}
              ampm={true}
              value={allDay ? null : end}
              onChange={(newValue) =>
                setDatePickerEventFormData((prevState) => ({
                  ...prevState,
                  end: new Date(newValue!),
                }))
              }
            />
          </LocalizationProvider>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button color="error" onClick={onClose}>
          Cancel
        </Button>
        <Button disabled={isDisabled()} color="success" onClick={onAddEvent}>
          Add
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default AddDatePickerEventModal
