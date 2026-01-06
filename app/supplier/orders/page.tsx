import { mockSupplierOrders } from '@/lib/mock/supplier';
import { Search, Filter, Eye, Download } from 'lucide-react';

export default function SupplierOrdersPage() {
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-[#111827]">Order Management</h1>
                <button className="flex items-center gap-2 text-[#D97706] font-medium border border-[#D97706] px-4 py-2 rounded-full hover:bg-orange-50 transition-colors">
                    <Download size={18} />
                    Export All
                </button>
            </div>

            {/* Filters */}
            <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-col sm:flex-row gap-4">
                <div className="relative flex-grow">
                    <Search size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search by Order ID or Customer..."
                        className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:border-[#D97706] focus:ring-1 focus:ring-[#D97706] outline-none"
                    />
                </div>
                <select className="px-4 py-2 border border-gray-200 rounded-lg outline-none focus:border-[#D97706] text-gray-600 bg-white">
                    <option>All Statuses</option>
                    <option>Pending</option>
                    <option>Processing</option>
                    <option>Shipped</option>
                    <option>Delivered</option>
                    <option>Cancelled</option>
                </select>
                <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-600 font-medium whitespace-nowrap">
                    <Filter size={20} />
                    More Filters
                </button>
            </div>

            {/* Orders Table */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-gray-50 text-xs text-gray-500 uppercase border-b border-gray-200">
                            <tr>
                                <th className="px-6 py-4 font-medium">Order ID</th>
                                <th className="px-6 py-4 font-medium">Date</th>
                                <th className="px-6 py-4 font-medium">Customer</th>
                                <th className="px-6 py-4 font-medium">Items Summary</th>
                                <th className="px-6 py-4 font-medium">Amount</th>
                                <th className="px-6 py-4 font-medium">Status</th>
                                <th className="px-6 py-4 font-medium text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 text-sm">
                            {mockSupplierOrders.map((order) => (
                                <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 font-medium text-[#D97706]">{order.id}</td>
                                    <td className="px-6 py-4 text-gray-500">{order.date}</td>
                                    <td className="px-6 py-4">
                                        <p className="font-medium text-[#111827]">{order.customerName}</p>
                                    </td>
                                    <td className="px-6 py-4 text-gray-600 max-w-xs truncate" title={order.items}>
                                        {order.items}
                                    </td>
                                    <td className="px-6 py-4 font-medium text-[#111827]">₹{order.amount.toLocaleString()}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${order.status === 'Delivered' ? 'bg-green-50 text-green-700 border-green-100' :
                                                order.status === 'Pending' ? 'bg-amber-50 text-amber-700 border-amber-100' :
                                                    order.status === 'Cancelled' ? 'bg-red-50 text-red-700 border-red-100' :
                                                        order.status === 'Shipped' ? 'bg-blue-50 text-blue-700 border-blue-100' :
                                                            'bg-purple-50 text-purple-700 border-purple-100' // Processing
                                            }`}>
                                            {order.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button className="text-gray-400 hover:text-[#D97706] transition-colors p-2 rounded-lg hover:bg-orange-50">
                                            <Eye size={20} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
