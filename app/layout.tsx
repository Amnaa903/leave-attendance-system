import './globals.css'  // <-- your Tailwind + custom CSS
import { Inter } from 'next/font/google'

export const metadata = { title: 'LeaveSync', description: '' }

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
