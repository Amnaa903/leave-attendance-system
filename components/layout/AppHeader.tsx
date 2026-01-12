'use client';

import { Bell, Search } from 'lucide-react';

export default function AppHeader({ title }: { title: string }) {
    return (
        <header className="sticky top-0 z-30 h-20 w-full flex items-center justify-between px-8 bg-indigo-50/80 backdrop-blur-md border-b border-indigo-100/60">
            <div>
                <h1 className="font-heading text-2xl font-bold text-indigo-900">
                    {title}
                </h1>
            </div>

            <div className="flex items-center space-x-6">
                {/* Search Bar - Hidden on small screens */}
                <div className="hidden md:flex items-center px-4 py-2 bg-white rounded-full border border-indigo-100 focus-within:ring-2 focus-within:ring-indigo-100 focus-within:border-indigo-400 w-64 transition-all">
                    <Search size={18} className="text-indigo-400 mr-2" />
                    <input
                        type="text"
                        placeholder="Search..."
                        className="bg-transparent border-none outline-none text-sm text-indigo-700 placeholder:text-indigo-300 w-full"
                    />
                </div>

                {/* Notifications */}
                <button className="relative p-2 text-secondary-500 hover:text-primary-600 transition-colors">
                    <Bell size={22} />
                    <span className="absolute top-1.5 right-2 w-2 h-2 bg-danger rounded-full border border-white"></span>
                </button>
            </div>
        </header>
    );
}
