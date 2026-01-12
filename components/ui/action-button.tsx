"use client"

import type { ReactNode } from "react"

interface ActionButtonProps {
  children: ReactNode
  variant?: "primary" | "secondary" | "success" | "danger"
  size?: "sm" | "md" | "lg"
  fullWidth?: boolean
  onClick?: () => void
  type?: "button" | "submit" | "reset"
  disabled?: boolean
  className?: string
}

export function ActionButton({
  children,
  variant = "primary",
  size = "md",
  fullWidth = false,
  onClick,
  type = "button",
  disabled = false,
  className = "",
}: ActionButtonProps) {
  const variantClasses = {
    primary: "bg-primary-600 hover:bg-primary-700 text-white shadow-sm hover:shadow-md",
    secondary: "bg-white hover:bg-secondary-50 text-secondary-700 border border-secondary-200 card-hover",
    success: "bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm hover:shadow-md",
    danger: "bg-danger hover:bg-red-700 text-white shadow-sm hover:shadow-md",
  }

  const sizeClasses = {
    sm: "px-3 py-2 text-sm",
    md: "px-4 py-2.5 text-sm",
    lg: "px-6 py-3 text-base",
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`
        inline-flex items-center justify-center space-x-2 font-medium rounded-xl transition-all duration-200
        ${variantClasses[variant]}
        ${sizeClasses[size]}
        ${fullWidth ? "w-full" : ""}
        ${disabled ? "opacity-50 cursor-not-allowed transform-none shadow-none" : "active:scale-95"}
        ${className}
      `}
    >
      {children}
    </button>
  )
}
