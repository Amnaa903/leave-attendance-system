'use client';

import { useState } from 'react';
import { 
  Users, Calendar, Clock, AlertCircle, 
  TrendingUp, Download, Settings, Bell,
  LogOut, UserPlus, FileText, BarChart3
} from 'lucide-react';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  
  const stats = [
    { title: 'Total Employees', value: '156', change: '+12%', icon: Users, color: 'bg-blue-500' },
    { title: 'Pending Leaves', value: '23', change: '+5', icon: Calendar, color: 'bg-amber-500' },
    { title: 'Today\'s Attendance', value: '94%', change: '+2%', icon: Clock, color: 'bg-emerald-500' },
    { title: 'Active Issues', value: '7', change: '-3', icon: AlertCircle, color: 'bg-rose-500' },
  ];

  const recentActivities = [
    { user: 'Alex Johnson', action: 'applied for sick leave', time: '10 min ago', type: 'leave' },
    { user: 'Sarah Miller', action: 'marked attendance late', time: '25 min ago', type: 'attendance' },
    { user: 'Mike Chen', action: 'submitted medical certificate', time: '1 hour ago', type: 'medical' },
    { user: 'Lisa Wang', action: 'updated profile information', time: '2 hours ago', type: 'profile' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30">
      {/* Top Navigation */}
      <nav className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo and Brand */}
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">LS</span>
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                  LeaveSync
                </h1>
                <p className="text-xs text-gray-500">Admin Dashboard</p>
              </div>
            </div>

            {/* Right Section */}
            <div className="flex items-center space-x-4">
              <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition">
                <Bell size={20} />
              </button>
              <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition">
                <Settings size={20} />
              </button>
              <div className="h-8 w-px bg-gray-200"></div>
              <div className="flex items-center space-x-3">
                <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-full flex items-center justify-center">
                  <span className="text-white font-medium">A</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Admin User</p>
                  <p className="text-xs text-gray-500">admin@company.com</p>
                </div>
              </div>
              <button 
                onClick={() => {
                  document.cookie = 'token=; path=/; max-age=0';
                  window.location.href = '/login';
                }}
                className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-rose-500 to-pink-600 text-white rounded-lg hover:shadow-lg transition-all hover:scale-[1.02]"
              >
                <LogOut size={16} />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Welcome back, Admin 👋</h1>
            <p className="text-gray-600 mt-2">Here's what's happening with your organization today.</p>
          </div>
          <div className="flex items-center space-x-3">
            <button className="flex items-center space-x-2 px-4 py-2.5 bg-white border rounded-lg hover:bg-gray-50 transition">
              <Download size={16} />
              <span>Export Report</span>
            </button>
            <button className="flex items-center space-x-2 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-lg hover:shadow-lg transition">
              <UserPlus size={16} />
              <span>Add Employee</span>
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white rounded-2xl p-6 shadow-sm border hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 font-medium">{stat.title}</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
                  <p className={`text-sm mt-1 ${stat.change.startsWith('+') ? 'text-emerald-600' : 'text-rose-600'}`}>
                    <TrendingUp size={14} className="inline mr-1" />
                    {stat.change} from last month
                  </p>
                </div>
                <div className={`${stat.color} p-3 rounded-xl`}>
                  <stat.icon size={24} className="text-white" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Chart Section */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Attendance Overview</h3>
                  <p className="text-gray-500 text-sm">Monthly attendance trends</p>
                </div>
                <div className="flex space-x-2">
                  {['7D', '1M', '3M', '1Y'].map((period) => (
                    <button
                      key={period}
                      className={`px-3 py-1 text-sm rounded-lg ${activeTab === period.toLowerCase() ? 'bg-blue-50 text-blue-600' : 'text-gray-500 hover:bg-gray-50'}`}
                      onClick={() => setActiveTab(period.toLowerCase())}
                    >
                      {period}
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Simplified Chart */}
              <div className="h-64 flex items-end space-x-2">
                {[65, 80, 60, 75, 90, 85, 70].map((height, index) => (
                  <div key={index} className="flex-1 flex flex-col items-center">
                    <div 
                      className="w-full bg-gradient-to-t from-blue-500 to-cyan-400 rounded-t-lg transition-all hover:opacity-90"
                      style={{ height: `${height}%` }}
                    ></div>
                    <span className="text-xs text-gray-500 mt-2">Day {index + 1}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-100 rounded-2xl p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-blue-700 font-medium">Avg. Check-in Time</p>
                    <p className="text-2xl font-bold text-gray-900 mt-2">09:14 AM</p>
                  </div>
                  <Clock size={24} className="text-blue-500" />
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-emerald-50 to-green-50 border border-emerald-100 rounded-2xl p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-emerald-700 font-medium">Productivity Score</p>
                    <p className="text-2xl font-bold text-gray-900 mt-2">87.5%</p>
                  </div>
                  <TrendingUp size={24} className="text-emerald-500" />
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-100 rounded-2xl p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-amber-700 font-medium">Pending Tasks</p>
                    <p className="text-2xl font-bold text-gray-900 mt-2">12</p>
                  </div>
                  <FileText size={24} className="text-amber-500" />
                </div>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-8">
            {/* Recent Activity */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
                <button className="text-sm text-blue-600 hover:text-blue-800">View All</button>
              </div>
              
              <div className="space-y-4">
                {recentActivities.map((activity, index) => (
                  <div key={index} className="flex items-start space-x-3 group hover:bg-gray-50 p-2 rounded-lg transition">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      activity.type === 'leave' ? 'bg-blue-100' :
                      activity.type === 'attendance' ? 'bg-emerald-100' :
                      activity.type === 'medical' ? 'bg-rose-100' : 'bg-gray-100'
                    }`}>
                      {activity.type === 'leave' && <Calendar size={18} className="text-blue-600" />}
                      {activity.type === 'attendance' && <Clock size={18} className="text-emerald-600" />}
                      {activity.type === 'medical' && <AlertCircle size={18} className="text-rose-600" />}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{activity.user}</p>
                      <p className="text-sm text-gray-600">{activity.action}</p>
                      <p className="text-xs text-gray-400 mt-1">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-6 text-white">
              <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button className="w-full flex items-center justify-between p-3 bg-white/10 hover:bg-white/20 rounded-xl transition">
                  <div className="flex items-center space-x-3">
                    <Users size={18} />
                    <span>Manage Users</span>
                  </div>
                  <span>→</span>
                </button>
                
                <button className="w-full flex items-center justify-between p-3 bg-white/10 hover:bg-white/20 rounded-xl transition">
                  <div className="flex items-center space-x-3">
                    <BarChart3 size={18} />
                    <span>View Reports</span>
                  </div>
                  <span>→</span>
                </button>
                
                <button className="w-full flex items-center justify-between p-3 bg-white/10 hover:bg-white/20 rounded-xl transition">
                  <div className="flex items-center space-x-3">
                    <Settings size={18} />
                    <span>System Settings</span>
                  </div>
                  <span>→</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}