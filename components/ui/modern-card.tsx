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
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
      {header && (
        <div className="px-6 py-5 border-b border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          {subtitle && <p className="text-sm text-gray-600 mt-1">{subtitle}</p>}
        </div>
      )}
      <div className="p-6">{children}</div>
    </div>
  )
}