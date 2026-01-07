export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 flex items-center justify-center p-4">
      <div className="text-center max-w-2xl">
        <h1 className="text-5xl font-bold text-gray-900 mb-6">
          ✅ Leave & Attendance System
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Professional HR Management Platform
        </p>

        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <div className="flex items-center justify-center mb-6">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <span className="text-3xl">🎉</span>
            </div>
          </div>

          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Day 1: Setup Complete!
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-bold text-blue-700 mb-1">Database</h3>
              <p className="text-gray-700 text-sm">MySQL Connected</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="font-bold text-green-700 mb-1">Prisma</h3>
              <p className="text-gray-700 text-sm">ORM Ready</p>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <h3 className="font-bold text-purple-700 mb-1">Next.js</h3>
              <p className="text-gray-700 text-sm">14.2.35 Running</p>
            </div>
          </div>

          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="font-bold mb-4">Test Users Created:</h3>
            <div className="space-y-3 text-left">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-blue-500 rounded-full mr-3"></div>
                <span><strong>Admin:</strong> admin@company.com / admin123</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
                <span><strong>Manager:</strong> manager@company.com / manager123</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-purple-500 rounded-full mr-3"></div>
                <span><strong>Employee:</strong> employee@company.com / employee123</span>
              </div>
            </div>
          </div>
        </div>

        <div className="text-gray-500 text-sm">
          <p>Ready to build dashboards, authentication, and business logic!</p>
          <p className="mt-2">Tomorrow: Authentication System & Login Pages</p>
        </div>
      </div>
    </div>
  )
}