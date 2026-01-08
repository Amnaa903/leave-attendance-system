"use client"

import dynamic from "next/dynamic"
import { useEffect, useState } from "react"

const EmployeeDashboard = dynamic(() => import("./employee/dashboard/page"), { ssr: false })
const ManagerDashboard = dynamic(() => import("./manager/dashboard/page"), { ssr: false })
const AdminDashboard = dynamic(() => import("./admin/dashboard/page"), { ssr: false })

export default function Page() {
  const [userRole, setUserRole] = useState<"employee" | "manager" | "admin" | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check user role from token or session
    // For now, we'll default to employee dashboard
    // You can modify this to fetch the actual user role from your backend
    const token = document.cookie
      .split("; ")
      .find((row) => row.startsWith("token="))
      ?.split("=")[1]

    if (token) {
      // Decode token or fetch user info to determine role
      // This is a placeholder - adjust based on your auth logic
      const role = localStorage.getItem("userRole") as "employee" | "manager" | "admin" | null
      setUserRole(role || "employee")
    } else {
      // Redirect to login if no token
      window.location.href = "/login"
    }

    setLoading(false)
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-blue-50/30">
        <div className="text-center">
          <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-600 to-cyan-500 mx-auto mb-4 animate-pulse"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  // Render appropriate dashboard based on user role
  if (userRole === "admin") {
    return <AdminDashboard />
  }

  if (userRole === "manager") {
    return <ManagerDashboard />
  }

  return <EmployeeDashboard />
}
