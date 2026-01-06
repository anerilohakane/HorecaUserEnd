'use client';

import { Bell, Search, Menu } from 'lucide-react';

export default function SupplierHeader() {
    return (
        <header className="bg-white border-b border-gray-200 h-16 flex items-center justify-between px-6 sticky top-0 z-10 md:ml-64">
            {/* Mobile Menu Button - Visible only on mobile */}
            <button className="md:hidden text-gray-600">
                <Menu size={24} />
            </button>

            {/* Search */}
            <div className="hidden md:flex items-center bg-gray-50 rounded-lg px-3 py-2 w-96 border border-gray-200 focus-within:border-[#D97706] focus-within:ring-1 focus-within:ring-[#D97706] transition-all">
                <Search size={18} className="text-gray-400 mr-2" />
                <input
                    type="text"
                    placeholder="Search products, orders..."
                    className="bg-transparent border-none outline-none text-sm w-full text-gray-700 placeholder-gray-400"
                />
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-4">
                {/* Notifications */}
                <button className="relative p-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors">
                    <Bell size={20} />
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
                </button>

                {/* User - Mobile Only */}
                <div className="md:hidden w-8 h-8 bg-[#D97706] rounded-full flex items-center justify-center text-white text-sm font-bold">
                    NB
                </div>
            </div>
        </header>
    );
}
