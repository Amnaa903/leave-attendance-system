"use client"

import { useState } from "react"
import { Calendar, AlertCircle, FileText, ArrowLeft, Send } from "lucide-react"
import { ActionButton } from "@/components/ui/action-button"
import { ModernCard } from "@/components/ui/modern-card"
import { useRouter } from "next/navigation"

export default function ApplyLeavePage() {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState({
        leave_type: 'sick',
        start_date: '',
        end_date: '',
        reason: '',
        is_sandwich: false,
        proof_url: ''
    })

    // Basic validation state
    // In a real app we'd validate days count dynamically against remaining balance here too

    const handleChange = (e: any) => {
        const { name, value, type, checked } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        try {
            const res = await fetch('/api/leave', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            })

            if (res.ok) {
                alert('Leave application submitted successfully!')
                router.push('/employee/dashboard')
            } else {
                const err = await res.json()
                alert(err.error || 'Failed to submit application')
            }
        } catch (error) {
            console.error(error)
            alert('An error occurred')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="space-y-8">
            <div className="max-w-2xl mx-auto">
                <button
                    onClick={() => router.back()}
                    className="flex items-center text-secondary-500 hover:text-secondary-900 mb-6 transition-colors font-medium "
                >
                    <ArrowLeft size={18} className="mr-1" /> Back to Dashboard
                </button>

                <h1 className="text-3xl font-heading font-bold text-secondary-900 mb-2">Apply for Leave</h1>
                <p className="text-secondary-500 mb-8">Submit your leave request below. Make sure to check your balance first.</p>

                <ModernCard title="Application Form">
                    <form onSubmit={handleSubmit} className="space-y-6">

                        {/* Leave Type */}
                        <div>
                            <label className="block text-sm font-bold text-secondary-700 mb-3">Select Leave Type</label>
                            <div className="grid grid-cols-3 gap-4">
                                {['sick', 'casual', 'medical'].map((type) => (
                                    <div
                                        key={type}
                                        onClick={() => setFormData({ ...formData, leave_type: type })}
                                        className={`
                                    cursor-pointer rounded-xl border-2 p-4 text-center capitalize transition-all duration-200 font-bold
                                    ${formData.leave_type === type
                                                ? 'border-primary-500 bg-primary-50 text-primary-700 shadow-sm'
                                                : 'border-secondary-100 hover:border-secondary-300 hover:bg-secondary-50 text-secondary-600'
                                            }
                                `}
                                    >
                                        {type}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Dates */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-secondary-700 mb-1">Start Date</label>
                                <input
                                    type="date"
                                    name="start_date"
                                    required
                                    className="w-full p-3 border border-secondary-200 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none transition-all"
                                    onChange={handleChange}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-secondary-700 mb-1">End Date</label>
                                <input
                                    type="date"
                                    name="end_date"
                                    required
                                    className="w-full p-3 border border-secondary-200 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none transition-all"
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        {/* Reason */}
                        <div>
                            <label className="block text-sm font-medium text-secondary-700 mb-1">Reason</label>
                            <textarea
                                name="reason"
                                required
                                rows={3}
                                className="w-full p-3 border border-secondary-200 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none transition-all"
                                placeholder="Briefly explain why you need leave..."
                                onChange={handleChange}
                            />
                        </div>

                        {/* Sandwich Rule Checkbox */}
                        <div className="flex items-start space-x-3 p-4 bg-amber-50 rounded-xl border border-amber-100">
                            <input
                                type="checkbox"
                                name="is_sandwich"
                                id="sandwich"
                                className="mt-1 h-5 w-5 text-amber-600 rounded border-amber-300 focus:ring-amber-500"
                                checked={formData.is_sandwich}
                                onChange={handleChange}
                            />
                            <label htmlFor="sandwich" className="text-sm text-amber-900 cursor-pointer">
                                <span className="font-bold block">This is a Sandwich Leave</span>
                                <span className="text-xs text-amber-700">Check this if your leave adjoins a weekend or holiday. Note: Requires 7 days prior notice. Max 2 per 4 months.</span>
                            </label>
                        </div>

                        {/* Medical Proof URL (Optional unless Medical > 3 days) */}
                        {formData.leave_type === 'medical' && (
                            <div className="animate-fade-in">
                                <label className="block text-sm font-medium text-secondary-700 mb-1">Medical Certificate URL</label>
                                <input
                                    type="url"
                                    name="proof_url"
                                    className="w-full p-3 border border-secondary-200 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none transition-all"
                                    placeholder="https://drive.google.com/file/..."
                                    onChange={handleChange}
                                />
                                <p className="text-xs text-secondary-500 mt-1">Required if leave is longer than 3 days.</p>
                            </div>
                        )}

                        <div className="pt-4">
                            <ActionButton fullWidth variant="primary" type="submit" disabled={loading} size="lg">
                                {loading ? 'Submitting Application...' : 'Submit Application'}
                            </ActionButton>
                        </div>

                    </form>
                </ModernCard>
            </div>
        </div>
    )
}
