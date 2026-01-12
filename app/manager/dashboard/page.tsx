"use client"

import { useState, useEffect } from "react"
import { Check, X, Calendar, AlertCircle, FileText, User, LogOut } from "lucide-react" // Icons
import { ActionButton } from "@/components/ui/action-button"
import { ModernCard } from "@/components/ui/modern-card"
import { Badge } from "@/components/ui/badge" // Assuming we have Badge or I'll use simple span

export default function ManagerDashboard() {
  const [leaves, setLeaves] = useState([])
  const [loading, setLoading] = useState(true)
  const [processingId, setProcessingId] = useState<number | null>(null)

  useEffect(() => {
    fetchLeaves()
  }, [])

  const fetchLeaves = async () => {
    try {
      const res = await fetch('/api/manager/leaves')
      if (res.ok) {
        const data = await res.json()
        setLeaves(data.leaves)
      }
    } catch (error) {
      console.error("Failed to fetch leaves", error)
    } finally {
      setLoading(false)
    }
  }

  const handleAction = async (id: number, status: 'approved' | 'rejected') => {
    if (!confirm(`Are you sure you want to ${status} this request?`)) return

    setProcessingId(id)
    try {
      const res = await fetch(`/api/leave/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status,
          rejection_reason: status === 'rejected' ? 'Manager Rejection' : null
        })
      })

      if (res.ok) {
        // Remove from list
        setLeaves(prev => prev.filter((l: any) => l.id !== id))
        alert(`Leave request ${status} successfully.`)
      } else {
        const err = await res.json()
        alert(err.error || 'Action failed')
      }
    } catch (error) {
      console.error(error)
      alert('An error occurred')
    } finally {
      setProcessingId(null)
    }
  }

  const handleLogout = () => {
    document.cookie = "token=; path=/; max-age=0"
    window.location.href = "/login"
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-center justify-between mb-2">
        <div>
          <h2 className="text-2xl font-bold text-secondary-900 font-heading">Leave Applications</h2>
          <p className="text-secondary-500">Review and manage pending applications from your team.</p>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12 text-secondary-400 animate-pulse">Loading requests...</div>
      ) : (
        <div className="space-y-4">
          {leaves.length === 0 ? (
            <ModernCard title="All Caught Up!">
              <div className="text-center py-12 text-secondary-400 flex flex-col items-center">
                <div className="w-16 h-16 bg-secondary-100 rounded-full flex items-center justify-center mb-4">
                  <FileText className="text-secondary-300" size={32} />
                </div>
                <p>No pending leave requests at the moment.</p>
              </div>
            </ModernCard>
          ) : (
            leaves.map((leave: any) => (
              <div key={leave.id} className="bg-white rounded-xl border border-secondary-200 shadow-soft p-6 transition-all hover:shadow-lg card-hover">
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-bold text-lg border-2 border-primary-50">
                        {leave.employee?.name?.[0] || 'U'}
                      </div>
                      <div>
                        <h3 className="font-bold text-lg text-secondary-900">{leave.employee?.name}</h3>
                        <p className="text-sm text-secondary-500 font-medium">{leave.employee?.department || 'Employee'}</p>
                      </div>
                      <div className="ml-auto md:ml-4 flex gap-2">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide
                          ${leave.leave_type === 'sick' ? 'bg-orange-100 text-orange-700' :
                            leave.leave_type === 'medical' ? 'bg-pink-100 text-pink-700' :
                              'bg-indigo-100 text-indigo-700'}`}>
                          {leave.leave_type}
                        </span>
                        {leave.is_sandwich && (
                          <span className="bg-yellow-100 text-yellow-800 text-xs px-3 py-1 rounded-full border border-yellow-200 font-bold flex items-center">
                            <AlertCircle size={12} className="mr-1" /> Sandwich
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4 bg-secondary-50/80 p-5 rounded-xl border border-secondary-100">
                      <div className="flex items-center text-sm text-secondary-700">
                        <Calendar size={18} className="mr-3 text-secondary-400" />
                        <span className="font-medium">
                          {new Date(leave.start_date).toLocaleDateString()} — {new Date(leave.end_date).toLocaleDateString()}
                          <span className="text-secondary-400 ml-2 font-normal">({leave.total_days} days)</span>
                        </span>
                      </div>
                      <div className="flex items-start text-sm text-secondary-700">
                        <FileText size={18} className="mr-3 mt-0.5 text-secondary-400" />
                        <p className="italic">"{leave.reason}"</p>
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="mt-4 flex gap-6 text-xs font-medium text-secondary-500 uppercase tracking-widest">
                      <span className="flex items-center"><div className="w-2 h-2 rounded-full bg-orange-400 mr-2"></div> Sick Bal: {leave.employee?.sick_leave_balance}</span>
                      <span className="flex items-center"><div className="w-2 h-2 rounded-full bg-indigo-400 mr-2"></div> Casual Bal: {leave.employee?.casual_leave_balance}</span>
                    </div>
                  </div>

                  <div className="flex flex-row md:flex-col gap-3 min-w-[160px] border-t md:border-t-0 md:border-l border-secondary-100 pt-4 md:pt-0 md:pl-6">
                    <ActionButton
                      variant="success"
                      fullWidth
                      onClick={() => handleAction(leave.id, 'approved')}
                      disabled={processingId === leave.id}
                      className="shadow-md"
                    >
                      <Check size={16} /> Approve
                    </ActionButton>
                    <ActionButton
                      variant="danger"
                      fullWidth
                      onClick={() => handleAction(leave.id, 'rejected')}
                      disabled={processingId === leave.id}
                      className="shadow-md"
                    >
                      <X size={16} /> Reject
                    </ActionButton>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  )
}
