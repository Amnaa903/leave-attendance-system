import './globals.css'
import { Inter, Outfit, Creepster } from 'next/font/google' // Added Creepster

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const outfit = Outfit({ subsets: ['latin'], variable: '--font-outfit' })
const creepster = Creepster({ weight: '400', subsets: ['latin'], variable: '--font-creepster' })

export const metadata = { title: 'LeaveSync', description: 'Premium Leave Management System' }

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${outfit.variable} ${creepster.variable} font-sans bg-gray-50 text-slate-900`}>
        {children}
      </body>
    </html>
  )
}
