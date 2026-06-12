'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PageTransition from "@/components/ui/PageTransition";
import { useAuth } from '@/lib/context/AuthContext';
import { Loader2, Search, RotateCw, FileText, ArrowRight, ChevronRight } from 'lucide-react';
import NegotiatedOrderModal from '@/components/products/NegotiatedOrderModal';

const API_BASE = (process.env.NEXT_PUBLIC_BACKEND_URL || "https://horeca-backend-six.vercel.app").replace(/\/$/, "");

const formatToIST = (dateString: string | Date) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleString('en-IN', {
        timeZone: 'Asia/Kolkata',
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
    });
};

export default function PriceRequestsPage() {
    const { user, token, isAuthenticated } = useAuth();
    const router = useRouter();

    const [priceRequests, setPriceRequests] = useState<any[]>([]);
    const [priceRequestsLoading, setPriceRequestsLoading] = useState(true);
    const [isNegotiatedOrderModalOpen, setIsNegotiatedOrderModalOpen] = useState(false);
    const [selectedNegotiatedReq, setSelectedNegotiatedReq] = useState<any>(null);
    const [priceRequestSearch, setPriceRequestSearch] = useState("");
    const [priceRequestFilter, setPriceRequestFilter] = useState("all");
    const [addresses, setAddresses] = useState<any[]>([]);

    useEffect(() => {
        if (!isAuthenticated) {
            router.push('/login');
            return;
        }

        if (user && user.category !== 'A') {
            router.push('/');
            return;
        }

        const fetchInitialData = async () => {
            if (!user) return;
            setPriceRequestsLoading(true);
            try {
                const userId = user?.id || (user as any)?._id;
                
                // Fetch Price Requests
                const reqRes = await fetch(`${API_BASE}/api/price-requests?customerId=${userId}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (reqRes.ok && reqRes.headers.get("content-type")?.includes("application/json")) {
                    const reqJson = await reqRes.json();
                    if (reqJson.success) setPriceRequests(reqJson.data);
                }

                // Fetch Addresses (required for the Negotiated Order Modal)
                const addrRes = await fetch(`${API_BASE}/api/address?userId=${userId}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (addrRes.ok && addrRes.headers.get("content-type")?.includes("application/json")) {
                    const addrJson = await addrRes.json();
                    if (addrJson.success) setAddresses(addrJson.data);
                }

            } catch (e) {
                console.error("Failed to fetch initial data", e);
            } finally {
                setPriceRequestsLoading(false);
            }
        };

        fetchInitialData();
    }, [user, isAuthenticated, token, router]);

    const fetchPriceRequestsOnly = async () => {
        if (!user) return;
        setPriceRequestsLoading(true);
        try {
            const userId = user?.id || (user as any)?._id;
            const reqRes = await fetch(`${API_BASE}/api/price-requests?customerId=${userId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (reqRes.ok && reqRes.headers.get("content-type")?.includes("application/json")) {
                const reqJson = await reqRes.json();
                if (reqJson.success) setPriceRequests(reqJson.data);
            }
        } catch (e) {
            console.error("Failed to fetch price requests", e);
        } finally {
            setPriceRequestsLoading(false);
        }
    };

    if (!isAuthenticated || user?.category !== 'A') return null;

    return (
        <PageTransition>
            <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
                <Header />

                <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-gray-900">Price Requests</h1>
                        <p className="text-gray-500 mt-2">Manage your product price negotiations and place orders directly from approved requests.</p>
                    </div>

                    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden p-6 md:p-8">
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h2 className="text-xl font-semibold text-gray-900">Requests Pipeline</h2>
                            </div>
                            <button onClick={fetchPriceRequestsOnly} className="p-2 text-gray-500 hover:text-amber-600 transition-colors bg-gray-50 hover:bg-amber-50 rounded-lg">
                                <RotateCw className={`w-5 h-5 ${priceRequestsLoading ? 'animate-spin' : ''}`} />
                            </button>
                        </div>

                        {/* Filters & Search */}
                        <div className="flex flex-col sm:flex-row gap-4 mb-8">
                            <div className="relative flex-1">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Search className="h-4 w-4 text-gray-400" />
                                </div>
                                <input
                                    type="text"
                                    placeholder="Search by product name..."
                                    value={priceRequestSearch}
                                    onChange={(e) => setPriceRequestSearch(e.target.value)}
                                    className="block w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-gray-50"
                                />
                            </div>
                            <div className="flex gap-2 overflow-x-auto pb-1 sm:pb-0 scrollbar-hide">
                                {['all', 'pending', 'approved', 'placed'].map((status) => (
                                    <button
                                        key={status}
                                        onClick={() => setPriceRequestFilter(status)}
                                        className={`px-5 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-colors border ${priceRequestFilter === status ? 'bg-amber-100 text-amber-700 border-amber-200' : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'}`}
                                    >
                                        {status === 'placed' ? 'Placed Orders' : status.charAt(0).toUpperCase() + status.slice(1)}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {(() => {
                            const filteredPriceRequests = priceRequests.filter(req => {
                                let statusMatch = true;
                                if (priceRequestFilter === 'placed') {
                                    statusMatch = !!req.orderId;
                                } else if (priceRequestFilter === 'approved') {
                                    statusMatch = req.status === 'approved' && !req.orderId;
                                } else if (priceRequestFilter === 'pending') {
                                    statusMatch = req.status === 'pending';
                                } else if (priceRequestFilter === 'rejected') {
                                    statusMatch = req.status === 'rejected';
                                }

                                let searchMatch = true;
                                if (priceRequestSearch) {
                                    const query = priceRequestSearch.toLowerCase();
                                    searchMatch = (req.product?.name || '').toLowerCase().includes(query);
                                }

                                return statusMatch && searchMatch;
                            });

                            return (
                                <>
                                    {priceRequestsLoading ? (
                                        <div className="flex flex-col items-center justify-center py-16 space-y-4">
                                            <Loader2 className="w-8 h-8 text-amber-500 animate-spin" />
                                            <p className="text-gray-500 font-medium">Loading requests...</p>
                                        </div>
                                    ) : priceRequests.length === 0 ? (
                                        <div className="text-center py-16 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                                            <div className="w-16 h-16 bg-white rounded-full shadow-sm flex items-center justify-center mx-auto mb-4">
                                                <FileText className="w-8 h-8 text-gray-400" />
                                            </div>
                                            <h3 className="text-lg font-semibold text-gray-900 mb-1">No Price Requests Yet</h3>
                                            <p className="text-gray-500 mb-6">You haven't requested any custom prices for products.</p>
                                            <button onClick={() => router.push('/products')} className="inline-flex items-center gap-2 px-6 py-2.5 bg-amber-600 text-white rounded-xl hover:bg-amber-700 transition-colors font-medium">
                                                Explore Products <ArrowRight className="w-4 h-4" />
                                            </button>
                                        </div>
                                    ) : filteredPriceRequests.length === 0 ? (
                                        <div className="text-center py-16 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                                            <h3 className="text-lg font-semibold text-gray-900 mb-1">No Results Found</h3>
                                            <p className="text-gray-500">No requests match your current search or filters.</p>
                                        </div>
                                    ) : (
                                        <div className="space-y-4">
                                            {filteredPriceRequests.map((req) => (
                                                <div key={req._id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col md:flex-row gap-4 p-5 hover:shadow-md transition-shadow">
                                                    <div className="flex-1">
                                                        <div className="flex items-center gap-2 mb-3">
                                                            <span className="text-xs text-gray-500 font-medium">{formatToIST(req.createdAt)}</span>
                                                            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${req.status === 'approved' ? 'bg-green-100 text-green-700' : req.status === 'rejected' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                                                {req.status}
                                                            </span>
                                                        </div>
                                                        <h3 className="text-lg font-semibold text-gray-900">{req.product?.name}</h3>
                                                        <div className="flex flex-wrap gap-x-8 gap-y-3 mt-4 text-sm bg-gray-50 p-4 rounded-xl border border-gray-100">
                                                            <div className="flex flex-col">
                                                                <span className="text-gray-500 text-xs mb-1">Original Price</span>
                                                                <span className="font-semibold text-gray-400 line-through">₹{req.originalPrice}</span>
                                                            </div>
                                                            <div className="flex flex-col">
                                                                <span className="text-gray-500 text-xs mb-1">Requested Price</span>
                                                                <span className="font-bold text-amber-600 text-base leading-none">₹{req.requestedPrice}</span>
                                                            </div>
                                                            <div className="flex flex-col">
                                                                <span className="text-gray-500 text-xs mb-1">Quantity</span>
                                                                <span className="font-semibold text-gray-900">{req.quantity}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="bg-gray-50 p-5 rounded-xl md:w-72 flex flex-col border border-gray-100">
                                                        <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Latest Message</h4>
                                                        {req.remarks && req.remarks.length > 0 ? (
                                                            <div className="text-sm text-gray-700 italic line-clamp-3 relative">
                                                                "{req.remarks[req.remarks.length - 1].message}"
                                                            </div>
                                                        ) : (
                                                            <span className="text-sm text-gray-400 italic">No messages from sales yet.</span>
                                                        )}
                                                        <div className="mt-auto pt-4 flex justify-between items-center w-full">
                                                            <button onClick={() => router.push(`/products/${req.product?.id || req.product?._id}`)} className="text-amber-600 text-sm font-semibold hover:text-amber-700 flex items-center gap-1">
                                                                View Product <ChevronRight className="w-4 h-4" />
                                                            </button>
                                                            {req.status === 'approved' && !req.orderId && (
                                                                <button onClick={() => { setSelectedNegotiatedReq(req); setIsNegotiatedOrderModalOpen(true); }} className="bg-amber-600 hover:bg-amber-700 text-white px-5 py-2 rounded-xl text-sm font-bold transition-all shadow-sm hover:shadow">
                                                                    Place Order
                                                                </button>
                                                            )}
                                                            {req.orderId && (
                                                                <span className="bg-emerald-100 text-emerald-800 px-4 py-1.5 rounded-full text-xs font-bold uppercase border border-emerald-200">
                                                                    Order Placed
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </>
                            );
                        })()}
                    </div>
                </main>

                <Footer />
            </div>

            <NegotiatedOrderModal
                isOpen={isNegotiatedOrderModalOpen}
                onClose={() => setIsNegotiatedOrderModalOpen(false)}
                negotiation={selectedNegotiatedReq}
                user={user}
                addresses={addresses}
                token={token || ''}
                onSuccess={fetchPriceRequestsOnly}
            />
        </PageTransition>
    );
}
