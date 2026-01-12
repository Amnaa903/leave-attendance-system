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
    blue: "from-blue-500 to-indigo-500",
    green: "from-emerald-500 to-teal-500",
    orange: "from-orange-500 to-amber-500",
    pink: "from-pink-500 to-rose-500",
    purple: "from-violet-500 to-purple-500",
    cyan: "from-cyan-500 to-blue-500",
  }

  const bgClasses = {
    blue: "bg-blue-50 text-blue-600",
    green: "bg-emerald-50 text-emerald-600",
    orange: "bg-orange-50 text-orange-600",
    pink: "bg-pink-50 text-pink-600",
    purple: "bg-violet-50 text-violet-600",
    cyan: "bg-cyan-50 text-cyan-600",
  }

  const accentClasses = {
    blue: "bg-blue-600",
    green: "bg-emerald-600",
    orange: "bg-orange-600",
    pink: "bg-pink-600",
    purple: "bg-violet-600",
    cyan: "bg-cyan-600",
  }

  return (
    <div className="bg-white rounded-2xl border border-secondary-200 p-6 shadow-soft card-hover group relative overflow-hidden h-full">
      {/* Accent Line */}
      <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${accentClasses[color]} opacity-0 group-hover:opacity-100 transition-opacity`} />

      {/* Background Decorator */}
      <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${colorClasses[color]} opacity-[0.03] rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-125`} />

      <div className="flex items-center justify-between relative z-10">
        <div className="flex-1">
          <p className="text-xs font-bold text-secondary-500 mb-2 uppercase tracking-widest">{title}</p>
          <div className="text-3xl font-heading font-extrabold text-secondary-900 mb-1 tracking-tight">
            {value}
          </div>
          {subtitle && (
            <p className="text-xs font-bold text-secondary-400 flex items-center">
              {subtitle}
            </p>
          )}
        </div>
        {icon && (
          <div
            className={`p-4 rounded-2xl shadow-sm ${bgClasses[color]} bg-opacity-10 border border-current border-opacity-20 transition-all duration-300 group-hover:scale-110 group-hover:shadow-md group-hover:bg-opacity-20`}
          >
            {icon}
          </div>
        )}
      </div>
    </div>
  )
}
