import './globals.css'
import { Inter, Outfit } from 'next/font/google' // Added Outfit

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const outfit = Outfit({ subsets: ['latin'], variable: '--font-outfit' })

export const metadata = { title: 'LeaveSync', description: 'Premium Leave Management System' }

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${outfit.variable} font-sans bg-gray-50 text-slate-900`}>
        {children}
      </body>
    </html>
  )
}
