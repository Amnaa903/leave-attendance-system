"use client"

interface ProgressBarProps {
  label: string
  value: number
  max: number
  color?: "blue" | "green" | "orange" | "pink" | "purple"
}

export function ProgressBar({ label, value, max, color = "blue" }: ProgressBarProps) {
  const percentage = (value / max) * 100

  const colorClasses = {
    blue: "from-blue-500 to-cyan-400",
    green: "from-emerald-500 to-teal-400",
    orange: "from-orange-500 to-amber-400",
    pink: "from-pink-500 to-rose-400",
    purple: "from-purple-500 to-indigo-400",
  }

  return (
    <div>
      <div className="flex justify-between mb-2">
        <span className="text-sm font-medium text-gray-700">{label}</span>
        <span className="text-sm font-semibold text-gray-900">
          {value} / {max}
        </span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-3">
        <div
          className={`h-3 rounded-full bg-gradient-to-r ${colorClasses[color]} transition-all`}
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    </div>
  )
}
