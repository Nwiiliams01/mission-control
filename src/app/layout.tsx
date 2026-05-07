import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Nathaniel OS',
  description: 'Mission control for all four businesses.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className="bg-void text-text-primary min-h-screen">{children}</body>
    </html>
  )
}
