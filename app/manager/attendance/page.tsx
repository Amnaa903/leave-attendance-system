"use client"

import { useState, useEffect } from "react"
import { Clock, Users, Search } from "lucide-react"
import { ModernCard } from "@/components/ui/modern-card"

interface AttendanceRecord {
    id: string
    date: string
    check_in: string | null
    check_out: string | null
    status: string
    is_late: boolean
    hours_worked: number | null
    employee: {
        name: string
        department: string
        employee_id: string
    }
}

export default function ManagerAttendancePage() {
    const [attendance, setAttendance] = useState<AttendanceRecord[]>([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState("")

    useEffect(() => {
        const fetchAttendance = async () => {
            try {
                const res = await fetch('/api/manager/attendance')
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

    const filteredAttendance = attendance.filter(record =>
        record.employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.employee.employee_id.toLowerCase().includes(searchTerm.toLowerCase())
    )

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center bg-gray-50">Loading...</div>
    }

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-heading font-bold text-secondary-900">Employee Attendance</h1>
                <p className="text-secondary-500">Monitor daily attendance and check-in times for your team.</p>
            </div>

            <ModernCard title="Attendance Records" header={true}>
                {/* Search Bar */}
                <div className="mb-6">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary-400" size={20} />
                        <input
                            type="text"
                            placeholder="Search by name or ID..."
                            className="w-full pl-10 pr-4 py-2 rounded-lg border border-secondary-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    {filteredAttendance.length === 0 ? (
                        <div className="text-center py-8 text-secondary-500">
                            No attendance records found.
                        </div>
                    ) : (
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-secondary-200 bg-secondary-50/50">
                                    <th className="py-4 px-4 text-sm font-semibold text-secondary-500 uppercase tracking-wider">Employee</th>
                                    <th className="py-4 px-4 text-sm font-semibold text-secondary-500 uppercase tracking-wider">Date</th>
                                    <th className="py-4 px-4 text-sm font-semibold text-secondary-500 uppercase tracking-wider">Status</th>
                                    <th className="py-4 px-4 text-sm font-semibold text-secondary-500 uppercase tracking-wider">Check In</th>
                                    <th className="py-4 px-4 text-sm font-semibold text-secondary-500 uppercase tracking-wider">Check Out</th>
                                    <th className="py-4 px-4 text-sm font-semibold text-secondary-500 uppercase tracking-wider">Hours</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredAttendance.map((record) => (
                                    <tr key={record.id} className="border-b border-secondary-100 last:border-0 hover:bg-secondary-50 transition-colors">
                                        <td className="py-4 px-4">
                                            <div>
                                                <p className="font-bold text-secondary-900">{record.employee.name}</p>
                                                <p className="text-xs text-secondary-500">{record.employee.department} • {record.employee.employee_id}</p>
                                            </div>
                                        </td>
                                        <td className="py-4 px-4 text-secondary-600 font-medium">
                                            {new Date(record.date).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}
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
