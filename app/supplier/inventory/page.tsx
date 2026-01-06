'use client';

import { mockSupplierProducts } from '@/lib/mock/supplier';
import { Save, Search, AlertTriangle, CheckCircle, RotateCcw } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';

export default function SupplierInventoryPage() {
    const [products, setProducts] = useState(mockSupplierProducts);
    const [hasChanges, setHasChanges] = useState(false);

    const handleStockChange = (id: string, newStock: number) => {
        setProducts(products.map(p =>
            p.id === id ? { ...p, stock: newStock } : p
        ));
        setHasChanges(true);
    };

    const handlePriceChange = (id: string, newPrice: number) => {
        setProducts(products.map(p =>
            p.id === id ? { ...p, price: newPrice } : p
        ));
        setHasChanges(true);
    };

    const getStockStatus = (stock: number) => {
        if (stock === 0) return { label: 'Out of Stock', color: 'text-red-600 bg-red-50', icon: AlertTriangle };
        if (stock < 50) return { label: 'Low Stock', color: 'text-amber-600 bg-amber-50', icon: AlertTriangle };
        return { label: 'In Stock', color: 'text-green-600 bg-green-50', icon: CheckCircle };
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-[#111827]">Inventory Management</h1>
                    <p className="text-gray-500 text-sm mt-1">Quickly update stock levels and pricing across all products.</p>
                </div>
                <div className="flex gap-3">
                    <button
                        disabled={!hasChanges}
                        className="flex items-center gap-2 px-5 py-2.5 rounded-full border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors font-medium disabled:opacity-50"
                        onClick={() => {
                            setProducts(mockSupplierProducts);
                            setHasChanges(false);
                        }}
                    >
                        <RotateCcw size={18} />
                        Reset
                    </button>
                    <button
                        disabled={!hasChanges}
                        className="flex items-center gap-2 bg-[#D97706] text-white px-6 py-2.5 rounded-full hover:bg-[#B45309] transition-all font-medium shadow-md shadow-orange-100 disabled:opacity-50 disabled:shadow-none"
                    >
                        <Save size={18} />
                        Save Changes
                    </button>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex gap-4">
                <div className="relative flex-grow max-w-md">
                    <Search size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search products..."
                        className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:border-[#D97706] focus:ring-1 focus:ring-[#D97706] outline-none"
                    />
                </div>
                <div className="h-full w-px bg-gray-200 mx-2"></div>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                    <span className="font-medium text-[#111827]">{products.filter(p => p.stock < 50).length}</span> Low Stock Items
                </div>
            </div>

            {/* Inventory Table */}
            <div className="bg-white rounded-2xl soft-shadow border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-gray-50 text-xs text-gray-500 uppercase border-b border-gray-200">
                            <tr>
                                <th className="px-6 py-4 font-medium w-1/3">Product Details</th>
                                <th className="px-6 py-4 font-medium">Status</th>
                                <th className="px-6 py-4 font-medium">Stock Quantity</th>
                                <th className="px-6 py-4 font-medium">Unit Price (₹)</th>
                                <th className="px-6 py-4 font-medium text-right">Total Value</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 text-sm">
                            {products.map((product) => {
                                const status = getStockStatus(product.stock);
                                const StatusIcon = status.icon;

                                return (
                                    <tr key={product.id} className="hover:bg-gray-50 transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="relative w-10 h-10 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                                                    <Image
                                                        src={product.image}
                                                        alt={product.name}
                                                        fill
                                                        className="object-cover"
                                                    />
                                                </div>
                                                <div>
                                                    <p className="font-medium text-[#111827]">{product.name}</p>
                                                    <p className="text-xs text-gray-500">SKU: {product.id}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${status.color}`}>
                                                <StatusIcon size={14} />
                                                {status.label}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <input
                                                    type="number"
                                                    min="0"
                                                    value={product.stock}
                                                    onChange={(e) => handleStockChange(product.id, parseInt(e.target.value) || 0)}
                                                    className={`w-24 px-3 py-1.5 rounded-lg border outline-none transition-all font-medium ${product.stock < 20
                                                        ? 'border-red-200 bg-red-50 text-red-700 focus:border-red-500'
                                                        : 'border-gray-200 focus:border-[#D97706]'
                                                        }`}
                                                />
                                                <span className="text-gray-400 text-xs">units</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="relative">
                                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">₹</span>
                                                <input
                                                    type="number"
                                                    min="0"
                                                    value={product.price}
                                                    onChange={(e) => handlePriceChange(product.id, parseFloat(e.target.value) || 0)}
                                                    className="w-28 pl-6 pr-3 py-1.5 rounded-lg border border-gray-200 outline-none focus:border-[#D97706] font-medium"
                                                />
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right font-medium text-gray-900">
                                            ₹{(product.stock * product.price).toLocaleString("en-IN")}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
