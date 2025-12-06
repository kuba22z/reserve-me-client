'use client'

import NextLink from 'next/link'
import Link from '@mui/material/Link'

export default function DashboardLink() {
  return (
    <Link href="/dashboard" color="secondary" component={NextLink}>
      Go to the dashboard
    </Link>
  )
}
