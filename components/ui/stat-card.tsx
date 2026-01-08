"use client"

import type { ReactNode } from "react"

interface StatCardProps {
  title: string
  value: string | number
  subtitle?: string
  icon?: ReactNode
  color?: "blue" | "green" | "orange" | "pink" | "purple" | "cyan"
}

export function StatCard({ title, value, subtitle, icon, color = "blue" }: StatCardProps) {
  const colorClasses = {
    blue: "from-blue-500 to-cyan-400",
    green: "from-emerald-500 to-teal-400",
    orange: "from-orange-500 to-amber-400",
    pink: "from-pink-500 to-rose-400",
    purple: "from-purple-500 to-indigo-400",
    cyan: "from-cyan-500 to-blue-400",
  }

  const iconColorClasses = {
    blue: "text-blue-500",
    green: "text-emerald-500",
    orange: "text-orange-500",
    pink: "text-pink-500",
    purple: "text-purple-500",
    cyan: "text-cyan-500",
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 mb-2">{title}</p>
          <div className="text-3xl font-bold text-gray-900 mb-1">{value}</div>
          {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
        </div>
        {icon && (
          <div
            className={`p-3 rounded-xl bg-gradient-to-br ${colorClasses[color]} bg-opacity-10 ${iconColorClasses[color]}`}
          >
            {icon}
          </div>
        )}
      </div>
    </div>
  )
}
