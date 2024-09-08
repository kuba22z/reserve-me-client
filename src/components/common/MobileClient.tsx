'use client'

import * as React from 'react'
import { useMobile } from '@/hooks/use-mobile'

interface MobileProps {
  children: React.ReactNode
}

const MobileClient: React.FC<MobileProps> = ({ children }) => {
  return <>{useMobile() ? children : <></>}</>
}

export default MobileClient
