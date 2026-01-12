"use client"

import { useState, useEffect } from "react"
import { Calendar, Clock, AlertCircle, FileText, CheckCircle, XCircle, LogOut } from "lucide-react"
import { StatCard } from "@/components/ui/stat-card"
import { ModernCard } from "@/components/ui/modern-card"
import { ActionButton } from "@/components/ui/action-button"

export default function EmployeeDashboard() {
  const [user, setUser] = useState<any>(null)
  const [attendance, setAttendance] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState(false)

  // Fetch data on mount
  const fetchData = async () => {
    try {
      const res = await fetch('/api/user/me')
      if (res.ok) {
        const data = await res.json()
        setUser(data.user)
        setAttendance(data.attendance)
      }
    } catch (error) {
      console.error("Failed to load profile", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handleAttendance = async (action: 'check_in' | 'check_out') => {
    setActionLoading(true)
    try {
      const res = await fetch('/api/attendance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action })
      })

      if (res.ok) {
        await fetchData() // Refresh state
        alert(`Successfully ${action === 'check_in' ? 'Checked In' : 'Checked Out'}!`)
      } else {
        const err = await res.json()
        alert(err.error || "Action failed")
      }
    } catch (error) {
      console.error(error)
    } finally {
      setActionLoading(false)
    }
  }

  const handleLogout = () => {
    document.cookie = "token=; path=/; max-age=0"
    window.location.href = "/login"
  }

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-gray-50">Loading...</div>
  }

  const isCheckedIn = !!attendance?.check_in && !attendance?.check_out
  const isCheckedOut = !!attendance?.check_out

  return (
    <div className="space-y-8">
      {/* Welcome & Attendance Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 flex flex-col justify-center">
          <h1 className="text-4xl font-heading font-bold text-secondary-900 mb-2">
            Welcome back, {user?.name?.split(' ')[0]} 👋
          </h1>
          <p className="text-lg text-secondary-500">Here's your activity overview for today.</p>
        </div>

        {/* Attendance Action Card */}
        <div className="bg-white/60 backdrop-blur-md rounded-2xl shadow-glass border border-white/50 p-6 flex flex-col items-center justify-center text-center">
          <p className="text-sm font-bold text-secondary-500 mb-4 uppercase tracking-widest">
            {isCheckedOut ? "Shift Completed" : isCheckedIn ? "Active Shift" : "Ready to Start?"}
          </p>

          {isCheckedOut ? (
            <div className="flex items-center space-x-2 text-emerald-600 bg-emerald-50 px-4 py-2 rounded-lg border border-emerald-100">
              <CheckCircle size={20} />
              <span className="font-bold">Checked Out at {new Date(attendance.check_out).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
            </div>
          ) : (
            <ActionButton
              onClick={() => handleAttendance(isCheckedIn ? 'check_out' : 'check_in')}
              variant={isCheckedIn ? 'danger' : 'success'}
              size="lg"
              fullWidth
              disabled={actionLoading}
              className="shadow-lg transform hover:scale-105 transition-all"
            >
              <Clock className="mr-2" />
              {isCheckedIn ? 'Check Out' : 'Check In Now'}
            </ActionButton>
          )}

          {isCheckedIn && (
            <div className="mt-4 flex items-center justify-center text-xs text-secondary-400 bg-secondary-50 px-3 py-1 rounded-full">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></span>
              Checked in at: {new Date(attendance.check_in).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              {attendance.is_late && <span className="text-red-500 font-bold ml-1">(Late)</span>}
            </div>
          )}
        </div>
      </div>

      {/* Stats Grid */}
      <div>
        <h2 className="text-lg font-bold text-secondary-900 mb-4 flex items-center">
          <Calendar className="mr-2 text-primary-500" size={20} /> Leave Balance
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard
            title="Sick Leaves"
            value={`${user?.sick_leave_balance} / 7`}
            subtitle="Available"
            icon={<AlertCircle size={24} />}
            color="orange"
          />
          <StatCard
            title="Casual Leaves"
            value={`${user?.casual_leave_balance} / 7`}
            subtitle="Available"
            icon={<Calendar size={24} />}
            color="blue"
          />
          <StatCard
            title="Medical Leaves"
            value={`${user?.medical_leave_balance}`}
            subtitle="Taken this year"
            icon={<FileText size={24} />}
            color="pink"
          />
        </div>
      </div>

      {/* Quick Actions */}
      <div className="pt-4 border-t border-secondary-200">
        <h2 className="text-lg font-bold text-secondary-900 mb-4">Quick Actions</h2>
        <div className="flex space-x-4">
          <ActionButton variant="primary" onClick={() => window.location.href = '/employee/leave/apply'} className="shadow-soft">
            <Calendar size={18} />
            Apply for Leave
          </ActionButton>
          <ActionButton variant="secondary" className="bg-white border-secondary-200">
            <FileText size={18} />
            View History
          </ActionButton>
        </div>
      </div>
    </div>
  )
}
