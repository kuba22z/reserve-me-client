'use client'

import * as React from 'react'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardActions from '@mui/material/CardActions'
import CardContent from '@mui/material/CardContent'
import CardHeader from '@mui/material/CardHeader'
import Divider from '@mui/material/Divider'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import OutlinedInput from '@mui/material/OutlinedInput'
import Grid from '@mui/material/Unstable_Grid2'
import { createUser } from '@/operations/user/create-user'

const states = [
  { value: 'alabama', label: 'Alabama' },
  { value: 'new-york', label: 'New York' },
  { value: 'san-francisco', label: 'San Francisco' },
  { value: 'los-angeles', label: 'Los Angeles' },
] as const

interface AccountDetailsFormProps {
  handleClose?: () => void
}

interface FormState {
  username: string
  phoneNumber: string
  name: string
}

export function AccountDetailsForm({
  handleClose,
}: AccountDetailsFormProps): React.JSX.Element {
  const [formState, setFormState] = React.useState<FormState>({
    username: '',
    phoneNumber: '',
    name: '',
  })

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target
    setFormState((prevState) => ({
      ...prevState,
      [name]: value,
    }))
  }

  return (
    <form
      onSubmit={async (event) => {
        event.preventDefault()
        await createUser({
          userName: formState.username,
          name: formState.name,
          phoneNumber: formState.phoneNumber,
        })
        if (handleClose) handleClose()
      }}
    >
      <Card>
        <CardHeader subheader="The information can be edited" title="Profile" />
        <Divider />
        <CardContent>
          <Grid container spacing={3}>
            <Grid md={6} xs={12}>
              <FormControl fullWidth required>
                <InputLabel>User Name</InputLabel>
                <OutlinedInput
                  value={formState.username}
                  label="Username"
                  name="username"
                  required
                  onChange={handleInputChange}
                />
              </FormControl>
            </Grid>
            <Grid md={6} xs={12}>
              <FormControl fullWidth>
                <InputLabel>Phone number</InputLabel>
                <OutlinedInput
                  value={formState.phoneNumber}
                  label="Phone number"
                  name="phoneNumber"
                  type="tel"
                  required
                  onChange={handleInputChange}
                />
              </FormControl>
            </Grid>
            <Grid md={6} xs={12}>
              <FormControl fullWidth required>
                <InputLabel>Name</InputLabel>
                <OutlinedInput
                  value={formState.name}
                  label="Name"
                  name="name"
                  required
                  onChange={handleInputChange}
                />
              </FormControl>
            </Grid>
            {/*<Grid md={6} xs={12}>*/}
            {/*  <FormControl fullWidth required>*/}
            {/*    <InputLabel>Email address</InputLabel>*/}
            {/*    <OutlinedInput*/}
            {/*      defaultValue="sofia@devias.io"*/}
            {/*      label="Email address"*/}
            {/*      name="email"*/}
            {/*    />*/}
            {/*  </FormControl>*/}
            {/*</Grid>*/}
          </Grid>
        </CardContent>
        <Divider />
        <CardActions sx={{ justifyContent: 'flex-end' }}>
          {handleClose ? (
            <Button variant="contained" onClick={handleClose}>
              Exit
            </Button>
          ) : (
            <></>
          )}
          <Button type={'submit'} variant="contained">
            Save details
          </Button>
        </CardActions>
      </Card>
    </form>
  )
}
