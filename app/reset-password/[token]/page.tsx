"use client"

import { useState } from "react"
import { Lock, ArrowRight, ArrowLeft, CheckCircle, AlertCircle, Eye, EyeOff } from "lucide-react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"

export default function ResetPasswordPage() {
    const { token } = useParams()
    const router = useRouter()

    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [showPassword, setShowPassword] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [isSuccess, setIsSuccess] = useState(false)
    const [error, setError] = useState("")

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (password !== confirmPassword) {
            setError("Passwords do not match")
            return
        }

        if (password.length < 6) {
            setError("Password must be at least 6 characters")
            return
        }

        setIsLoading(true)
        setError("")

        try {
            const res = await fetch('/api/auth/reset-password/confirm', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token, password })
            })

            const data = await res.json()

            if (res.ok) {
                setIsSuccess(true)
                // Redirect after 3 seconds
                setTimeout(() => {
                    router.push('/login')
                }, 3000)
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
                    <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <Lock className="text-indigo-600" size={32} />
                    </div>
                    <h1 className="text-3xl font-heading font-bold text-secondary-900">Set New Password</h1>
                    <p className="text-secondary-500 font-medium">Please enter your new password below.</p>
                </div>

                {isSuccess ? (
                    <div className="bg-emerald-50 border border-emerald-100 p-8 rounded-2xl text-center space-y-4">
                        <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto animate-bounce">
                            <CheckCircle className="text-emerald-600" size={32} />
                        </div>
                        <div className="space-y-1">
                            <h3 className="text-xl font-bold text-emerald-900">Password Reset!</h3>
                            <p className="text-emerald-700 text-sm font-medium">Your password has been updated successfully.</p>
                        </div>
                        <p className="text-emerald-600/60 text-xs pt-2">Redirecting you to login...</p>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {error && (
                            <div className="bg-red-50 border border-red-100 p-4 rounded-xl flex items-center gap-3 text-red-700 text-sm animate-shake">
                                <AlertCircle size={20} className="text-red-500 shrink-0" />
                                <p className="font-medium">{error}</p>
                            </div>
                        )}

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-bold text-secondary-700 mb-2" htmlFor="password">New Password</label>
                                <div className="relative group">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary-400 group-focus-within:text-indigo-500 transition-colors" size={20} />
                                    <input
                                        id="password"
                                        type={showPassword ? "text" : "password"}
                                        required
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full pl-12 pr-12 py-3.5 bg-secondary-50 border border-secondary-200 rounded-2xl focus:bg-white focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 outline-none transition-all font-medium text-secondary-900"
                                        placeholder="Min 6 characters"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-secondary-400 hover:text-secondary-600 transition-colors"
                                    >
                                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                    </button>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-secondary-700 mb-2" htmlFor="confirm">Confirm Password</label>
                                <div className="relative group">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary-400 group-focus-within:text-indigo-500 transition-colors" size={20} />
                                    <input
                                        id="confirm"
                                        type={showPassword ? "text" : "password"}
                                        required
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        className="w-full pl-12 pr-4 py-3.5 bg-secondary-50 border border-secondary-200 rounded-2xl focus:bg-white focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 outline-none transition-all font-medium text-secondary-900"
                                        placeholder="Confirm your password"
                                    />
                                </div>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-gradient-to-r from-indigo-600 to-primary-600 hover:from-indigo-700 hover:to-primary-700 text-white font-bold py-4 rounded-2xl shadow-lg shadow-indigo-500/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2 group"
                        >
                            {isLoading ? 'Updating...' : 'Set Password'}
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
