import * as React from 'react'
import { isMobileDevice } from '@/lib/isMobileDevice'

interface SwitchMobileComponentProps {
  stationaryChild: React.ReactNode
  mobileChild: React.ReactNode
}

const SwitchMobileComponent: React.FC<SwitchMobileComponentProps> = ({
  stationaryChild,
  mobileChild,
}) => {
  const isMobile = isMobileDevice()

  return <>{isMobile ? mobileChild : stationaryChild}</>
}

export default SwitchMobileComponent
