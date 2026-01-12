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
    blue: "from-blue-500 to-indigo-500 text-white",
    green: "from-emerald-500 to-teal-500 text-white",
    orange: "from-orange-500 to-amber-500 text-white",
    pink: "from-pink-500 to-rose-500 text-white",
    purple: "from-violet-500 to-purple-500 text-white",
    cyan: "from-cyan-500 to-blue-500 text-white",
  }

  const bgClasses = {
    blue: "bg-blue-50 text-blue-600",
    green: "bg-emerald-50 text-emerald-600",
    orange: "bg-orange-50 text-orange-600",
    pink: "bg-pink-50 text-pink-600",
    purple: "bg-violet-50 text-violet-600",
    cyan: "bg-cyan-50 text-cyan-600",
  }

  return (
    <div className="bg-white rounded-2xl border border-secondary-200 p-6 shadow-soft card-hover group relative overflow-hidden">
      {/* Background Decorator */}
      <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${colorClasses[color]} opacity-5 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110`} />

      <div className="flex items-start justify-between relative z-10">
        <div className="flex-1">
          <p className="text-sm font-medium text-secondary-500 mb-2 uppercase tracking-wider">{title}</p>
          <div className="text-3xl font-heading font-bold text-secondary-900 mb-1 tracking-tight">
            {value}
          </div>
          {subtitle && (
            <p className="text-xs font-medium text-secondary-400 flex items-center">
              {subtitle}
            </p>
          )}
        </div>
        {icon && (
          <div
            className={`p-3 rounded-xl shadow-sm ${bgClasses[color]} transition-transform group-hover:rotate-6`}
          >
            {icon}
          </div>
        )}
      </div>
    </div>
  )
}
