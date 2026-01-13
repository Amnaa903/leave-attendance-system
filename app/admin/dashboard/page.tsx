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
  CheckCircle,
  XCircle,
} from "lucide-react"
import { StatCard } from "@/components/ui/stat-card"
import { ModernCard } from "@/components/ui/modern-card"
import { ActionButton } from "@/components/ui/action-button"

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("7d")

  const [statsData, setStatsData] = useState([
    { title: "Total Employees", value: "-", change: "...", icon: Users, color: "blue" },
    { title: "Pending Leaves", value: "-", change: "...", icon: Calendar, color: "orange" },
    { title: "Today's Attendance", value: "-", change: "...", icon: Clock, color: "green" },
    { title: "Active Issues", value: "-", change: "...", icon: AlertCircle, color: "pink" },
  ]);
  const [breakdown, setBreakdown] = useState<any>(null);
  const [historicalData, setHistoricalData] = useState<any[]>([]);
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
          const iconMap: any = { Users, Calendar, Clock, AlertCircle };

          const formattedStats = data.stats.map((s: any) => ({
            ...s,
            icon: iconMap[s.icon] || Users
          }));
          setStatsData(formattedStats);
          setBreakdown(data.breakdown);
          setHistoricalData(data.historicalData || []);
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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    )
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-zebra font-bold text-secondary-900 tracking-wider">Dashboard Overview</h1>
          <p className="text-secondary-500 mt-1">Real-time organization metrics and attendance status.</p>
        </div>
        <div className="flex items-center space-x-3">
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
            valueClassName={stat.title === "Active Issues" ? "font-creepster text-3xl" : ""}
          />
        ))}
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-8">
          {/* Attendance Chart */}
          <ModernCard title="Attendance Overview" subtitle="Attendance percentage over the last 7 days">
            <div className="h-72 mt-6">
              {historicalData.length > 0 ? (
                <div className="h-full flex items-end space-x-4">
                  {historicalData.map((item, index) => (
                    <div key={index} className="flex-1 flex flex-col items-center group relative">
                      {/* Tooltip */}
                      <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-secondary-900 text-white text-[10px] py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-20 pointer-events-none">
                        {item.percentage}% Attendance
                      </div>

                      <div
                        className="w-full bg-gradient-to-t from-primary-600 to-indigo-400 rounded-t-xl transition-all duration-500 ease-out hover:from-primary-500 hover:to-indigo-300 cursor-pointer shadow-sm hover:shadow-md group-hover:scale-x-105"
                        style={{ height: `${Math.max(item.percentage, 5)}%` }}
                      ></div>
                      <span className="text-[10px] font-bold text-secondary-500 mt-3 uppercase tracking-tighter group-hover:text-primary-600 transition-colors">
                        {item.day}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="h-full flex items-center justify-center border-2 border-dashed border-secondary-100 rounded-2xl text-secondary-400">
                  <BarChart3 size={48} className="mr-3 opacity-20" />
                  <p className="font-medium text-sm">No historical data available yet</p>
                </div>
              )}
            </div>
          </ModernCard>

          {/* Workforce Status Breakdown */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white border border-secondary-200 rounded-2xl p-6 shadow-soft card-hover relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-16 h-16 bg-emerald-500/5 rounded-bl-full transition-transform group-hover:scale-110" />
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 bg-emerald-100 rounded-lg text-emerald-600">
                  <CheckCircle size={20} />
                </div>
                <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">Active</span>
              </div>
              <p className="text-secondary-500 font-bold text-xs uppercase tracking-wider">Present Today</p>
              <p className="text-3xl font-heading font-extrabold mt-1 text-secondary-900">{breakdown?.present || 0}</p>
              <div className="mt-3 w-full bg-secondary-100 h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-emerald-500 h-full rounded-full transition-all duration-1000"
                  style={{ width: `${breakdown?.total ? (breakdown.present / breakdown.total) * 100 : 0}%` }}
                />
              </div>
            </div>

            <div className="bg-white border border-secondary-200 rounded-2xl p-6 shadow-soft card-hover relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-16 h-16 bg-amber-500/5 rounded-bl-full transition-transform group-hover:scale-110" />
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 bg-amber-100 rounded-lg text-amber-600">
                  <Clock size={20} />
                </div>
                <span className="text-xs font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">Delayed</span>
              </div>
              <p className="text-secondary-500 font-bold text-xs uppercase tracking-wider">Late Arrivals</p>
              <p className="text-3xl font-heading font-extrabold mt-1 text-secondary-900">{breakdown?.late || 0}</p>
              <p className="text-[10px] text-secondary-400 mt-2 font-medium">Excluding early departures</p>
            </div>

            <div className="bg-white border border-secondary-200 rounded-2xl p-6 shadow-soft card-hover relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-16 h-16 bg-rose-500/5 rounded-bl-full transition-transform group-hover:scale-110" />
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 bg-rose-100 rounded-lg text-rose-600">
                  <XCircle size={20} />
                </div>
                <span className="text-xs font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full">Unavailable</span>
              </div>
              <p className="text-secondary-500 font-bold text-xs uppercase tracking-wider">Absent / On Leave</p>
              <p className="text-3xl font-heading font-extrabold mt-1 text-secondary-900">{breakdown?.absent || 0}</p>
              <p className="text-[10px] text-secondary-400 mt-2 font-medium">Out of {breakdown?.total || 0} total employees</p>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-8">
          {/* Recent Activity */}
          <ModernCard title="Recent Activity">
            <div className="space-y-4">
              {activities.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 opacity-40">
                  <Bell size={40} className="text-secondary-300 mb-2" />
                  <p className="text-secondary-500 text-xs font-bold uppercase tracking-widest">No activity</p>
                </div>
              ) : null}
              {activities.map((activity: any, index) => (
                <div
                  key={index}
                  className="flex items-start space-x-3 group hover:bg-secondary-50 p-2.5 rounded-xl transition-all cursor-pointer border border-transparent hover:border-secondary-100 shadow-sm hover:shadow"
                >
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm ${activity.type === "leave"
                      ? "bg-blue-100 text-blue-600"
                      : "bg-emerald-100 text-emerald-600"
                      }`}
                  >
                    {activity.type === "leave" ? <Calendar size={18} /> : <Clock size={18} />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-secondary-900 group-hover:text-primary-600 transition-colors">{activity.user}</p>
                    <p className="text-xs text-secondary-500 font-medium truncate mt-0.5 capitalize">{activity.action}</p>
                    <p className="text-[10px] text-secondary-400 mt-1 font-bold">{activity.time} • {activity.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </ModernCard>

          {/* Quick Actions */}
          <ModernCard title="Quick Actions">
            <div className="space-y-3">
              <ActionButton fullWidth variant="primary" size="md" onClick={() => window.location.href = '/admin/users'} className="shadow-lg shadow-primary-500/20 py-4 font-bold tracking-wide">
                <Users size={18} className="mr-2" />
                Manage Employees
              </ActionButton>
              <ActionButton fullWidth variant="secondary" size="md" onClick={() => window.location.href = '/manager/attendance'} className="py-4 font-bold border-secondary-200">
                <BarChart3 size={18} className="mr-2" />
                Detailed Attendance
              </ActionButton>
              <ActionButton fullWidth variant="secondary" size="md" className="py-4 font-bold border-secondary-200 opacity-60">
                <Settings size={18} className="mr-2" />
                System Config
              </ActionButton>
            </div>
          </ModernCard>
        </div>
      </div>
    </div>
  )
}
