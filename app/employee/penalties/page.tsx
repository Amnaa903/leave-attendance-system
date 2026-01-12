"use client"

import { useState, useEffect } from "react"
import { AlertCircle, Calendar, Info } from "lucide-react"
import { ModernCard } from "@/components/ui/modern-card"

export default function EmployeePenaltiesPage() {
    const [penalties, setPenalties] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchPenalties = async () => {
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
        fetchPenalties()
    }, [])

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-heading font-bold text-secondary-900">My Penalty History</h1>
                <p className="text-secondary-500 text-sm mt-1">Review your disciplinary records and automated late penalties.</p>
            </div>

            <div className="grid grid-cols-1 gap-6">
                <ModernCard title="Penalty Records" subtitle={`Showing ${penalties.length} records`} color="danger">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-secondary-50 border-b border-secondary-100">
                                <tr>
                                    <th className="text-left py-4 px-4 text-xs font-bold text-secondary-500 uppercase tracking-wider">Type</th>
                                    <th className="text-left py-4 px-4 text-xs font-bold text-secondary-500 uppercase tracking-wider">Deduction</th>
                                    <th className="text-left py-4 px-4 text-xs font-bold text-secondary-500 uppercase tracking-wider">Date</th>
                                    <th className="text-left py-4 px-4 text-xs font-bold text-secondary-500 uppercase tracking-wider">Status</th>
                                    <th className="text-left py-4 px-4 text-xs font-bold text-secondary-500 uppercase tracking-wider">Details</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-secondary-100">
                                {penalties.map((penalty: any) => (
                                    <tr key={penalty.id} className="hover:bg-secondary-50/50 transition-colors">
                                        <td className="py-4 px-4">
                                            <span className="text-sm font-bold text-secondary-700 capitalize">
                                                {penalty.penalty_type.replace(/_/g, ' ')}
                                            </span>
                                        </td>
                                        <td className="py-4 px-4">
                                            <span className="text-sm font-extrabold text-red-600">-{penalty.penalty_days} Days Off</span>
                                        </td>
                                        <td className="py-4 px-4 text-sm text-secondary-500 font-medium">
                                            {new Date(penalty.applied_date).toLocaleDateString()}
                                        </td>
                                        <td className="py-4 px-4">
                                            <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border 
                                                ${penalty.status === 'active' ? 'bg-orange-100 text-orange-700 border-orange-200' : 'bg-emerald-100 text-emerald-700 border-emerald-200'}`}>
                                                {penalty.status}
                                            </span>
                                        </td>
                                        <td className="py-4 px-4">
                                            <p className="text-xs text-secondary-500 italic max-w-xs line-clamp-1" title={penalty.description}>
                                                {penalty.description}
                                            </p>
                                        </td>
                                    </tr>
                                ))}
                                {penalties.length === 0 && !loading && (
                                    <tr>
                                        <td colSpan={5} className="py-12 text-center text-secondary-400">
                                            <div className="flex flex-col items-center">
                                                <div className="w-12 h-12 bg-secondary-100 rounded-full flex items-center justify-center mb-3">
                                                    <Calendar className="text-secondary-300" />
                                                </div>
                                                <p className="font-medium text-sm">Great job! You have no penalty records.</p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </ModernCard>
            </div>
        </div>
    )
}
