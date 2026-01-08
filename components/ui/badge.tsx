"use client"

interface BadgeProps {
  label: string
  variant: "success" | "error" | "warning" | "info"
}

export function Badge({ label, variant }: BadgeProps) {
  const variantClasses = {
    success: "bg-emerald-100 text-emerald-800 border border-emerald-200",
    error: "bg-rose-100 text-rose-800 border border-rose-200",
    warning: "bg-amber-100 text-amber-800 border border-amber-200",
    info: "bg-blue-100 text-blue-800 border border-blue-200",
  }

  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${variantClasses[variant]}`}>
      {label}
    </span>
  )
}