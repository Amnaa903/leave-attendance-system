'use client';

import {
    LayoutDashboard,
    Users,
    Calendar,
    Clock,
    FileText,
    LogOut,
    Menu,
    X,
    Settings
} from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';

type Role = 'ADMIN' | 'MANAGER' | 'EMPLOYEE';

interface SidebarProps {
    role: Role;
    user?: any; // Pass full user object if needed for avatar/name
}

export default function AppSidebar({ role }: SidebarProps) {
    const pathname = usePathname();
    const router = useRouter();
    const [isOpen, setIsOpen] = useState(false);

    // Define navigation items with role access
    const navItems = [
        {
            label: 'Dashboard',
            href: `/${role.toLowerCase()}/dashboard`,
            icon: LayoutDashboard,
            roles: ['ADMIN', 'MANAGER', 'EMPLOYEE']
        },
        {
            label: 'Employees',
            href: '/admin/users',
            icon: Users,
            roles: ['ADMIN']
        },
        {
            label: 'Leave Requests',
            href: '/manager/leaves', // Assume this route exists or map correctly
            icon: FileText,
            roles: ['MANAGER']
        },
        {
            label: 'Apply Leave',
            href: '/employee/leave/apply',
            icon: Calendar,
            roles: ['EMPLOYEE']
        },
        {
            label: 'My Attendance', // Could point to history or dashboard
            href: '/employee/attendance',
            icon: Clock,
            roles: ['EMPLOYEE']
        },
        // Add Admin Stats/Reports if separate link needed
    ];

    const filteredNav = navItems.filter(item => item.roles.includes(role));

    const handleLogout = async () => {
        // Call logout API or clear cookie
        await fetch('/api/auth/logout', { method: 'POST' }); // Ensure this endpoint exists or handle client-side
        // For now, simple redirect (assuming middleware handles session) or basic cleanup
        document.cookie = 'token=; Max-Age=0; path=/;';
        router.push('/login');
    };

    return (
        <>
            {/* Mobile Toggle */}
            <button
                className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-soft text-secondary-600"
                onClick={() => setIsOpen(!isOpen)}
            >
                {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            {/* Sidebar Container */}
            <aside className={`
        fixed top-0 left-0 z-40 h-screen w-72 
        bg-white/80 backdrop-blur-xl border-r border-secondary-200
        transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
                {/* Logo Area */}
                <div className="h-20 flex items-center px-8 border-b border-secondary-100">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-indigo-600 flex items-center justify-center mr-3">
                        <span className="text-white font-bold text-lg">L</span>
                    </div>
                    <span className="font-heading font-bold text-2xl text-secondary-900 tracking-tight">
                        LeaveSync
                    </span>
                </div>

                {/* Navigation */}
                <nav className="p-4 space-y-2 mt-4">
                    <div className="px-4 text-xs font-semibold text-secondary-400 uppercase tracking-wider mb-2">
                        Menu
                    </div>

                    {filteredNav.map((item) => {
                        const isActive = pathname === item.href;
                        const Icon = item.icon;

                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`
                  flex items-center px-4 py-3 rounded-xl transition-all duration-200 group
                  ${isActive
                                        ? 'bg-primary-50 text-primary-600 shadow-sm font-medium'
                                        : 'text-secondary-600 hover:bg-secondary-50 hover:text-secondary-900'
                                    }
                `}
                            >
                                <Icon size={20} className={`mr-3 ${isActive ? 'text-primary-600' : 'text-secondary-400 group-hover:text-secondary-600'}`} />
                                <span>{item.label}</span>
                                {isActive && (
                                    <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary-500 shadow-[0_0_8px_rgba(99,102,241,0.5)]" />
                                )}
                            </Link>
                        );
                    })}
                </nav>

                {/* Footer / User Profile */}
                <div className="absolute bottom-0 w-full p-4 border-t border-secondary-100 bg-secondary-50/50">
                    <div className="flex items-center justify-between px-4 py-2">
                        <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold border border-indigo-200">
                                {role.charAt(0)}
                            </div>
                            <div>
                                <p className="text-sm font-bold text-secondary-900 capitalize">{role.toLowerCase()}</p>
                                <p className="text-xs text-secondary-500">View Profile</p>
                            </div>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="p-2 text-secondary-400 hover:text-danger hover:bg-red-50 rounded-lg transition-colors"
                            title="Logout"
                        >
                            <LogOut size={20} />
                        </button>
                    </div>
                </div>
            </aside>

            {/* Overlay for mobile */}
            {isOpen && (
                <div
                    className="lg:hidden fixed inset-0 z-30 bg-secondary-900/20 backdrop-blur-sm"
                    onClick={() => setIsOpen(false)}
                />
            )}
        </>
    );
}
