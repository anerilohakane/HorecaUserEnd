import { mockSupplierStats, mockSupplierOrders } from '@/lib/mock/supplier';
import { DollarSign, ShoppingBag, Package, TrendingUp, ChevronRight } from 'lucide-react';
import Link from 'next/link';

export default function SupplierDashboard() {
    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-[#111827]">Dashboard Overview</h1>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-2xl soft-shadow border border-gray-100">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-3 bg-green-50 rounded-xl text-green-600">
                            <DollarSign size={24} />
                        </div>
                        <span className="text-green-600 text-sm font-medium flex items-center gap-1">
                            <TrendingUp size={16} />
                            +{mockSupplierStats.recentGrowth}%
                        </span>
                    </div>
                    <p className="text-gray-500 text-sm mb-1">Total Revenue</p>
                    <h3 className="text-2xl font-bold text-[#111827]">₹{mockSupplierStats.totalRevenue.toLocaleString()}</h3>
                </div>

                <div className="bg-white p-6 rounded-2xl soft-shadow border border-gray-100">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-3 bg-blue-50 rounded-xl text-blue-600">
                            <ShoppingBag size={24} />
                        </div>
                    </div>
                    <p className="text-gray-500 text-sm mb-1">Total Orders</p>
                    <h3 className="text-2xl font-bold text-[#111827]">{mockSupplierStats.totalOrders}</h3>
                </div>

                <div className="bg-white p-6 rounded-2xl soft-shadow border border-gray-100">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-3 bg-amber-50 rounded-xl text-[#D97706]">
                            <Package size={24} />
                        </div>
                    </div>
                    <p className="text-gray-500 text-sm mb-1">Active Products</p>
                    <h3 className="text-2xl font-bold text-[#111827]">{mockSupplierStats.activeProducts}</h3>
                </div>

                <div className="bg-white p-6 rounded-2xl soft-shadow border border-gray-100">
                    <div className="flex items-center justify-between mb-4">
                        <div className="p-3 bg-purple-50 rounded-xl text-purple-600">
                            <TrendingUp size={24} />
                        </div>
                    </div>
                    <p className="text-gray-500 text-sm mb-1">Average Rating</p>
                    <h3 className="text-2xl font-bold text-[#111827]">{mockSupplierStats.averageRating} / 5.0</h3>
                </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
                {/* Recent Orders */}
                <div className="lg:col-span-2 bg-white rounded-2xl soft-shadow border border-gray-100 overflow-hidden">
                    <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                        <h2 className="text-lg font-bold text-[#111827]">Recent Orders</h2>
                        <Link href="/supplier/orders" className="text-[#D97706] text-sm font-medium hover:underline flex items-center gap-1">
                            View All <ChevronRight size={16} />
                        </Link>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead className="bg-gray-50 text-xs text-gray-500 uppercase">
                                <tr>
                                    <th className="px-6 py-4 font-medium">Order ID</th>
                                    <th className="px-6 py-4 font-medium">Customer</th>
                                    <th className="px-6 py-4 font-medium">Amount</th>
                                    <th className="px-6 py-4 font-medium">Status</th>
                                    <th className="px-6 py-4 font-medium">Date</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 text-sm">
                                {mockSupplierOrders.slice(0, 5).map((order) => (
                                    <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 font-medium text-[#111827]">{order.id}</td>
                                        <td className="px-6 py-4 text-gray-600">{order.customerName}</td>
                                        <td className="px-6 py-4 font-medium text-[#111827]">₹{order.amount.toLocaleString()}</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${order.status === 'Delivered' ? 'bg-green-100 text-green-700' :
                                                order.status === 'Pending' ? 'bg-amber-100 text-amber-700' :
                                                    order.status === 'Cancelled' ? 'bg-red-100 text-red-700' :
                                                        'bg-blue-100 text-blue-700'
                                                }`}>
                                                {order.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-gray-500">{order.date}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                    <h2 className="text-lg font-bold text-[#111827] mb-6">Quick Actions</h2>
                    <div className="space-y-3">
                        <Link
                            href="/supplier/products/new"
                            className="block w-full text-center py-3 bg-[#D97706] text-white rounded-xl font-medium hover:bg-[#B45309] transition-colors"
                        >
                            + Add New Product
                        </Link>
                        <Link
                            href="/supplier/inventory"
                            className="block w-full text-center py-3 bg-gray-100 text-[#111827] rounded-xl font-medium hover:bg-gray-200 transition-colors"
                        >
                            Manage Inventory
                        </Link>
                        <button className="block w-full text-center py-3 bg-gray-100 text-[#111827] rounded-xl font-medium hover:bg-gray-200 transition-colors">
                            Download Reports
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
