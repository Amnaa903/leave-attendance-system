"use client"

import { CheckCircle, XCircle, Eye, LogOut, Users, AlertCircle } from "lucide-react"
import { StatCard } from "@/components/ui/stat-card"
import { Badge } from "@/components/ui/badge"
import { ModernCard } from "@/components/ui/modern-card"
import { ActionButton } from "@/components/ui/action-button"

export default function ManagerDashboard() {
  const teamStats = {
    total: 15,
    present: 13,
    onLeave: 2,
    pendingLeaves: 5,
  }

  const leaveRequests = [
    {
      id: 1,
      name: "Michael Scott",
      empId: "EMP007",
      role: "Sales Executive",
      type: "Sick",
      date: "Jan 10 - Jan 12, 2024",
      days: 3,
      reason: "Fever and doctor's advice for rest",
    },
    {
      id: 2,
      name: "Pam Beesly",
      empId: "EMP012",
      role: "Receptionist",
      type: "Casual",
      date: "Jan 15, 2024",
      days: 1,
      reason: "Family function",
    },
  ]

  const handleLogout = () => {
    document.cookie = "token=; path=/; max-age=0"
    window.location.href = "/login"
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30">
      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">LS</span>
              </div>
              <h1 className="text-xl font-bold text-gray-900">LeaveSync</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">Manager Panel</span>
              <ActionButton variant="danger" size="sm" onClick={handleLogout}>
                <LogOut size={16} />
                Logout
              </ActionButton>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900">Manager Dashboard</h1>
          <p className="text-gray-600 mt-2">Manage your team's leaves and attendance</p>
        </div>

        {/* Team Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Team Size"
            value={teamStats.total}
            subtitle="Total members"
            color="blue"
            icon={<Users size={24} />}
          />
          <StatCard
            title="Present Today"
            value={teamStats.present}
            subtitle="Currently working"
            color="green"
            icon={<Users size={24} />}
          />
          <StatCard
            title="On Leave"
            value={teamStats.onLeave}
            subtitle="Away today"
            color="orange"
            icon={<AlertCircle size={24} />}
          />
          <StatCard
            title="Pending Approvals"
            value={teamStats.pendingLeaves}
            subtitle="Awaiting decision"
            color="pink"
            icon={<AlertCircle size={24} />}
          />
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Leave Approvals */}
          <div className="lg:col-span-2 space-y-8">
            {/* Leave Requests */}
            <ModernCard title="Leave Requests" subtitle="Pending approvals from your team">
              <div className="space-y-4">
                {leaveRequests.map((request) => (
                  <div
                    key={request.id}
                    className="border border-gray-100 rounded-xl p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <div className="font-semibold text-gray-900">{request.name}</div>
                        <div className="text-sm text-gray-600">
                          ID: {request.empId} • {request.role}
                        </div>
                      </div>
                      <Badge label={request.type} variant={request.type === "Sick" ? "error" : "info"} />
                    </div>
                    <div className="text-sm text-gray-700 mb-4 bg-gray-50 p-3 rounded-lg space-y-1">
                      <div>
                        <span className="font-medium">Dates:</span> {request.date}
                      </div>
                      <div>
                        <span className="font-medium">Duration:</span> {request.days} days
                      </div>
                      <div>
                        <span className="font-medium">Reason:</span> {request.reason}
                      </div>
                    </div>
                    <div className="flex space-x-3">
                      <ActionButton fullWidth variant="success" size="sm">
                        <CheckCircle size={18} />
                        Approve
                      </ActionButton>
                      <ActionButton fullWidth variant="danger" size="sm">
                        <XCircle size={18} />
                        Reject
                      </ActionButton>
                      <ActionButton fullWidth variant="secondary" size="sm">
                        <Eye size={18} />
                        Details
                      </ActionButton>
                    </div>
                  </div>
                ))}
              </div>
            </ModernCard>

            {/* Team Overview */}
            <ModernCard title="Team Overview" subtitle="Current status of all team members">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-100">
                      <th className="text-left py-3 text-sm font-semibold text-gray-700">Employee</th>
                      <th className="text-left py-3 text-sm font-semibold text-gray-700">Status</th>
                      <th className="text-left py-3 text-sm font-semibold text-gray-700">Leaves Taken</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { name: "Jim Halpert", dept: "Sales", status: "Present", leaves: "4/14" },
                      { name: "Dwight Schrute", dept: "Sales", status: "Present", leaves: "2/14" },
                      { name: "Andy Bernard", dept: "Sales", status: "On Leave", leaves: "7/14" },
                    ].map((emp, idx) => (
                      <tr key={idx} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                        <td className="py-4">
                          <div className="font-medium text-gray-900">{emp.name}</div>
                          <div className="text-sm text-gray-600">{emp.dept}</div>
                        </td>
                        <td className="py-4">
                          <Badge label={emp.status} variant={emp.status === "Present" ? "success" : "warning"} />
                        </td>
                        <td className="py-4 text-sm font-medium text-gray-900">{emp.leaves}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </ModernCard>
          </div>

          {/* Right Column */}
          <div className="space-y-8">
            {/* Attendance Summary */}
            <ModernCard title="Today's Attendance">
              <div className="mb-6">
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Attendance Rate</span>
                  <span className="font-semibold text-gray-900">
                    {Math.round((teamStats.present / teamStats.total) * 100)}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="h-3 rounded-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all"
                    style={{ width: `${(teamStats.present / teamStats.total) * 100}%` }}
                  ></div>
                </div>
              </div>
              <div className="space-y-3 border-t border-gray-100 pt-4">
                <div className="flex items-center justify-between p-2 rounded-lg bg-gray-50">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                    <span className="text-sm text-gray-700">Present</span>
                  </div>
                  <span className="font-semibold">{teamStats.present}</span>
                </div>
                <div className="flex items-center justify-between p-2 rounded-lg bg-gray-50">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                    <span className="text-sm text-gray-700">On Leave</span>
                  </div>
                  <span className="font-semibold">{teamStats.onLeave}</span>
                </div>
                <div className="flex items-center justify-between p-2 rounded-lg bg-gray-50">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 rounded-full bg-rose-500"></div>
                    <span className="text-sm text-gray-700">Absent</span>
                  </div>
                  <span className="font-semibold">{teamStats.total - teamStats.present - teamStats.onLeave}</span>
                </div>
              </div>
            </ModernCard>

            {/* Upcoming Leaves */}
            <ModernCard title="Upcoming Leaves">
              <div className="space-y-3">
                {[
                  { name: "Stanley Hudson", date: "Jan 18-19", type: "Vacation", color: "blue" },
                  { name: "Phyllis Vance", date: "Jan 22", type: "Casual", color: "green" },
                  { name: "Kevin Malone", date: "Jan 25-26", type: "Sick", color: "purple" },
                ].map((item, idx) => (
                  <div key={idx} className={`border-l-4 pl-3 py-2 border-${item.color}-500`}>
                    <div className="font-medium text-gray-900">{item.name}</div>
                    <div className="text-sm text-gray-600">
                      {item.date} • {item.type}
                    </div>
                  </div>
                ))}
              </div>
            </ModernCard>

            {/* Month Summary */}
            <ModernCard title="Month Summary">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-blue-50 border border-blue-100 rounded-lg text-center">
                  <div className="text-2xl font-bold text-blue-600">12</div>
                  <div className="text-xs text-gray-600 mt-1">Approved</div>
                </div>
                <div className="p-3 bg-rose-50 border border-rose-100 rounded-lg text-center">
                  <div className="text-2xl font-bold text-rose-600">3</div>
                  <div className="text-xs text-gray-600 mt-1">Rejected</div>
                </div>
                <div className="p-3 bg-emerald-50 border border-emerald-100 rounded-lg text-center">
                  <div className="text-2xl font-bold text-emerald-600">95%</div>
                  <div className="text-xs text-gray-600 mt-1">Attendance</div>
                </div>
                <div className="p-3 bg-amber-50 border border-amber-100 rounded-lg text-center">
                  <div className="text-2xl font-bold text-amber-600">2</div>
                  <div className="text-xs text-gray-600 mt-1">Late</div>
                </div>
              </div>
            </ModernCard>
          </div>
        </div>
      </main>
    </div>
  )
}
