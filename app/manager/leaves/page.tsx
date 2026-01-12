"use client"

import { useState, useEffect } from "react"
import { Check, X, Calendar, User, Clock, AlertCircle } from "lucide-react"
import { ModernCard } from "@/components/ui/modern-card"
import { ActionButton } from "@/components/ui/action-button"

interface LeaveRequest {
    id: string
    leave_type: string
    start_date: string
    end_date: string
    reason: string
    status: string
    employee: {
        name: string
        department: string
        sick_leave_balance: number
        casual_leave_balance: number
    }
}

export default function ManagerLeavesPage() {
    const [leaves, setLeaves] = useState<LeaveRequest[]>([])
    const [loading, setLoading] = useState(true)
    const [actionLoading, setActionLoading] = useState<string | null>(null)

    const fetchLeaves = async () => {
        try {
            const res = await fetch('/api/manager/leaves')
            if (res.ok) {
                const data = await res.json()
                setLeaves(data.leaves)
            }
        } catch (error) {
            console.error("Failed to load leaves", error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchLeaves()
    }, [])

    const handleAction = async (id: string, action: 'approve' | 'reject') => {
        setActionLoading(id)
        try {
            const res = await fetch(`/api/leave/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    status: action === 'approve' ? 'approved' : 'rejected',
                    rejection_reason: action === 'reject' ? 'Manager Rejection' : null
                })
            })

            if (res.ok) {
                // Remove from list or update local state
                setLeaves(prev => prev.filter(l => l.id !== id))
                alert(`Leave request ${action}d successfully.`)
            } else {
                const err = await res.json()
                alert(err.error || "Action failed")
            }
        } catch (error) {
            console.error(error)
            alert("Something went wrong")
        } finally {
            setActionLoading(null)
        }
    }

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center bg-gray-50">Loading...</div>
    }

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-heading font-bold text-secondary-900">Leave Requests</h1>
                <p className="text-secondary-500">Manage pending leave applications from your team.</p>
            </div>

            {leaves.length === 0 ? (
                <ModernCard title="No Pending Requests" header={false}>
                    <div className="text-center py-12">
                        <div className="w-16 h-16 bg-success-50 text-success-600 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Check size={32} />
                        </div>
                        <h3 className="text-lg font-bold text-secondary-900">All Caught Up!</h3>
                        <p className="text-secondary-500">There are no pending leave requests to review.</p>
                    </div>
                </ModernCard>
            ) : (
                <div className="grid gap-6">
                    {leaves.map((leave) => (
                        <ModernCard key={leave.id} title={`${leave.employee.name} • ${leave.employee.department || 'General'}`} header={true}>
                            <div className="flex flex-col md:flex-row justify-between gap-6">
                                <div className="flex-1 space-y-4">
                                    {/* Dates & Type */}
                                    <div className="flex flex-wrap gap-4">
                                        <div className="flex items-center text-secondary-700 bg-secondary-50 px-3 py-1.5 rounded-lg border border-secondary-100">
                                            <Calendar size={18} className="mr-2 text-primary-500" />
                                            <span className="font-medium">
                                                {new Date(leave.start_date).toLocaleDateString()} — {new Date(leave.end_date).toLocaleDateString()}
                                            </span>
                                        </div>
                                        <div className="flex items-center text-secondary-700 bg-secondary-50 px-3 py-1.5 rounded-lg border border-secondary-100">
                                            <AlertCircle size={18} className="mr-2 text-orange-500" />
                                            <span className="font-medium capitalize">{leave.leave_type.replace('_', ' ')}</span>
                                        </div>
                                    </div>

                                    {/* Reason */}
                                    <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                                        <p className="text-sm text-secondary-600 italic">"{leave.reason}"</p>
                                    </div>

                                    {/* Balances */}
                                    <div className="flex gap-4 text-xs text-secondary-500">
                                        <span>Sick Balance: <strong className="text-secondary-900">{leave.employee.sick_leave_balance}</strong></span>
                                        <span>Casual Balance: <strong className="text-secondary-900">{leave.employee.casual_leave_balance}</strong></span>
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="flex flex-row md:flex-col gap-3 justify-center md:items-end min-w-[140px]">
                                    <ActionButton
                                        variant="success"
                                        onClick={() => handleAction(leave.id, 'approve')}
                                        disabled={actionLoading === leave.id}
                                        className="w-full md:w-auto"
                                    >
                                        <Check size={18} className="mr-2" /> Approve
                                    </ActionButton>
                                    <ActionButton
                                        variant="danger"
                                        onClick={() => handleAction(leave.id, 'reject')}
                                        disabled={actionLoading === leave.id}
                                        className="w-full md:w-auto"
                                    >
                                        <X size={18} className="mr-2" /> Reject
                                    </ActionButton>
                                </div>
                            </div>
                        </ModernCard>
                    ))}
                </div>
            )}
        </div>
    )
}
