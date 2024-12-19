import * as React from 'react'
import { isMobileDevice } from '@/lib/isMobileDevice'

interface SwitchMobileComponentProps {
  stationaryChild: React.ReactNode
  mobileChild: React.ReactNode
}

const SwitchMobileComponent: React.FC<SwitchMobileComponentProps> = async ({
  stationaryChild,
  mobileChild,
}) => {
  const isMobile = await isMobileDevice()

  return <>{isMobile ? mobileChild : stationaryChild}</>
}

export default SwitchMobileComponent
