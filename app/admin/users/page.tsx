"use client"

import { useState, useEffect } from "react"
import { Users, UserPlus, Search, Filter, MoreVertical, Mail, Briefcase, Shield } from "lucide-react"
import { ActionButton } from "@/components/ui/action-button"
import { ModernCard } from "@/components/ui/modern-card"

export default function UsersPage() {
    const [users, setUsers] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [showAddForm, setShowAddForm] = useState(false)

    // Form State
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        employee_id: "",
        password: "", // In a real app, maybe generate or email this
        role: "employee",
        department: "",
        position: ""
    })

    useEffect(() => {
        fetchUsers()
    }, [])

    const fetchUsers = async () => {
        try {
            const res = await fetch('/api/users')
            if (res.ok) {
                const data = await res.json()
                setUsers(data.users)
            }
        } catch (error) {
            console.error("Failed to fetch users", error)
        } finally {
            setIsLoading(false)
        }
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        try {
            const res = await fetch('/api/users', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            })

            if (res.ok) {
                setShowAddForm(false)
                fetchUsers() // Refresh list
                // Reset form
                setFormData({
                    name: "", email: "", employee_id: "", password: "",
                    role: "employee", department: "", position: ""
                })
                alert("User created successfully!")
            } else {
                const err = await res.json()
                alert(err.error || "Failed to create user")
            }
        } catch (error) {
            console.error(error)
            alert("Something went wrong")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-heading font-bold text-secondary-900">User Management</h1>
                    <p className="text-secondary-500 text-sm mt-1">Manage employees, roles, and access permissions.</p>
                </div>
                <ActionButton variant="primary" onClick={() => setShowAddForm(!showAddForm)}>
                    <UserPlus size={18} />
                    {showAddForm ? 'Cancel' : 'Add Employee'}
                </ActionButton>
            </div>

            {/* Add User Form */}
            {showAddForm && (
                <div className="animate-slide-up">
                    <ModernCard title="Add New Employee">
                        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-secondary-700 mb-1">Full Name</label>
                                <input name="name" required value={formData.name} onChange={handleInputChange} className="w-full p-2.5 border border-secondary-200 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none transition-all" placeholder="John Doe" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-secondary-700 mb-1">Email Address</label>
                                <input name="email" type="email" required value={formData.email} onChange={handleInputChange} className="w-full p-2.5 border border-secondary-200 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none transition-all" placeholder="john@company.com" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-secondary-700 mb-1">Employee ID</label>
                                <input name="employee_id" required value={formData.employee_id} onChange={handleInputChange} className="w-full p-2.5 border border-secondary-200 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none transition-all" placeholder="EMP-001" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-secondary-700 mb-1">Initial Password</label>
                                <input name="password" type="password" required value={formData.password} onChange={handleInputChange} className="w-full p-2.5 border border-secondary-200 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none transition-all" placeholder="••••••••" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-secondary-700 mb-1">Department</label>
                                <input name="department" value={formData.department} onChange={handleInputChange} className="w-full p-2.5 border border-secondary-200 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none transition-all" placeholder="Engineering" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-secondary-700 mb-1">Role</label>
                                <select name="role" value={formData.role} onChange={handleInputChange} className="w-full p-2.5 border border-secondary-200 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none bg-white transition-all">
                                    <option value="employee">Employee</option>
                                    <option value="manager">Manager</option>
                                    <option value="admin">Admin</option>
                                </select>
                            </div>
                            <div className="md:col-span-2 flex justify-end pt-4">
                                <ActionButton variant="primary" type="submit" disabled={isLoading}>
                                    {isLoading ? 'Creating...' : 'Create Employee'}
                                </ActionButton>
                            </div>
                        </form>
                    </ModernCard>
                </div>
            )}

            {/* Users List */}
            <ModernCard title="All Users" subtitle={`${users.length} registered users`}>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-secondary-50 border-b border-secondary-100">
                            <tr>
                                <th className="text-left py-4 px-4 text-xs font-bold text-secondary-500 uppercase tracking-wider">Employee</th>
                                <th className="text-left py-4 px-4 text-xs font-bold text-secondary-500 uppercase tracking-wider">Role</th>
                                <th className="text-left py-4 px-4 text-xs font-bold text-secondary-500 uppercase tracking-wider">Department</th>
                                <th className="text-left py-4 px-4 text-xs font-bold text-secondary-500 uppercase tracking-wider">Joined</th>
                                <th className="text-right py-4 px-4 text-xs font-bold text-secondary-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-secondary-100">
                            {users.map((user: any) => (
                                <tr key={user.id} className="hover:bg-secondary-50/50 transition-colors group">
                                    <td className="py-4 px-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-indigo-500 flex items-center justify-center text-white font-bold text-sm shadow-sm ring-2 ring-white">
                                                {user.name.charAt(0)}
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-secondary-900 group-hover:text-primary-600 transition-colors">{user.name}</p>
                                                <p className="text-xs text-secondary-500 flex items-center gap-1">
                                                    {user.email}
                                                    <span className="w-1 h-1 rounded-full bg-secondary-300 mx-1"></span>
                                                    {user.employee_id}
                                                </p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-4 px-4">
                                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide
                      ${user.role === 'admin' ? 'bg-purple-100 text-purple-800' :
                                                user.role === 'manager' ? 'bg-primary-100 text-primary-800' : 'bg-secondary-100 text-secondary-800'}`}>
                                            {user.role}
                                        </span>
                                    </td>
                                    <td className="py-4 px-4 text-sm text-secondary-600 font-medium">{user.department || '-'}</td>
                                    <td className="py-4 px-4 text-sm text-secondary-500">
                                        {new Date(user.join_date).toLocaleDateString()}
                                    </td>
                                    <td className="py-4 px-4 text-right">
                                        <button className="text-secondary-400 hover:text-secondary-600 p-2 hover:bg-secondary-100 rounded-full transition-all">
                                            <MoreVertical size={18} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {users.length === 0 && !isLoading && (
                                <tr>
                                    <td colSpan={5} className="py-12 text-center text-secondary-500 text-sm flex flex-col items-center">
                                        <div className="w-12 h-12 bg-secondary-100 rounded-full flex items-center justify-center mb-3">
                                            <Users className="text-secondary-400" />
                                        </div>
                                        No users found. Add your first employee!
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </ModernCard>
        </div>
    )
}
