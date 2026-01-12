"use client"

import { useState, useEffect } from "react"
import { Calendar, Clock, CheckCircle, XCircle, AlertCircle } from "lucide-react"
import { ModernCard } from "@/components/ui/modern-card"

interface AttendanceRecord {
    id: string
    date: string
    check_in: string | null
    check_out: string | null
    status: string
    is_late: boolean
    hours_worked: number | null
    notes: string | null
}

export default function AttendancePage() {
    const [attendance, setAttendance] = useState<AttendanceRecord[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchAttendance = async () => {
            try {
                const res = await fetch('/api/attendance')
                if (res.ok) {
                    const data = await res.json()
                    setAttendance(data.attendance)
                }
            } catch (error) {
                console.error("Failed to load attendance", error)
            } finally {
                setLoading(false)
            }
        }
        fetchAttendance()
    }, [])

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center bg-gray-50">Loading...</div>
    }

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-heading font-bold text-secondary-900">Attendance History</h1>
                <p className="text-secondary-500">View your past attendance records and check-in times.</p>
            </div>

            <ModernCard title="Recent Activity" header={false}>
                <div className="overflow-x-auto">
                    {attendance.length === 0 ? (
                        <div className="text-center py-8 text-secondary-500">
                            No attendance records found.
                        </div>
                    ) : (
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-secondary-200">
                                    <th className="py-4 px-4 text-sm font-semibold text-secondary-500 uppercase tracking-wider">Date</th>
                                    <th className="py-4 px-4 text-sm font-semibold text-secondary-500 uppercase tracking-wider">Status</th>
                                    <th className="py-4 px-4 text-sm font-semibold text-secondary-500 uppercase tracking-wider">Check In</th>
                                    <th className="py-4 px-4 text-sm font-semibold text-secondary-500 uppercase tracking-wider">Check Out</th>
                                    <th className="py-4 px-4 text-sm font-semibold text-secondary-500 uppercase tracking-wider">Hours</th>
                                </tr>
                            </thead>
                            <tbody>
                                {attendance.map((record) => (
                                    <tr key={record.id} className="border-b border-secondary-100 last:border-0 hover:bg-secondary-50 transition-colors">
                                        <td className="py-4 px-4 text-secondary-900 font-medium">
                                            {new Date(record.date).toLocaleDateString(undefined, { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}
                                        </td>
                                        <td className="py-4 px-4">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize
                            ${record.status === 'present' ? 'bg-emerald-100 text-emerald-800' :
                                                    record.status === 'half_day' ? 'bg-amber-100 text-amber-800' :
                                                        'bg-red-100 text-red-800'}`}>
                                                {record.is_late && <span className="mr-1 text-red-600 font-bold">Late</span>}
                                                {record.status}
                                            </span>
                                        </td>
                                        <td className="py-4 px-4 text-secondary-600">
                                            {record.check_in ? new Date(record.check_in).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '-'}
                                        </td>
                                        <td className="py-4 px-4 text-secondary-600">
                                            {record.check_out ? new Date(record.check_out).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '-'}
                                        </td>
                                        <td className="py-4 px-4 text-secondary-600">
                                            {record.hours_worked ? `${record.hours_worked.toFixed(1)} hrs` : '-'}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </ModernCard>
        </div>
    )
}
