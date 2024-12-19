import * as React from 'react'
import { isMobileDevice } from '@/lib/isMobileDevice'

interface StationaryProps {
  children: React.ReactNode
}

const Stationary: React.FC<StationaryProps> = async ({ children }) => {
  const isMobile = await isMobileDevice()
  return <>{!isMobile ? children : <></>}</>
}

export default Stationary
