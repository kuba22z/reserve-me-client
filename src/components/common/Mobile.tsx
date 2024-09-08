'use server'

import * as React from 'react'
import { isMobileDevice } from '@/lib/isMobileDevice'

interface MobileProps {
  children: React.ReactNode
}

const Mobile: React.FC<MobileProps> = async ({ children }) => {
  const isMobile = isMobileDevice()

  return <>{isMobile ? children : <></>}</>
}

export default Mobile
