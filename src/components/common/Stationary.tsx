import * as React from 'react'
import { isMobileDevice } from '@/lib/isMobileDevice'

interface StationaryProps {
  children: React.ReactNode
}

const Stationary: React.FC<StationaryProps> = ({ children }) => {
  const isMobile = isMobileDevice()
  return <>{!isMobile ? children : <></>}</>
}

export default Stationary
