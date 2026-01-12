"use client"

import { useState } from "react"
import { Mail, ArrowRight, ArrowLeft, CheckCircle, AlertCircle } from "lucide-react"
import Link from "next/link"

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [message, setMessage] = useState("")
    const [error, setError] = useState("")

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        setError("")
        setMessage("")

        try {
            const res = await fetch('/api/auth/reset-password/request', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email })
            })

            const data = await res.json()

            if (res.ok) {
                setMessage(data.message)
            } else {
                setError(data.error || "Something went wrong")
            }
        } catch (err) {
            setError("Network error. Please try again.")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-secondary-50 flex items-center justify-center p-6">
            <div className="w-full max-w-md bg-white rounded-3xl shadow-xl shadow-secondary-200/50 p-8 space-y-8 animate-fade-in">
                <div className="text-center space-y-2">
                    <div className="w-16 h-16 bg-primary-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <Mail className="text-primary-600" size={32} />
                    </div>
                    <h1 className="text-3xl font-heading font-bold text-secondary-900">Forgot Password?</h1>
                    <p className="text-secondary-500 font-medium">No worries, we'll send you reset instructions.</p>
                </div>

                {message ? (
                    <div className="bg-emerald-50 border border-emerald-100 p-6 rounded-2xl text-center space-y-4">
                        <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mx-auto">
                            <CheckCircle className="text-emerald-600" size={24} />
                        </div>
                        <p className="text-emerald-800 text-sm font-medium">{message}</p>
                        <Link
                            href="/login"
                            className="inline-flex items-center gap-2 text-emerald-700 hover:text-emerald-800 text-sm font-bold pt-2"
                        >
                            <ArrowLeft size={16} />
                            Back to Login
                        </Link>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {error && (
                            <div className="bg-red-50 border border-red-100 p-4 rounded-xl flex items-center gap-3 text-red-700 text-sm animate-shake">
                                <AlertCircle size={20} className="text-red-500 shrink-0" />
                                <p className="font-medium">{error}</p>
                            </div>
                        )}

                        <div>
                            <label className="block text-sm font-bold text-secondary-700 mb-2" htmlFor="email">Email Address</label>
                            <div className="relative group">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary-400 group-focus-within:text-primary-500 transition-colors" size={20} />
                                <input
                                    id="email"
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full pl-12 pr-4 py-3.5 bg-secondary-50 border border-secondary-200 rounded-2xl focus:bg-white focus:ring-4 focus:ring-primary-100 focus:border-primary-500 outline-none transition-all font-medium text-secondary-900 placeholder:text-secondary-400"
                                    placeholder="your@company.com"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-gradient-to-r from-primary-600 to-indigo-600 hover:from-primary-700 hover:to-indigo-700 text-white font-bold py-4 rounded-2xl shadow-lg shadow-primary-500/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2 group"
                        >
                            {isLoading ? 'Processing...' : 'Reset Password'}
                            {!isLoading && <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />}
                        </button>

                        <div className="text-center pt-2">
                            <Link
                                href="/login"
                                className="inline-flex items-center gap-2 text-secondary-500 hover:text-secondary-900 text-sm font-bold transition-colors"
                            >
                                <ArrowLeft size={16} />
                                Back to Login
                            </Link>
                        </div>
                    </form>
                )}
            </div>
        </div>
    )
}
