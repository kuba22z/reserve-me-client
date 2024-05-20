'use client'

import * as React from 'react'
import CssBaseline from '@mui/material/CssBaseline'
import { Experimental_CssVarsProvider as CssVarsProvider } from '@mui/material/styles'

import { createTheme } from '@/styles/theme/create-theme'
import { AppRouterCacheProvider } from '@mui/material-nextjs/v13-appRouter'

export interface ThemeProviderProps {
  children: React.ReactNode
}

export function ThemeProvider({
  children,
}: ThemeProviderProps): React.JSX.Element {
  const theme = createTheme()

  return (
    <AppRouterCacheProvider>
      <CssVarsProvider theme={theme}>
        <CssBaseline />
        {children}
      </CssVarsProvider>
    </AppRouterCacheProvider>
  )
}
