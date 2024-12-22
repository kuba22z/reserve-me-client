import { Typography } from '@mui/material'
import { IEventInfo } from '@/components/dashboard/calendar/EventCalendarUtils'

interface IProps {
  event: IEventInfo
}

const EventInfo = ({ event }: IProps) => {
  return (
    <>
      <Typography sx={{ lineHeight: '1.25' }}>
        {event.users ? event.users.map((u) => u.name).join(',') : 'reserved'}
      </Typography>
      <Typography sx={{ lineHeight: '1.25' }}>{event.location.name}</Typography>
    </>
  )
}

export default EventInfo
