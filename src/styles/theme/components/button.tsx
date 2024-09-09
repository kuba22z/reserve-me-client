import type { Components } from '@mui/material/styles'

import type { Theme } from '../types'

export const MuiButton = {
  styleOverrides: {
    root: { borderRadius: '12px', textTransform: 'none' },
    sizeSmall: { padding: '4px 9px' },
    sizeMedium: { padding: '6px 16px' },
    sizeLarge: { padding: '8px 20px' },
    textSizeSmall: { padding: '2px 6px' },
    textSizeMedium: { padding: '7px 12px' },
    textSizeLarge: { padding: '9px 16px' },
    // text: {
    //   sizeSmall: { padding: '7px 12px' },
    //   sizeMedium: { padding: '9px 16px' },
    //   sizeLarge: { padding: '12px 16px' },
    // },
  },
} satisfies Components<Theme>['MuiButton']
