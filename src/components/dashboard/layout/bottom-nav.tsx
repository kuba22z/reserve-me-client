'use client'

import * as React from 'react'
import { ReactNode } from 'react'
import BottomNavigation from '@mui/material/BottomNavigation'
import BottomNavigationAction from '@mui/material/BottomNavigationAction/BottomNavigationAction'
import Paper from '@mui/material/Paper'
import Box from '@mui/material/Box'
import PeopleIcon from '@mui/icons-material/People'
import { paths } from '@/paths'
import HomeIcon from '@mui/icons-material/Home'

export type PropsWithChildren<P> = P & { children?: ReactNode }
interface BottomNavProps {
  openAddEventModal?: () => void
}

export function BottomNav({
  openAddEventModal,
  children,
}: PropsWithChildren<BottomNavProps>): React.JSX.Element {
  const [value, setValue] = React.useState(0)
  const ref = React.useRef<HTMLDivElement>(null)
  React.useEffect(() => {
    ;(ref.current as HTMLDivElement).ownerDocument.body.scrollTop = 0
  }, [value])

  return (
    <Box sx={{ pb: 7 }} ref={ref}>
      <Paper
        sx={{ position: 'fixed', bottom: 0, left: 0, right: 0 }}
        elevation={3}
      >
        <BottomNavigation
          showLabels
          value={value}
          onChange={(event, newValue) => {
            setValue(newValue)
          }}
        >
          <BottomNavigationAction
            href={paths.dashboard.overview}
            label="Home"
            icon={<HomeIcon />}
          />
          {/*<BottomNavigationAction label="Favorites" icon={<FavoriteIcon />} />*/}
          {children}
          <BottomNavigationAction
            href={paths.dashboard.account}
            label="User"
            icon={<PeopleIcon />}
          />
        </BottomNavigation>
      </Paper>
    </Box>
  )
}
