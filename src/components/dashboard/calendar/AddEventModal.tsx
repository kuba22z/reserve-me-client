import React, { ChangeEvent, Dispatch, MouseEvent, SetStateAction } from 'react'
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
import { EventFormData, ITodo } from './EventCalendar'
import { useTheme } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'

interface IProps {
  open: boolean
  handleClose: Dispatch<SetStateAction<void>>
  eventFormData: EventFormData
  setEventFormData: Dispatch<SetStateAction<EventFormData>>
  onAddEvent: (e: MouseEvent<HTMLButtonElement>) => void
  todos: ITodo[]
}

const AddEventModal = ({
  open,
  handleClose,
  eventFormData,
  setEventFormData,
  onAddEvent,
  todos,
}: IProps) => {
  const { selectedUserNames, users, selectedLocation, locations } =
    eventFormData
  const theme = useTheme()
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'))
  const onClose = () => handleClose()

  const onChange = (event: ChangeEvent<HTMLInputElement>) => {
    setEventFormData((prevState) => ({
      ...prevState,
      [event.target.name]: event.target.value,
    }))
  }

  const handleTodoChange = (e: React.SyntheticEvent, value: ITodo | null) => {
    setEventFormData((prevState) => ({
      ...prevState,
      todoId: value?._id,
    }))
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
          onClick={onAddEvent}
        >
          Add
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default AddEventModal
