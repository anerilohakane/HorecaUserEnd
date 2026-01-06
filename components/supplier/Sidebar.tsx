'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, Package, ShoppingBag, User, LogOut, Settings, Award, ClipboardList } from 'lucide-react';

export default function SupplierSidebar() {
    const pathname = usePathname();
    const router = useRouter();

    const handleLogout = () => {
        // In a real app, clear auth tokens here
        router.push('/supplier/login');
    };

    const isActive = (path: string) => {
        return pathname === path || pathname?.startsWith(`${path}/`);
    };

    return (
        <aside className="w-64 bg-white border-r border-gray-200 fixed h-full flex flex-col z-20 hidden md:flex">
            {/* Logo */}
            <div className="p-6 border-b border-gray-100">
                <Link href="/supplier" className="flex items-center gap-2">
                    <Award className="text-[#D97706]" size={28} />
                    <span className="font-bold text-xl text-[#111827]">Supplier<span className="text-[#D97706]">Hub</span></span>
                </Link>
            </div>

            {/* Navigation */}
            <nav className="flex-grow p-4 space-y-2 overflow-y-auto">
                <Link
                    href="/supplier"
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium ${pathname === '/supplier'
                        ? 'bg-[#FFF8E1] text-[#D97706]'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-[#111827]'
                        }`}
                >
                    <LayoutDashboard size={20} />
                    Dashboard
                </Link>

                <Link
                    href="/supplier/products"
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium ${isActive('/supplier/products')
                        ? 'bg-[#FFF8E1] text-[#D97706]'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-[#111827]'
                        }`}
                >
                    <Package size={20} />
                    My Products
                </Link>

                <Link
                    href="/supplier/inventory"
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium ${isActive('/supplier/inventory')
                        ? 'bg-[#FFF8E1] text-[#D97706]'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-[#111827]'
                        }`}
                >
                    <ClipboardList size={20} />
                    Inventory
                </Link>

                <Link
                    href="/supplier/orders"
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium ${isActive('/supplier/orders')
                        ? 'bg-[#FFF8E1] text-[#D97706]'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-[#111827]'
                        }`}
                >
                    <ShoppingBag size={20} />
                    Orders
                </Link>

                {/* <div className="pt-4 mt-4 border-t border-gray-100"> */}
                <Link
                    href="/supplier/settings"
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium ${isActive('/supplier/settings')
                        ? 'bg-[#FFF8E1] text-[#D97706]'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-[#111827]'
                        }`}
                >
                    <Settings size={20} />
                    Settings
                </Link>
                {/* </div> */}
            </nav>

            {/* Footer User Profile */}
            <div className="p-4 border-t border-gray-100">
                <Link
                    href="/supplier/profile"
                    className="block bg-gray-50 rounded-xl p-3 flex items-center gap-3 mb-2 hover:bg-gray-100 transition-colors"
                >
                    <div className="w-10 h-10 bg-[#D97706] rounded-full flex items-center justify-center text-white font-bold">
                        NB
                    </div>
                    <div className="flex-grow overflow-hidden">
                        <h4 className="text-sm font-semibold text-[#111827] truncate">Nature's Best</h4>
                        <p className="text-xs text-gray-500 truncate">Supplier Account</p>
                    </div>
                </Link>

                <button
                    onClick={handleLogout}
                    className="w-full flex items-center justify-center gap-2 text-red-500 hover:bg-red-50 py-2 rounded-lg transition-colors font-medium text-sm"
                >
                    <LogOut size={18} />
                    Logout
                </button>
            </div>
        </aside>
    );
}
