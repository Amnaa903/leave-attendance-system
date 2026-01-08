"use client"
import { LogOut, Calendar, Clock, TrendingUp, Eye } from "lucide-react"
import { StatCard } from "@/components/ui/stat-card"
import { ProgressBar } from "@/components/ui/progress-bar"
import { Badge } from "@/components/ui/badge"
import { ModernCard } from "@/components/ui/modern-card"
import { ActionButton } from "@/components/ui/action-button"

export default function EmployeeDashboard() {
  const leaveBalance = {
    sick: { total: 7, used: 2, remaining: 5 },
    casual: { total: 7, used: 3, remaining: 4 },
    earned: { total: 0, used: 0, remaining: 0 },
  }

  const recentLeaves = [
    { id: 1, type: "Sick", date: "Jan 5-6, 2024", status: "Approved", days: 2 },
    { id: 2, type: "Casual", date: "Dec 20, 2023", status: "Approved", days: 1 },
    { id: 3, type: "Casual", date: "Dec 15, 2023", status: "Approved", days: 1 },
  ]

  const attendance = {
    present: 18,
    absent: 2,
    late: 1,
    percentage: 90,
  }

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
              <span className="text-sm text-gray-600">EMP001</span>
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
        <div className="mb-8 flex justify-between items-start">
          <div>
            <h1 className="text-4xl font-bold text-gray-900">Welcome back!</h1>
            <p className="text-gray-600 mt-2">Here's your leave and attendance summary</p>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-600 mb-1">Status</div>
            <Badge label="Present • Checked In" variant="success" />
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Sick Leave"
            value={leaveBalance.sick.remaining}
            subtitle={`of ${leaveBalance.sick.total} days`}
            color="blue"
            icon={<Calendar size={24} />}
          />
          <StatCard
            title="Casual Leave"
            value={leaveBalance.casual.remaining}
            subtitle={`of ${leaveBalance.casual.total} days`}
            color="green"
            icon={<Calendar size={24} />}
          />
          <StatCard
            title="Attendance"
            value={`${attendance.percentage}%`}
            subtitle="This month"
            color="cyan"
            icon={<Clock size={24} />}
          />
          <StatCard
            title="Leaves Taken"
            value={leaveBalance.sick.used + leaveBalance.casual.used}
            subtitle="This year"
            color="purple"
            icon={<TrendingUp size={24} />}
          />
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Leave Balance Details */}
            <ModernCard title="Leave Balance" subtitle="Detailed breakdown of your leave quota">
              <div className="space-y-6">
                <ProgressBar
                  label="Sick Leave"
                  value={leaveBalance.sick.used}
                  max={leaveBalance.sick.total}
                  color="blue"
                />
                <ProgressBar
                  label="Casual Leave"
                  value={leaveBalance.casual.used}
                  max={leaveBalance.casual.total}
                  color="green"
                />
              </div>
              <div className="mt-6 pt-6 border-t border-gray-100">
                <ActionButton fullWidth variant="primary">
                  <Calendar size={18} />
                  Apply for New Leave
                </ActionButton>
              </div>
            </ModernCard>

            {/* Recent Leave History */}
            <ModernCard title="Leave History" subtitle="Your recent leave applications">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-100">
                      <th className="text-left py-3 text-sm font-semibold text-gray-700">Type</th>
                      <th className="text-left py-3 text-sm font-semibold text-gray-700">Date</th>
                      <th className="text-left py-3 text-sm font-semibold text-gray-700">Duration</th>
                      <th className="text-left py-3 text-sm font-semibold text-gray-700">Status</th>
                      <th className="text-right py-3 text-sm font-semibold text-gray-700">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentLeaves.map((leave) => (
                      <tr key={leave.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                        <td className="py-4">
                          <div className="flex items-center space-x-2">
                            <div
                              className={`w-3 h-3 rounded-full ${
                                leave.type === "Sick" ? "bg-blue-500" : "bg-green-500"
                              }`}
                            ></div>
                            <span className="text-sm font-medium">{leave.type}</span>
                          </div>
                        </td>
                        <td className="py-4 text-sm text-gray-600">{leave.date}</td>
                        <td className="py-4 text-sm text-gray-600">{leave.days} days</td>
                        <td className="py-4">
                          <Badge label={leave.status} variant={leave.status === "Approved" ? "success" : "info"} />
                        </td>
                        <td className="py-4 text-right">
                          <button className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center space-x-1 ml-auto">
                            <Eye size={16} />
                            <span>View</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </ModernCard>
          </div>

          {/* Right Column */}
          <div className="space-y-8">
            {/* Quick Actions */}
            <ModernCard title="Quick Actions">
              <div className="space-y-3">
                <ActionButton fullWidth variant="primary" size="md">
                  <Calendar size={18} />
                  Apply Leave
                </ActionButton>
                <ActionButton fullWidth variant="secondary" size="md">
                  <Clock size={18} />
                  Mark Attendance
                </ActionButton>
                <ActionButton fullWidth variant="secondary" size="md">
                  <Eye size={18} />
                  View Reports
                </ActionButton>
              </div>
            </ModernCard>

            {/* Attendance Summary */}
            <ModernCard title="Attendance Summary">
              <div className="text-center mb-6">
                <div className="text-5xl font-bold text-gray-900">{attendance.percentage}%</div>
                <div className="text-sm text-gray-600 mt-2">This month</div>
              </div>
              <div className="space-y-3 border-t border-gray-100 pt-6">
                <div className="flex justify-between">
                  <span className="text-gray-700">Present</span>
                  <span className="font-semibold text-gray-900">{attendance.present} days</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-700">Absent</span>
                  <span className="font-semibold text-gray-900">{attendance.absent} days</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-700">Late Markings</span>
                  <span className="font-semibold text-gray-900">{attendance.late}</span>
                </div>
              </div>
            </ModernCard>

            {/* Upcoming Holidays */}
            <ModernCard title="Upcoming Holidays">
              <div className="space-y-3">
                {[
                  { name: "Republic Day", date: "January 26", type: "Public Holiday", color: "blue" },
                  { name: "Holi", date: "March 25", type: "Festival", color: "green" },
                  { name: "Eid al-Fitr", date: "April 11", type: "Religious", color: "purple" },
                ].map((holiday, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-lg bg-gray-50 border border-gray-100 hover:border-gray-200 transition-colors"
                  >
                    <div className="font-medium text-gray-900">{holiday.name}</div>
                    <div className="text-sm text-gray-600">{holiday.date}</div>
                    <div className="text-xs text-gray-500 mt-1">{holiday.type}</div>
                  </div>
                ))}
              </div>
            </ModernCard>
          </div>
        </div>
      </main>
    </div>
  )
}
