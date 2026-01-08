export default function ManagerDashboard() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-900">Manager Dashboard</h1>
      <p className="mt-2 text-gray-600">Welcome to the manager panel</p>
      
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="font-medium">Team Members</h3>
          <p className="text-2xl font-bold mt-2">15</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="font-medium">Pending Leaves</h3>
          <p className="text-2xl font-bold mt-2">8</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="font-medium">Today's Attendance</h3>
          <p className="text-2xl font-bold mt-2">14/15</p>
        </div>
      </div>
    </div>
  );
}