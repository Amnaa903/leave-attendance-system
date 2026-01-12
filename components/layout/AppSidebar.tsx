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
    Settings,
    AlertCircle
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
            label: 'Penalties',
            href: `/${role.toLowerCase()}/penalties`, // Dynamic href based on role
            icon: AlertCircle,
            roles: ['ADMIN', 'MANAGER', 'EMPLOYEE'] // Assuming all roles can view penalties
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
            label: 'My Attendance', // For Employees
            href: '/employee/attendance',
            icon: Clock,
            roles: ['EMPLOYEE']
        },
        {
            label: 'Emp. Attendance', // For Managers
            href: '/manager/attendance',
            icon: Clock,
            roles: ['MANAGER']
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
        bg-indigo-900 border-r border-indigo-800 text-white
        transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
                {/* Logo Area */}
                <div className="h-20 flex items-center px-8 border-b border-indigo-800">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-400 to-indigo-200 flex items-center justify-center mr-3">
                        <span className="text-indigo-900 font-bold text-lg">L</span>
                    </div>
                    <span className="font-zebra font-bold text-3xl text-white tracking-widest uppercase">
                        LeaveSync
                    </span>
                </div>

                {/* Navigation */}
                <nav className="p-4 space-y-2 mt-4">
                    <div className="px-4 text-xs font-semibold text-indigo-300 uppercase tracking-wider mb-2">
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
                                        ? 'bg-indigo-800 text-white shadow-sm font-medium'
                                        : 'text-indigo-100 hover:bg-indigo-800 hover:text-white'
                                    }
                `}
                            >
                                <Icon size={20} className={`mr-3 ${isActive ? 'text-indigo-300' : 'text-indigo-300 group-hover:text-white'}`} />
                                <span>{item.label}</span>
                                {isActive && (
                                    <div className="ml-auto w-1.5 h-1.5 rounded-full bg-indigo-400 shadow-[0_0_8px_rgba(129,140,248,0.5)]" />
                                )}
                            </Link>
                        );
                    })}
                </nav>

                {/* Footer / User Profile */}
                <div className="absolute bottom-0 w-full p-4 border-t border-indigo-800 bg-indigo-950/30">
                    <div className="flex items-center justify-between px-4 py-2">
                        <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 rounded-full bg-indigo-800 flex items-center justify-center text-indigo-200 font-bold border border-indigo-700">
                                {role.charAt(0)}
                            </div>
                            <div>
                                <p className="text-sm font-bold text-white capitalize">{role.toLowerCase()}</p>
                                <p className="text-[10px] font-rugged text-indigo-300 uppercase tracking-tighter">Sign Out</p>
                            </div>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="p-2 text-indigo-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
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
