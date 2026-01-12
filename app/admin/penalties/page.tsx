"use client"

import { useState, useEffect } from "react"
import { AlertCircle, Search, Filter, CheckCircle, XCircle, UserPlus, Info, Calendar } from "lucide-react"
import { ActionButton } from "@/components/ui/action-button"
import { ModernCard } from "@/components/ui/modern-card"
import { Modal } from "@/components/ui/modal"

export default function AdminPenaltiesPage() {
    const [penalties, setPenalties] = useState([])
    const [users, setUsers] = useState([])
    const [loading, setLoading] = useState(true)
    const [showAddModal, setShowAddModal] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)

    const [formData, setFormData] = useState({
        employee_id: "",
        penalty_type: "late_arrival",
        description: "",
        penalty_days: "0.25"
    })

    useEffect(() => {
        fetchData()
        fetchUsers()

        // Handle pre-selected employee from query param
        const params = new URLSearchParams(window.location.search)
        const empId = params.get('employee_id')
        if (empId) {
            setFormData(prev => ({ ...prev, employee_id: empId }))
            setShowAddModal(true)
        }
    }, [])

    const fetchData = async () => {
        try {
            const res = await fetch('/api/penalties')
            if (res.ok) {
                const data = await res.json()
                setPenalties(data.penalties)
            }
        } catch (error) {
            console.error("Failed to fetch penalties", error)
        } finally {
            setLoading(false)
        }
    }

    const fetchUsers = async () => {
        try {
            const res = await fetch('/api/users')
            if (res.ok) {
                const data = await res.json()
                setUsers(data.users)
            }
        } catch (error) {
            console.error("Failed to fetch users", error)
        }
    }

    const handleAction = async (id: number, status: string) => {
        try {
            const res = await fetch(`/api/penalties/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status })
            })
            if (res.ok) {
                fetchData() // Refresh
            }
        } catch (error) {
            console.error(error)
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)
        try {
            const res = await fetch('/api/penalties', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            })

            if (res.ok) {
                setShowAddModal(false)
                fetchData()
                setFormData({
                    employee_id: "",
                    penalty_type: "late_arrival",
                    description: "",
                    penalty_days: "0.25"
                })
            } else {
                const err = await res.json()
                alert(err.error || "Failed to create penalty")
            }
        } catch (error) {
            console.error(error)
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-4xl font-creepster font-bold text-red-600 tracking-wider">Penalty Management</h1>
                    <p className="text-secondary-500 text-sm mt-1">Review, resolve, and issue disciplinary penalties.</p>
                </div>
                <ActionButton variant="primary" onClick={() => setShowAddModal(true)}>
                    <AlertCircle size={18} />
                    Issue Manual Penalty
                </ActionButton>
            </div>

            <div className="grid grid-cols-1 gap-6">
                <ModernCard title="Penalty History" subtitle={`${penalties.length} records found`}>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-secondary-50 border-b border-secondary-100">
                                <tr>
                                    <th className="text-left py-4 px-4 text-xs font-bold text-secondary-500 uppercase tracking-wider">Employee</th>
                                    <th className="text-left py-4 px-4 text-xs font-bold text-secondary-500 uppercase tracking-wider">Type</th>
                                    <th className="text-left py-4 px-4 text-xs font-bold text-secondary-500 uppercase tracking-wider">Amount</th>
                                    <th className="text-left py-4 px-4 text-xs font-bold text-secondary-500 uppercase tracking-wider">Date</th>
                                    <th className="text-left py-4 px-4 text-xs font-bold text-secondary-500 uppercase tracking-wider">Status</th>
                                    <th className="text-right py-4 px-4 text-xs font-bold text-secondary-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-secondary-100">
                                {penalties.map((penalty: any) => (
                                    <tr key={penalty.id} className="hover:bg-secondary-50/50 transition-colors">
                                        <td className="py-4 px-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-xs">
                                                    {penalty.employee?.name?.[0]}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-bold text-secondary-900">{penalty.employee?.name}</p>
                                                    <p className="text-[10px] text-secondary-500 font-medium uppercase">{penalty.employee?.employee_id}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-4 px-4">
                                            <div className="flex flex-col">
                                                <span className="text-sm font-bold text-secondary-700 capitalize">{penalty.penalty_type.replace('_', ' ')}</span>
                                                <span className="text-[10px] text-secondary-500 line-clamp-1 italic">{penalty.description}</span>
                                            </div>
                                        </td>
                                        <td className="py-4 px-4">
                                            <span className="text-sm font-extrabold text-red-600">-{penalty.penalty_days} Days</span>
                                        </td>
                                        <td className="py-4 px-4 text-sm text-secondary-500">
                                            {new Date(penalty.applied_date).toLocaleDateString()}
                                        </td>
                                        <td className="py-4 px-4">
                                            <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider 
                                                ${penalty.status === 'active' ? 'bg-orange-100 text-orange-700 border border-orange-200' : 'bg-emerald-100 text-emerald-700 border border-emerald-200'}`}>
                                                {penalty.status}
                                            </span>
                                        </td>
                                        <td className="py-4 px-4 text-right">
                                            {penalty.status === 'active' ? (
                                                <button
                                                    onClick={() => handleAction(penalty.id, 'resolved')}
                                                    className="text-emerald-500 hover:text-emerald-700 p-1.5 hover:bg-emerald-50 rounded-lg transition-all"
                                                    title="Mark Resolved"
                                                >
                                                    <CheckCircle size={18} />
                                                </button>
                                            ) : (
                                                <Info size={18} className="text-secondary-300 ml-auto" />
                                            )}
                                        </td>
                                    </tr>
                                ))}
                                {penalties.length === 0 && !loading && (
                                    <tr>
                                        <td colSpan={6} className="py-12 text-center text-secondary-400">
                                            <div className="flex flex-col items-center">
                                                <div className="w-12 h-12 bg-secondary-100 rounded-full flex items-center justify-center mb-3">
                                                    <AlertCircle className="text-secondary-300" />
                                                </div>
                                                <p className="font-medium text-sm">No penalty records found.</p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </ModernCard>
            </div>

            {/* Add Penalty Modal */}
            <Modal
                isOpen={showAddModal}
                onClose={() => setShowAddModal(false)}
                title="Issue Manual Penalty"
                size="md"
            >
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-bold text-secondary-700 mb-2">Select Employee</label>
                        <select
                            required
                            name="employee_id"
                            value={formData.employee_id}
                            onChange={(e) => setFormData({ ...formData, employee_id: e.target.value })}
                            className="w-full p-3 bg-white border border-secondary-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none transition-all font-medium text-secondary-900"
                        >
                            <option value="">Choose an employee...</option>
                            {users.map((u: any) => (
                                <option key={u.id} value={u.id}>{u.name} ({u.employee_id})</option>
                            ))}
                        </select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-bold text-secondary-700 mb-2">Penalty Type</label>
                            <select
                                name="penalty_type"
                                value={formData.penalty_type}
                                onChange={(e) => setFormData({ ...formData, penalty_type: e.target.value })}
                                className="w-full p-3 bg-white border border-secondary-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none transition-all font-medium"
                            >
                                <option value="late_arrival">Late Arrival</option>
                                <option value="missed_check_in">Missed Check-in</option>
                                <option value="disciplinary">Disciplinary Action</option>
                                <option value="other">Other</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-secondary-700 mb-2">Penalty Days</label>
                            <input
                                type="number"
                                step="0.25"
                                required
                                value={formData.penalty_days}
                                onChange={(e) => setFormData({ ...formData, penalty_days: e.target.value })}
                                className="w-full p-3 bg-white border border-secondary-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none transition-all font-bold text-red-600"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-secondary-700 mb-2">Reason / Description</label>
                        <textarea
                            required
                            rows={3}
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            placeholder="Briefly describe why this penalty is being issued..."
                            className="w-full p-3 bg-white border border-secondary-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none transition-all font-medium text-secondary-600 resize-none"
                        />
                    </div>

                    <div className="pt-4 border-t border-secondary-100 flex gap-3">
                        <ActionButton
                            variant="secondary"
                            fullWidth
                            type="button"
                            onClick={() => setShowAddModal(false)}
                            className="bg-white border-secondary-200"
                        >
                            Cancel
                        </ActionButton>
                        <ActionButton
                            variant="primary"
                            fullWidth
                            type="submit"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? "Issuing..." : "Confirm & Issue"}
                        </ActionButton>
                    </div>
                </form>
            </Modal>
        </div>
    )
}
