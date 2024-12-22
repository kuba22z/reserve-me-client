import { Typography } from '@mui/material'
import { IEventInfo } from '@/components/dashboard/calendar/EventCalendarUtils'

interface IProps {
  event: IEventInfo
}

const EventInfo = ({ event }: IProps) => {
  return (
    <>
      <Typography sx={{ lineHeight: '1.25' }}>
        {event.users.map((a) => a.name).join(',')}
      </Typography>
      <Typography sx={{ lineHeight: '1.25' }}>{event.location.name}</Typography>
    </>
  )
}

export default EventInfo
