import { Typography } from '@mui/material'
import { IEventInfo } from './EventCalendar'

interface IProps {
  event: IEventInfo
}

const EventInfo = ({ event }: IProps) => {
  return (
    <>
      <Typography>{event.users.map((a) => a.name).join(',')}</Typography>
      <Typography>{event.location.name}</Typography>
    </>
  )
}

export default EventInfo
