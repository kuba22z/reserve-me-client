import * as React from 'react'
import { isMobileDevice } from '@/lib/isMobileDevice'

interface SwitchMobileComponentProps {
  desktopChild: React.ReactNode
  mobileChild: React.ReactNode
}

const SwitchMobileComponent: React.FC<SwitchMobileComponentProps> = async ({
  desktopChild,
  mobileChild,
}) => {
  const isMobile = await isMobileDevice()

  return <>{isMobile ? mobileChild : desktopChild}</>
}

export default SwitchMobileComponent
