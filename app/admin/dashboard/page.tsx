"use client"

import { useState, useEffect } from "react"
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

  const [statsData, setStatsData] = useState([
    { title: "Total Employees", value: "-", change: "...", icon: Users, color: "blue" },
    { title: "Pending Leaves", value: "-", change: "...", icon: Calendar, color: "orange" },
    { title: "Today's Attendance", value: "-", change: "...", icon: Clock, color: "green" },
    { title: "Active Issues", value: "-", change: "...", icon: AlertCircle, color: "pink" },
  ]);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, activityRes] = await Promise.all([
          fetch('/api/admin/stats'),
          fetch('/api/admin/activity')
        ]);

        if (statsRes.ok) {
          const data = await statsRes.json();
          // Map icon strings back to components if needed, or update API to return data only
          // For now, assuming API returns structure that matches, but we need to map icons manually
          // creating a map of icon names
          const iconMap: any = { Users, Calendar, Clock, AlertCircle };

          const formattedStats = data.stats.map((s: any) => ({
            ...s,
            icon: iconMap[s.icon] || Users // Fallback
          }));
          setStatsData(formattedStats);
        }

        if (activityRes.ok) {
          const data = await activityRes.json();
          setActivities(data.activities);
        }

      } catch (error) {
        console.error("Failed to fetch dashboard data", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);



  const handleLogout = () => {
    document.cookie = "token=; path=/; max-age=0"
    window.location.href = "/login"
  }

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between">
        <div>
          <h1 className="text-3xl font-heading font-bold text-secondary-900">Dashboard Overview</h1>
          <p className="text-secondary-500 mt-1">Here's what's happening with your organization today.</p>
        </div>
        <div className="flex items-center space-x-3 mt-4 sm:mt-0">
          <ActionButton variant="secondary" size="sm">
            <Download size={18} />
            Export Report
          </ActionButton>
          <ActionButton variant="primary" size="sm" onClick={() => window.location.href = '/admin/users'}>
            <UserPlus size={18} />
            Add Employee
          </ActionButton>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsData.map((stat, index) => (
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
                    className={`px-3 py-2 text-sm font-medium rounded-lg transition-all ${activeTab === period.toLowerCase()
                      ? "bg-primary-50 text-primary-600 border border-primary-200"
                      : "text-secondary-600 hover:bg-secondary-50"
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
                    className="w-full bg-gradient-to-t from-primary-500 to-indigo-400 rounded-t-lg transition-all hover:opacity-80 cursor-pointer group-hover:shadow-lg"
                    style={{ height: `${height}%` }}
                  ></div>
                  <span className="text-xs text-secondary-400 mt-2 group-hover:font-semibold transition-all">
                    Day {index + 1}
                  </span>
                </div>
              ))}
            </div>
          </ModernCard>

          {/* Quick Stats Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gradient-to-br from-primary-600 to-indigo-500 rounded-2xl p-6 text-white shadow-soft card-hover">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-indigo-100 font-medium text-sm">Avg. Check-in</p>
                  <p className="text-2xl font-bold mt-2 font-heading">09:14 AM</p>
                </div>
                <Clock size={24} className="text-white/60" />
              </div>
            </div>

            <div className="bg-white border border-secondary-200 rounded-2xl p-6 shadow-soft card-hover">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-secondary-500 font-medium text-sm">Productivity</p>
                  <p className="text-2xl font-bold mt-2 font-heading text-emerald-600">87.5%</p>
                </div>
                <TrendingUp size={24} className="text-emerald-500/60" />
              </div>
            </div>

            <div className="bg-white border border-secondary-200 rounded-2xl p-6 shadow-soft card-hover">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-secondary-500 font-medium text-sm">Pending Tasks</p>
                  <p className="text-2xl font-bold mt-2 font-heading text-amber-600">12</p>
                </div>
                <FileText size={24} className="text-amber-500/60" />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-8">
          {/* Recent Activity */}
          <ModernCard title="Recent Activity">
            <div className="space-y-4">
              {activities.length === 0 ? <p className="text-secondary-500 text-sm">No recent activity</p> : null}
              {activities.map((activity: any, index) => (
                <div
                  key={index}
                  className="flex items-start space-x-3 group hover:bg-secondary-50 p-2 rounded-lg transition"
                >
                  <div
                    className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${activity.type === "leave"
                      ? "bg-blue-100"
                      : activity.type === "attendance"
                        ? "bg-emerald-100"
                        : activity.type === "medical"
                          ? "bg-rose-100"
                          : "bg-secondary-100"
                      }`}
                  >
                    {activity.type === "leave" && <Calendar size={18} className="text-blue-600" />}
                    {activity.type === "attendance" && <Clock size={18} className="text-emerald-600" />}
                    {activity.type === "medical" && <AlertCircle size={18} className="text-rose-600" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-secondary-900">{activity.user}</p>
                    <p className="text-sm text-secondary-600 truncate">{activity.action}</p>
                    <p className="text-xs text-secondary-400 mt-1">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </ModernCard>

          {/* Quick Actions */}
          <ModernCard title="Quick Actions">
            <div className="space-y-2">
              <ActionButton fullWidth variant="primary" size="md" onClick={() => window.location.href = '/admin/users'}>
                <Users size={18} />
                Manage Users
              </ActionButton>
              <ActionButton fullWidth variant="secondary" size="md">
                <BarChart3 size={18} />
                View Reports
              </ActionButton>
              <ActionButton fullWidth variant="secondary" size="md">
                <Settings size={18} />
                System Settings
              </ActionButton>
            </div>
          </ModernCard>
        </div>
      </div>
    </div>
  )
}
