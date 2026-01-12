"use client"

import type { ReactNode } from "react"

interface ModernCardProps {
  title: string
  subtitle?: string
  children: ReactNode
  header?: boolean
}

export function ModernCard({ title, subtitle, children, header = true }: ModernCardProps) {
  return (
    <div className="bg-white rounded-2xl border border-secondary-200 shadow-soft transition-all duration-300 hover:shadow-lg">
      {header && (
        <div className="px-6 py-5 border-b border-secondary-100">
          <h3 className="text-lg font-heading font-bold text-secondary-900">{title}</h3>
          {subtitle && <p className="text-sm text-secondary-500 mt-1">{subtitle}</p>}
        </div>
      )}
      <div className="p-6">{children}</div>
    </div>
  )
}