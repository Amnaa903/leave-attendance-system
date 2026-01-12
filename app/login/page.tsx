'use client';

import { useState } from 'react';
import { LogIn, Mail, Lock, ArrowRight, CheckCircle } from 'lucide-react';
import Image from 'next/image';

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
        const role = data.user.role.toUpperCase();
        if (role === 'ADMIN') {
          window.location.href = '/admin/dashboard';
        } else if (role === 'MANAGER') {
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
    <div className="min-h-screen w-full flex">
      {/* Left Side - Image Section (Hidden on mobile) */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-secondary-900">
        <Image
          src="/login-bg.png"
          alt="Office Workspace"
          fill
          className="object-cover opacity-80 mix-blend-overlay"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-br from-primary-900/90 to-secondary-900/90" />

        <div className="relative z-10 flex flex-col justify-between h-full p-12 text-white">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-white/10 rounded-lg backdrop-blur-sm border border-white/20">
              <LogIn className="text-white" size={24} />
            </div>
            <span className="text-xl font-bold font-heading tracking-tight">LMS Portal</span>
          </div>

          <div className="space-y-6 max-w-lg">
            <h1 className="text-5xl font-heading font-bold leading-tight">
              Streamline your <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-indigo-300">Work Life.</span>
            </h1>
            <p className="text-lg text-secondary-200 font-light leading-relaxed">
              Manage your attendance, apply for leaves, and stay connected with your team seamlessly. The future of workplace management is here.
            </p>

            <div className="flex items-center gap-4 pt-4">
              <div className="flex -space-x-3">
                {[1, 2, 3].map(i => (
                  <div key={i} className="w-10 h-10 rounded-full border-2 border-primary-900 bg-secondary-700 flex items-center justify-center text-xs font-bold">
                    {String.fromCharCode(64 + i)}
                  </div>
                ))}
              </div>
              <div className="text-sm font-medium">
                <span className="text-white">Trusted by teams everywhere</span>
                <div className="flex text-yellow-400 gap-0.5 text-xs">
                  ★★★★★
                </div>
              </div>
            </div>
          </div>

          <div className="text-xs text-secondary-400 font-medium">
            © 2026 Company Inc. All rights reserved.
          </div>
        </div>
      </div>

      {/* Right Side - Form Section */}
      <div className="w-full lg:w-1/2 flex items-center justify-center bg-white p-8">
        <div className="w-full max-w-md space-y-8 animate-fade-in">
          <div className="text-center lg:text-left">
            <h2 className="text-3xl font-heading font-bold text-secondary-900">Welcome Back</h2>
            <p className="mt-2 text-secondary-500">Please enter your details to sign in.</p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl flex items-center gap-2 text-sm">
              <CheckCircle size={16} className="text-red-500" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-secondary-700 mb-1.5" htmlFor="email">Email Address</label>
                <div className="relative group">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary-400 group-focus-within:text-primary-500 transition-colors" size={20} />
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-secondary-50 border border-secondary-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all font-medium text-secondary-900 placeholder:text-secondary-400"
                    placeholder="name@company.com"
                    required
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-sm font-bold text-secondary-700" htmlFor="password">Password</label>
                  <a href="/forgot-password" className="text-xs font-bold text-primary-600 hover:text-primary-700 transition-colors">Forgot password?</a>
                </div>
                <div className="relative group">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary-400 group-focus-within:text-primary-500 transition-colors" size={20} />
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-secondary-50 border border-secondary-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all font-medium text-secondary-900 placeholder:text-secondary-400"
                    placeholder="••••••••"
                    required
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-primary-600 to-indigo-600 hover:from-primary-700 hover:to-indigo-700 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-primary-500/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2 group"
            >
              {loading ? 'Signing in...' : 'Sign in'}
              {!loading && <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />}
            </button>
          </form>

          {/* Demo Credentials Section */}
          <div className="pt-6 border-t border-secondary-100">
            <p className="text-secondary-400 text-xs font-bold uppercase tracking-wider mb-3">Quick Login (Demo)</p>
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin">
              {[
                { role: 'Admin', email: 'admin@company.com', pass: 'admin123', color: 'bg-rose-50 text-rose-700 border-rose-100' },
                { role: 'Manager', email: 'manager@company.com', pass: 'manager123', color: 'bg-amber-50 text-amber-700 border-amber-100' },
                { role: 'Employee', email: 'employee@company.com', pass: 'employee123', color: 'bg-emerald-50 text-emerald-700 border-emerald-100' }
              ].map((cred) => (
                <button
                  key={cred.role}
                  onClick={() => { setEmail(cred.email); setPassword(cred.pass); }}
                  className={`flex flex-col items-start p-2.5 rounded-lg border text-xs min-w-[120px] transition-transform hover:scale-105 ${cred.color}`}
                >
                  <span className="font-bold">{cred.role}</span>
                  <span className="opacity-75">{cred.pass}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}