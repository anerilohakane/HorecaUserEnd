'use client';
import React, { useState, useEffect } from 'react';
import { Loader2, PackageSearch } from 'lucide-react';
import { useAuth } from '@/lib/context/AuthContext';

const API_BASE = (process.env.NEXT_PUBLIC_BACKEND_URL || "https://horeca-backend-six.vercel.app").replace(/\/$/, "");

export default function MyPurchaseOrders() {
    const { token, user } = useAuth();
    const [pastPOs, setPastPOs] = useState<any[]>([]);
    const [loadingPOs, setLoadingPOs] = useState(false);

    useEffect(() => {
        if (user) {
            fetchPastPOs();
        }
    }, [user]);

    const fetchPastPOs = async () => {
        const customerId = (user as any)?._id || user?.id;
        if (!customerId) return;
        setLoadingPOs(true);
        try {
            const res = await fetch(`${API_BASE}/api/customer-po?customerId=${customerId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const contentType = res.headers.get("content-type");
            if (contentType && contentType.includes("application/json")) {
                const json = await res.json();
                if (json.success) {
                    setPastPOs(json.data || []);
                }
            }
        } catch (e) {
            console.error(e);
        } finally {
            setLoadingPOs(false);
        }
    };

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-top-4 duration-500">
            <h3 className="text-xl font-bold text-[#2d3748] mb-4">My Purchase Orders</h3>
            {loadingPOs ? (
                <div className="flex justify-center py-8">
                    <Loader2 className="w-8 h-8 animate-spin text-amber-500" />
                </div>
            ) : pastPOs.length === 0 ? (
                <div className="text-center py-12 text-[#a0aec0] bg-[#f8fafc] rounded-xl border border-dashed border-[#cbd5e0] text-lg">
                    No purchase orders found
                </div>
            ) : (
                <div className="space-y-4">
                    {pastPOs.map(po => (
                        <div key={po._id} className="bg-white border border-[#e2e8f0] rounded-xl p-5 hover:shadow-sm transition-shadow">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <div className="font-bold text-[#2d3748] mb-1">{po.poNumber}</div>
                                    <div className="text-sm text-[#718096]">
                                        {new Date(po.createdAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' })}
                                    </div>
                                </div>
                                <div className={`px-3 py-1 rounded-full text-xs font-bold ${po.status === 'Approved' ? 'bg-green-100 text-green-700' :
                                        po.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' :
                                            po.status === 'Rejected' ? 'bg-red-100 text-red-700' :
                                                'bg-gray-100 text-gray-700'
                                    }`}>
                                    {po.status}
                                </div>
                            </div>
                            <div className="text-sm text-[#4a5568] mb-4">
                                <span className="font-semibold">Supplier:</span> {po.supplier?.businessName || po.supplier?.name || 'N/A'}
                            </div>
                            <div className="bg-[#f8fafc] rounded-lg p-3 overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead>
                                        <tr>
                                            <th className="text-[11px] font-bold text-[#a0aec0] uppercase tracking-wider pb-2">Product</th>
                                            <th className="text-[11px] font-bold text-[#a0aec0] uppercase tracking-wider pb-2 text-center">Qty</th>
                                            <th className="text-[11px] font-bold text-[#a0aec0] uppercase tracking-wider pb-2 text-right">Price</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-[#e2e8f0]">
                                        {po.items.map((item: any, i: number) => (
                                            <tr key={i}>
                                                <td className="py-2 text-[13px] text-[#4a5568] font-medium min-w-[200px]">{item.name || 'Unknown Product'}</td>
                                                <td className="py-2 text-[13px] text-[#4a5568] text-center">{item.quantity}</td>
                                                <td className="py-2 text-[13px] text-[#4a5568] text-right whitespace-nowrap">₹{item.unitPrice?.toLocaleString('en-IN')}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
