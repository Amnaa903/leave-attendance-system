'use client';

import { useState } from 'react';

export default function EmployeeDashboard() {
  const leaveBalance = {
    sick: { total: 7, used: 2, remaining: 5 },
    casual: { total: 7, used: 3, remaining: 4 },
    earned: { total: 0, used: 0, remaining: 0 }
  };

  const recentLeaves = [
    { id: 1, type: 'Sick', date: 'Jan 5-6, 2024', status: 'Approved', days: 2 },
    { id: 2, type: 'Casual', date: 'Dec 20, 2023', status: 'Approved', days: 1 },
    { id: 3, type: 'Casual', date: 'Dec 15, 2023', status: 'Approved', days: 1 },
  ];

  const attendance = {
    present: 18,
    absent: 2,
    late: 1,
    percentage: 90
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
              <span className="text-gray-700">Employee ID: EMP001</span>
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
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Employee Dashboard</h1>
              <p className="mt-2 text-gray-600">Welcome back, Regular Employee!</p>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-500">Current Status</div>
              <div className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                Present • Checked In
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-medium text-gray-900">Sick Leave</h3>
            <p className="mt-2 text-3xl font-bold text-blue-600">{leaveBalance.sick.remaining}<span className="text-lg text-gray-500">/{leaveBalance.sick.total}</span></p>
            <p className="text-sm text-gray-500">Days remaining</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-medium text-gray-900">Casual Leave</h3>
            <p className="mt-2 text-3xl font-bold text-green-600">{leaveBalance.casual.remaining}<span className="text-lg text-gray-500">/{leaveBalance.casual.total}</span></p>
            <p className="text-sm text-gray-500">Days remaining</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-medium text-gray-900">Attendance</h3>
            <p className="mt-2 text-3xl font-bold text-purple-600">{attendance.percentage}%</p>
            <p className="text-sm text-gray-500">This month</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-medium text-gray-900">Leaves Taken</h3>
            <p className="mt-2 text-3xl font-bold text-orange-600">{leaveBalance.sick.used + leaveBalance.casual.used}</p>
            <p className="text-sm text-gray-500">This year</p>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Leave Balance Details */}
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b">
                <h3 className="text-lg font-medium text-gray-900">Leave Balance Details</h3>
              </div>
              <div className="p-6">
                <div className="space-y-6">
                  {/* Sick Leave */}
                  <div>
                    <div className="flex justify-between mb-2">
                      <div>
                        <span className="font-medium text-gray-900">Sick Leave</span>
                        <span className="ml-2 text-sm text-gray-500">(Medical/Health reasons)</span>
                      </div>
                      <span className="font-medium">{leaveBalance.sick.remaining} days remaining</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div 
                        className="bg-blue-600 h-3 rounded-full" 
                        style={{ width: `${(leaveBalance.sick.used / leaveBalance.sick.total) * 100}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between text-sm text-gray-500 mt-1">
                      <span>Used: {leaveBalance.sick.used} days</span>
                      <span>Total: {leaveBalance.sick.total} days</span>
                    </div>
                  </div>

                  {/* Casual Leave */}
                  <div>
                    <div className="flex justify-between mb-2">
                      <div>
                        <span className="font-medium text-gray-900">Casual Leave</span>
                        <span className="ml-2 text-sm text-gray-500">(Personal/Family reasons)</span>
                      </div>
                      <span className="font-medium">{leaveBalance.casual.remaining} days remaining</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div 
                        className="bg-green-600 h-3 rounded-full" 
                        style={{ width: `${(leaveBalance.casual.used / leaveBalance.casual.total) * 100}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between text-sm text-gray-500 mt-1">
                      <span>Used: {leaveBalance.casual.used} days</span>
                      <span>Total: {leaveBalance.casual.total} days</span>
                    </div>
                  </div>
                </div>

                {/* Apply Leave Button */}
                <div className="mt-6 pt-6 border-t">
                  <button className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium">
                    + Apply for New Leave
                  </button>
                  <p className="text-sm text-gray-500 text-center mt-2">
                    Click to submit a new leave application
                  </p>
                </div>
              </div>
            </div>

            {/* Recent Leave History */}
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b">
                <h3 className="text-lg font-medium text-gray-900">Recent Leave History</h3>
              </div>
              <div className="p-6">
                <div className="overflow-x-auto">
                  <table className="min-w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 text-sm font-medium text-gray-700">Leave Type</th>
                        <th className="text-left py-3 text-sm font-medium text-gray-700">Date</th>
                        <th className="text-left py-3 text-sm font-medium text-gray-700">Duration</th>
                        <th className="text-left py-3 text-sm font-medium text-gray-700">Status</th>
                        <th className="text-left py-3 text-sm font-medium text-gray-700">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentLeaves.map((leave) => (
                        <tr key={leave.id} className="border-b hover:bg-gray-50">
                          <td className="py-4">
                            <div className="flex items-center">
                              <div className={`w-3 h-3 rounded-full mr-2 ${
                                leave.type === 'Sick' ? 'bg-blue-500' : 'bg-green-500'
                              }`}></div>
                              {leave.type}
                            </div>
                          </td>
                          <td className="py-4">{leave.date}</td>
                          <td className="py-4">{leave.days} day{leave.days > 1 ? 's' : ''}</td>
                          <td className="py-4">
                            <span className={`px-2 py-1 rounded text-xs ${
                              leave.status === 'Approved' 
                                ? 'bg-green-100 text-green-800'
                                : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {leave.status}
                            </span>
                          </td>
                          <td className="py-4">
                            <button className="text-blue-600 hover:text-blue-800 text-sm">
                              View Details
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b">
                <h3 className="text-lg font-medium text-gray-900">Quick Actions</h3>
              </div>
              <div className="p-6">
                <div className="space-y-3">
                  <button className="w-full p-4 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 text-left flex items-center">
                    <div className="mr-3">📅</div>
                    <div>
                      <div className="font-medium">Mark Attendance</div>
                      <div className="text-sm">Check-in/Check-out</div>
                    </div>
                  </button>
                  
                  <button className="w-full p-4 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 text-left flex items-center">
                    <div className="mr-3">📝</div>
                    <div>
                      <div className="font-medium">Apply Leave</div>
                      <div className="text-sm">Submit new request</div>
                    </div>
                  </button>
                  
                  <button className="w-full p-4 bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 text-left flex items-center">
                    <div className="mr-3">📊</div>
                    <div>
                      <div className="font-medium">View Reports</div>
                      <div className="text-sm">Attendance history</div>
                    </div>
                  </button>
                  
                  <button className="w-full p-4 bg-yellow-50 text-yellow-700 rounded-lg hover:bg-yellow-100 text-left flex items-center">
                    <div className="mr-3">⚙️</div>
                    <div>
                      <div className="font-medium">Profile Settings</div>
                      <div className="text-sm">Update information</div>
                    </div>
                  </button>
                </div>
              </div>
            </div>

            {/* Attendance Summary */}
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b">
                <h3 className="text-lg font-medium text-gray-900">Attendance Summary</h3>
              </div>
              <div className="p-6">
                <div className="text-center mb-6">
                  <div className="text-5xl font-bold text-gray-900">{attendance.percentage}%</div>
                  <div className="text-gray-500">This month</div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-700">Present</span>
                    <span className="font-medium">{attendance.present} days</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-700">Absent</span>
                    <span className="font-medium">{attendance.absent} days</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-700">Late Markings</span>
                    <span className="font-medium">{attendance.late}</span>
                  </div>
                </div>
                
                <div className="mt-6 pt-6 border-t">
                  <div className="text-sm text-gray-500 mb-2">Today's Status</div>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">Checked In</div>
                      <div className="text-sm text-gray-500">09:15 AM</div>
                    </div>
                    <button className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 text-sm">
                      Check Out
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Upcoming Holidays */}
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b">
                <h3 className="text-lg font-medium text-gray-900">Upcoming Holidays</h3>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <div className="font-medium">Republic Day</div>
                    <div className="text-sm text-gray-600">January 26, 2024</div>
                    <div className="text-xs text-blue-600">Public Holiday</div>
                  </div>
                  
                  <div className="p-3 bg-green-50 rounded-lg">
                    <div className="font-medium">Holi</div>
                    <div className="text-sm text-gray-600">March 25, 2024</div>
                    <div className="text-xs text-green-600">Festival</div>
                  </div>
                  
                  <div className="p-3 bg-purple-50 rounded-lg">
                    <div className="font-medium">Eid al-Fitr</div>
                    <div className="text-sm text-gray-600">April 11, 2024</div>
                    <div className="text-xs text-purple-600">Religious Holiday</div>
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