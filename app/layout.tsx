import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Terminal Zero',
  description: 'Terminal Zero is a web-based, interactive game that teaches offensive security and real Linux command-line skills through 60 progressively challenging levels. You play as a hacker-in-training, using commands like cd, ls, cat, find, and more to break through simulated security systems and uncover hidden secrets.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
