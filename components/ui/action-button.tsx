"use client"

import type { ReactNode } from "react"

interface ActionButtonProps {
  children: ReactNode
  variant?: "primary" | "secondary" | "success" | "danger"
  size?: "sm" | "md" | "lg"
  fullWidth?: boolean
  onClick?: () => void
}

export function ActionButton({
  children,
  variant = "primary",
  size = "md",
  fullWidth = false,
  onClick,
}: ActionButtonProps) {
  const variantClasses = {
    primary: "bg-blue-600 hover:bg-blue-700 text-white shadow-sm hover:shadow-md",
    secondary: "bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-200",
    success: "bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm hover:shadow-md",
    danger: "bg-rose-600 hover:bg-rose-700 text-white shadow-sm hover:shadow-md",
  }

  const sizeClasses = {
    sm: "px-3 py-2 text-sm",
    md: "px-4 py-2.5 text-sm",
    lg: "px-6 py-3 text-base",
  }

  return (
    <button
      onClick={onClick}
      className={`
        inline-flex items-center justify-center space-x-2 font-medium rounded-lg transition-all
        ${variantClasses[variant]}
        ${sizeClasses[size]}
        ${fullWidth ? "w-full" : ""}
      `}
    >
      {children}
    </button>
  )
}
