"use client"

import type { ReactNode } from "react"

interface ModernCardProps {
  title: string
  subtitle?: string
  children: ReactNode
  header?: boolean
  color?: "primary" | "secondary" | "success" | "warning" | "danger" | "indigo" | "purple"
}

export function ModernCard({ title, subtitle, children, header = true, color }: ModernCardProps) {
  const borderClasses = {
    primary: "border-t-4 border-t-primary-500",
    secondary: "border-t-4 border-t-secondary-500",
    success: "border-t-4 border-t-emerald-500",
    warning: "border-t-4 border-t-amber-500",
    danger: "border-t-4 border-t-red-500",
    indigo: "border-t-4 border-t-indigo-600",
    purple: "border-t-4 border-t-purple-600",
  }

  return (
    <div className={`bg-white rounded-2xl border border-secondary-200 shadow-soft transition-all duration-300 hover:shadow-lg overflow-hidden ${color ? borderClasses[color] : ""}`}>
      {header && (
        <div className="px-6 py-5 border-b border-secondary-100 bg-secondary-50/30">
          <h3 className="text-lg font-heading font-bold text-secondary-900">{title}</h3>
          {subtitle && <p className="text-sm text-secondary-500 mt-1 font-medium">{subtitle}</p>}
        </div>
      )}
      <div className="p-6">{children}</div>
    </div>
  )
}