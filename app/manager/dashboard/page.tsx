'use client';

import { useState } from 'react';

export default function ManagerDashboard() {
  const teamStats = {
    total: 15,
    present: 13,
    onLeave: 2,
    pendingLeaves: 5
  };

  const handleLogout = () => {
    document.cookie = 'token=; path=/; max-age=0';
    window.location.href = '/login';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-gray-900">Leave Management System</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">Manager Panel</span>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="px-4 sm:px-0 mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Manager Dashboard</h1>
          <p className="mt-2 text-gray-600">Manage your team's leaves and attendance</p>
        </div>

        {/* Team Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-medium text-gray-900">Team Size</h3>
            <p className="mt-2 text-3xl font-bold text-blue-600">{teamStats.total}</p>
            <p className="text-sm text-gray-500">Total members</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-medium text-gray-900">Present Today</h3>
            <p className="mt-2 text-3xl font-bold text-green-600">{teamStats.present}</p>
            <p className="text-sm text-gray-500">Currently working</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-medium text-gray-900">On Leave</h3>
            <p className="mt-2 text-3xl font-bold text-yellow-600">{teamStats.onLeave}</p>
            <p className="text-sm text-gray-500">Away today</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-medium text-gray-900">Pending Approvals</h3>
            <p className="mt-2 text-3xl font-bold text-orange-600">{teamStats.pendingLeaves}</p>
            <p className="text-sm text-gray-500">Awaiting decision</p>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Leave Approvals */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b">
                <h3 className="text-lg font-medium text-gray-900">Leave Requests to Approve</h3>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {/* Request 1 */}
                  <div className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <div className="font-medium text-gray-900">Michael Scott</div>
                        <div className="text-sm text-gray-600">ID: EMP007 • Sales Executive</div>
                      </div>
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">Sick Leave</span>
                    </div>
                    <div className="text-sm text-gray-700 mb-3">
                      <div>📅 <span className="font-medium">Jan 10 - Jan 12, 2024</span> (3 days)</div>
                      <div>📝 Reason: Fever and doctor's advice for rest</div>
                    </div>
                    <div className="flex space-x-2">
                      <button className="flex-1 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">
                        Approve
                      </button>
                      <button className="flex-1 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">
                        Reject
                      </button>
                      <button className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300">
                        View Details
                      </button>
                    </div>
                  </div>

                  {/* Request 2 */}
                  <div className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <div className="font-medium text-gray-900">Pam Beesly</div>
                        <div className="text-sm text-gray-600">ID: EMP012 • Receptionist</div>
                      </div>
                      <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">Casual Leave</span>
                    </div>
                    <div className="text-sm text-gray-700 mb-3">
                      <div>📅 <span className="font-medium">Jan 15, 2024</span> (1 day)</div>
                      <div>📝 Reason: Family function</div>
                    </div>
                    <div className="flex space-x-2">
                      <button className="flex-1 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">
                        Approve
                      </button>
                      <button className="flex-1 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">
                        Reject
                      </button>
                      <button className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300">
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Team View */}
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b">
                <h3 className="text-lg font-medium text-gray-900">Team Overview</h3>
              </div>
              <div className="p-6">
                <div className="overflow-x-auto">
                  <table className="min-w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2 text-sm font-medium text-gray-700">Employee</th>
                        <th className="text-left py-2 text-sm font-medium text-gray-700">Status</th>
                        <th className="text-left py-2 text-sm font-medium text-gray-700">Leaves Taken</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b">
                        <td className="py-3">
                          <div className="font-medium">Jim Halpert</div>
                          <div className="text-sm text-gray-600">Sales</div>
                        </td>
                        <td className="py-3">
                          <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs">Present</span>
                        </td>
                        <td className="py-3">4/14</td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-3">
                          <div className="font-medium">Dwight Schrute</div>
                          <div className="text-sm text-gray-600">Sales</div>
                        </td>
                        <td className="py-3">
                          <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs">Present</span>
                        </td>
                        <td className="py-3">2/14</td>
                      </tr>
                      <tr>
                        <td className="py-3">
                          <div className="font-medium">Andy Bernard</div>
                          <div className="text-sm text-gray-600">Sales</div>
                        </td>
                        <td className="py-3">
                          <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded text-xs">On Leave</span>
                        </td>
                        <td className="py-3">7/14</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Attendance Summary */}
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b">
                <h3 className="text-lg font-medium text-gray-900">Today's Attendance</h3>
              </div>
              <div className="p-6">
                <div className="mb-6">
                  <div className="flex justify-between mb-1">
                    <span className="text-gray-700">Attendance Rate</span>
                    <span className="font-medium">{Math.round((teamStats.present / teamStats.total) * 100)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div 
                      className="bg-green-600 h-3 rounded-full" 
                      style={{ width: `${(teamStats.present / teamStats.total) * 100}%` }}
                    ></div>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <div className="flex items-center">
                      <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                      <span>Present</span>
                    </div>
                    <span className="font-medium">{teamStats.present}</span>
                  </div>
                  
                  <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <div className="flex items-center">
                      <div className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></div>
                      <span>On Leave</span>
                    </div>
                    <span className="font-medium">{teamStats.onLeave}</span>
                  </div>
                  
                  <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <div className="flex items-center">
                      <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
                      <span>Absent</span>
                    </div>
                    <span className="font-medium">{teamStats.total - teamStats.present - teamStats.onLeave}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Upcoming Leaves */}
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b">
                <h3 className="text-lg font-medium text-gray-900">Upcoming Leaves</h3>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  <div className="border-l-4 border-blue-500 pl-4 py-2">
                    <div className="font-medium">Stanley Hudson</div>
                    <div className="text-sm text-gray-600">Jan 18-19 • Vacation</div>
                    <div className="text-xs text-gray-500">Approved</div>
                  </div>
                  
                  <div className="border-l-4 border-green-500 pl-4 py-2">
                    <div className="font-medium">Phyllis Vance</div>
                    <div className="text-sm text-gray-600">Jan 22 • Casual</div>
                    <div className="text-xs text-gray-500">Pending approval</div>
                  </div>
                  
                  <div className="border-l-4 border-purple-500 pl-4 py-2">
                    <div className="font-medium">Kevin Malone</div>
                    <div className="text-sm text-gray-600">Jan 25-26 • Sick</div>
                    <div className="text-xs text-gray-500">Approved</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b">
                <h3 className="text-lg font-medium text-gray-900">Month Summary</h3>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-blue-50 rounded">
                    <div className="text-2xl font-bold text-blue-600">12</div>
                    <div className="text-sm text-gray-600">Leaves Approved</div>
                  </div>
                  
                  <div className="text-center p-3 bg-red-50 rounded">
                    <div className="text-2xl font-bold text-red-600">3</div>
                    <div className="text-sm text-gray-600">Leaves Rejected</div>
                  </div>
                  
                  <div className="text-center p-3 bg-green-50 rounded">
                    <div className="text-2xl font-bold text-green-600">95%</div>
                    <div className="text-sm text-gray-600">Attendance Rate</div>
                  </div>
                  
                  <div className="text-center p-3 bg-yellow-50 rounded">
                    <div className="text-2xl font-bold text-yellow-600">2</div>
                    <div className="text-sm text-gray-600">Late Markings</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}