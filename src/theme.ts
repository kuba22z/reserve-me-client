'use client'
import { Roboto } from 'next/font/google'
import { experimental_extendTheme as extendTheme } from '@mui/material/styles'
import { red } from '@mui/material/colors'

const roboto = Roboto({
  weight: ['300', '400', '500', '700'],
  subsets: ['latin'],
  display: 'swap',
})

const theme = extendTheme({
  typography: {
    fontFamily: roboto.style.fontFamily,
  },
  colorSchemes: {
    light: {
      palette: {
        primary: { main: '#556cd6' },
        error: {
          main: red.A400,
        },
      },
    },
  },
})

export default theme
