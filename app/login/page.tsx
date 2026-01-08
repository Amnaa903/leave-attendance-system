'use client';

import { useState } from 'react';
import { LogIn } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      
      if (res.ok) {
        // Redirect based on role
        if (data.user.role === 'ADMIN') {
          window.location.href = '/admin/dashboard';
        } else if (data.user.role === 'MANAGER') {
          window.location.href = '/manager/dashboard';
        } else {
          window.location.href = '/employee/dashboard';
        }
      } else {
        setError(data.error || 'Login failed');
      }
    } catch (err) {
      setError('Network error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-gray-50 p-4">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-2xl shadow-md border">
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-full flex items-center justify-center">
              <LogIn size={24} className="text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Leave Management System</h1>
          <p className="mt-2 text-gray-600">Track leaves, manage attendance, and streamline HR processes</p>
        </div>
        
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="block w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              placeholder="Enter your email"
              required
              aria-required="true"
              aria-label="Email address"
            />
          </div>
          
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="block w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              placeholder="Enter your password"
              required
              aria-required="true"
              aria-label="Password"
            />
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 text-white py-3 px-4 rounded-lg font-medium hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:scale-105"
            aria-label={loading ? 'Signing in...' : 'Sign in to your account'}
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Signing in...
              </span>
            ) : (
              'Sign In'
            )}
          </button>
        </form>
        
        <div className="mt-8 pt-6 border-t border-gray-200">
          <p className="text-center text-gray-600 text-sm mb-4">
            Demo Credentials:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
            <div className="bg-gray-50 p-3 rounded-lg">
              <div className="font-medium text-gray-900 mb-1">Admin</div>
              <div className="text-gray-600">admin@company.com</div>
              <div className="text-gray-600">Password: admin123</div>
            </div>
            
            <div className="bg-gray-50 p-3 rounded-lg">
              <div className="font-medium text-gray-900 mb-1">Manager</div>
              <div className="text-gray-600">manager@company.com</div>
              <div className="text-gray-600">Password: manager123</div>
            </div>
          
            <div className="bg-gray-50 p-3 rounded-lg">
              <div className="font-medium text-gray-900 mb-1">Employee</div>
              <div className="text-gray-600">employee@company.com</div>
              <div className="text-gray-600">Password: employee123</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}