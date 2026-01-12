"use client"

import { useState, useEffect } from "react"
import { Calendar, Clock, AlertCircle, FileText, CheckCircle, XCircle, LogOut, Heart, Coffee, Briefcase } from "lucide-react"
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
    return <div className="min-h-screen flex items-center justify-center bg-gray-50 font-medium text-secondary-500 animate-pulse">Loading dashboard...</div>
  }

  const isCheckedIn = !!attendance?.check_in && !attendance?.check_out
  const isCheckedOut = !!attendance?.check_out

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl font-heading font-extrabold text-secondary-900 mb-2 tracking-tight transition-all">
            Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-indigo-600">{user?.name?.split(' ')[0]}</span>
          </h1>
          <p className="text-lg text-secondary-500 font-medium">Here's your activity overview for today.</p>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Attendance Action Section */}
        <div className="lg:col-span-1">
          <ModernCard title="Attendance" color="indigo" subtitle="Daily Check-in/out">
            <div className="flex flex-col items-center justify-center py-4">
              <p className="text-xs font-bold text-secondary-400 mb-6 uppercase tracking-widest text-center">
                {isCheckedOut ? "Shift Completed" : isCheckedIn ? "Active Shift" : "Ready to Start?"}
              </p>

              {isCheckedOut ? (
                <div className="flex flex-col items-center space-y-3 p-6 bg-emerald-50 rounded-2xl border border-emerald-100 w-full animate-fade-in">
                  <div className="p-3 bg-emerald-500 rounded-full text-white shadow-lg shadow-emerald-200">
                    <CheckCircle size={32} />
                  </div>
                  <div className="text-center">
                    <p className="text-emerald-900 font-extrabold text-lg">Shift Done!</p>
                    <p className="text-emerald-600 font-bold text-sm">Out at {new Date(attendance.check_out).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                  </div>
                </div>
              ) : (
                <div className="w-full space-y-6">
                  <ActionButton
                    onClick={() => handleAttendance(isCheckedIn ? 'check_out' : 'check_in')}
                    variant={isCheckedIn ? 'danger' : 'success'}
                    size="lg"
                    fullWidth
                    disabled={actionLoading}
                    className="py-6 rounded-2xl shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all text-xl font-rugged font-bold tracking-widest uppercase"
                  >
                    <Clock className="mr-3" size={24} />
                    {isCheckedIn ? 'Check Out' : 'Check In Now'}
                  </ActionButton>

                  {isCheckedIn && (
                    <div className="flex flex-col items-center space-y-4 animate-slide-up">
                      <div className="flex items-center text-secondary-600 font-bold bg-indigo-50 px-4 py-2 rounded-xl border border-indigo-100">
                        <span className="w-2.5 h-2.5 bg-green-500 rounded-full mr-3 animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.5)]"></span>
                        Working Since: {new Date(attendance.check_in).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                      {attendance.is_late && (
                        <div className="flex items-center text-red-600 text-xs font-bold bg-red-50 px-3 py-1 rounded-full border border-red-100">
                          <AlertCircle size={14} className="mr-1.5" /> Late Entry
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          </ModernCard>
        </div>

        {/* Stats Section */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-secondary-900 flex items-center">
              <Calendar className="mr-3 text-primary-500" size={24} /> Leave Balance
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <StatCard
              title="Sick Leave"
              value={user?.sick_leave_balance || 0}
              subtitle="Days Available"
              icon={<Heart size={24} />}
              color="orange"
            />
            <StatCard
              title="Casual Leave"
              value={user?.casual_leave_balance || 0}
              subtitle="Days Available"
              icon={<Coffee size={24} />}
              color="blue"
            />
            <StatCard
              title="Work From Home"
              value={user?.work_from_home_balance || 0}
              subtitle="Days Available"
              icon={<Briefcase size={24} />}
              color="purple"
            />
            <StatCard
              title="Medical Leaves"
              value={user?.medical_leave_balance || 0}
              subtitle="Taken this year"
              icon={<FileText size={24} />}
              color="pink"
            />
          </div>

          {/* Quick Actions Card */}
          <ModernCard title="Quick Actions">
            <div className="flex flex-wrap gap-4">
              <ActionButton variant="primary" onClick={() => window.location.href = '/employee/leave/apply'} className="py-4 px-8 rounded-xl shadow-soft font-bold">
                <Calendar size={20} className="mr-2" />
                Apply for Leave
              </ActionButton>
              <ActionButton variant="secondary" onClick={() => window.location.href = '/employee/attendance'} className="py-4 px-8 rounded-xl bg-white border-secondary-200 hover:bg-secondary-50 font-bold">
                <FileText size={20} className="mr-2" />
                View History
              </ActionButton>
            </div>
          </ModernCard>
        </div>
      </div>
    </div>
  )
}
