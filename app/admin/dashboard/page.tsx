"use client"

import { useState } from "react"
import {
  Users,
  Calendar,
  Clock,
  AlertCircle,
  TrendingUp,
  Download,
  Settings,
  Bell,
  LogOut,
  UserPlus,
  FileText,
  BarChart3,
} from "lucide-react"
import { StatCard } from "@/components/ui/stat-card"
import { ModernCard } from "@/components/ui/modern-card"
import { ActionButton } from "@/components/ui/action-button"

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("1m")

  const stats = [
    { title: "Total Employees", value: "156", change: "+12%", icon: Users, color: "blue" },
    { title: "Pending Leaves", value: "23", change: "+5", icon: Calendar, color: "orange" },
    { title: "Today's Attendance", value: "94%", change: "+2%", icon: Clock, color: "green" },
    { title: "Active Issues", value: "7", change: "-3", icon: AlertCircle, color: "pink" },
  ]

  const recentActivities = [
    { user: "Alex Johnson", action: "applied for sick leave", time: "10 min ago", type: "leave" },
    { user: "Sarah Miller", action: "marked attendance late", time: "25 min ago", type: "attendance" },
    { user: "Mike Chen", action: "submitted medical certificate", time: "1 hour ago", type: "medical" },
    { user: "Lisa Wang", action: "updated profile information", time: "2 hours ago", type: "profile" },
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
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">LS</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">LeaveSync</h1>
                <p className="text-xs text-gray-500">Admin Dashboard</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <button
                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition"
                aria-label="Notifications"
              >
                <Bell size={20} />
              </button>
              <button
                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition"
                aria-label="Settings"
              >
                <Settings size={20} />
              </button>
              <div className="h-8 w-px bg-gray-200"></div>
              <div className="flex items-center space-x-3">
                <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-full flex items-center justify-center">
                  <span className="text-white font-medium text-sm">A</span>
                </div>
                <div className="hidden sm:block">
                  <p className="text-sm font-medium text-gray-900">Admin User</p>
                  <p className="text-xs text-gray-600">admin@company.com</p>
                </div>
              </div>
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
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900">Welcome back, Admin</h1>
            <p className="text-gray-600 mt-2">Here's what's happening with your organization today.</p>
          </div>
          <div className="flex items-center space-x-3 mt-4 sm:mt-0">
            <ActionButton variant="secondary" size="sm">
              <Download size={18} />
              Export Report
            </ActionButton>
            <ActionButton variant="primary" size="sm">
              <UserPlus size={18} />
              Add Employee
            </ActionButton>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <StatCard
              key={index}
              title={stat.title}
              value={stat.value}
              subtitle={stat.change}
              icon={<stat.icon size={24} />}
              color={stat.color as any}
            />
          ))}
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Attendance Chart */}
            <ModernCard title="Attendance Overview" subtitle="Monthly attendance trends">
              <div className="flex items-center justify-between mb-6">
                <div className="flex space-x-2">
                  {["7D", "1M", "3M", "1Y"].map((period) => (
                    <button
                      key={period}
                      onClick={() => setActiveTab(period.toLowerCase())}
                      className={`px-3 py-2 text-sm font-medium rounded-lg transition-all ${
                        activeTab === period.toLowerCase()
                          ? "bg-blue-50 text-blue-600 border border-blue-200"
                          : "text-gray-600 hover:bg-gray-50"
                      }`}
                    >
                      {period}
                    </button>
                  ))}
                </div>
              </div>

              <div className="h-64 flex items-end space-x-2">
                {[65, 80, 60, 75, 90, 85, 70].map((height, index) => (
                  <div key={index} className="flex-1 flex flex-col items-center group">
                    <div
                      className="w-full bg-gradient-to-t from-blue-500 to-cyan-400 rounded-t-lg transition-all hover:opacity-80 cursor-pointer group-hover:shadow-lg"
                      style={{ height: `${height}%` }}
                    ></div>
                    <span className="text-xs text-gray-600 mt-2 group-hover:font-semibold transition-all">
                      Day {index + 1}
                    </span>
                  </div>
                ))}
              </div>
            </ModernCard>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gradient-to-br from-blue-500 to-cyan-400 rounded-2xl p-6 text-white shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-100 font-medium text-sm">Avg. Check-in</p>
                    <p className="text-2xl font-bold mt-2">09:14 AM</p>
                  </div>
                  <Clock size={24} className="text-white/60" />
                </div>
              </div>

              <div className="bg-gradient-to-br from-emerald-500 to-teal-400 rounded-2xl p-6 text-white shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-emerald-100 font-medium text-sm">Productivity Score</p>
                    <p className="text-2xl font-bold mt-2">87.5%</p>
                  </div>
                  <TrendingUp size={24} className="text-white/60" />
                </div>
              </div>

              <div className="bg-gradient-to-br from-amber-500 to-orange-400 rounded-2xl p-6 text-white shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-amber-100 font-medium text-sm">Pending Tasks</p>
                    <p className="text-2xl font-bold mt-2">12</p>
                  </div>
                  <FileText size={24} className="text-white/60" />
                </div>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-8">
            {/* Recent Activity */}
            <ModernCard title="Recent Activity">
              <div className="space-y-4">
                {recentActivities.map((activity, index) => (
                  <div
                    key={index}
                    className="flex items-start space-x-3 group hover:bg-gray-50 p-2 rounded-lg transition"
                  >
                    <div
                      className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                        activity.type === "leave"
                          ? "bg-blue-100"
                          : activity.type === "attendance"
                            ? "bg-emerald-100"
                            : activity.type === "medical"
                              ? "bg-rose-100"
                              : "bg-gray-100"
                      }`}
                    >
                      {activity.type === "leave" && <Calendar size={18} className="text-blue-600" />}
                      {activity.type === "attendance" && <Clock size={18} className="text-emerald-600" />}
                      {activity.type === "medical" && <AlertCircle size={18} className="text-rose-600" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">{activity.user}</p>
                      <p className="text-sm text-gray-600 truncate">{activity.action}</p>
                      <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </ModernCard>

            {/* Quick Actions */}
            <ModernCard title="Quick Actions">
              <div className="space-y-2">
                <ActionButton fullWidth variant="primary" size="md">
                  <Users size={18} />
                  Manage Users
                </ActionButton>
                <ActionButton fullWidth variant="primary" size="md">
                  <BarChart3 size={18} />
                  View Reports
                </ActionButton>
                <ActionButton fullWidth variant="primary" size="md">
                  <Settings size={18} />
                  System Settings
                </ActionButton>
              </div>
            </ModernCard>
          </div>
        </div>
      </main>
    </div>
  )
}
