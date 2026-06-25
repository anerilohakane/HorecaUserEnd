'use client';
import React, { useState, useEffect } from 'react';
import { Trash2, Plus, Loader2, Tag, ShoppingBag } from 'lucide-react';
import { useAuth } from '@/lib/context/AuthContext';
import { sileo } from 'sileo';

// const API_BASE = (process.env.NEXT_PUBLIC_BACKEND_URL || "https://horeca-backend-six.vercel.app").replace(/\/$/, "");
const API_BASE = "http://localhost:3001";

export default function PurchaseOrderForm() {
    const { token, user } = useAuth();
    const [suppliers, setSuppliers] = useState<any[]>([]);
    const [selectedSupplier, setSelectedSupplier] = useState<string>('');
    const [brands, setBrands] = useState<any[]>([]);
    const [products, setProducts] = useState<any[]>([]);
    const [selectedProduct, setSelectedProduct] = useState<string>('');
    const [loadingSuppliers, setLoadingSuppliers] = useState(false);
    const [loadingProducts, setLoadingProducts] = useState(false);

    // List of added products
    const [poItems, setPoItems] = useState<any[]>([]);
    const [quantityToAdd, setQuantityToAdd] = useState<number>(1);
    
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [pastPOs, setPastPOs] = useState<any[]>([]);
    const [loadingPOs, setLoadingPOs] = useState(false);

    useEffect(() => {
        fetchSuppliers();
        fetchBrands(); // To map categoryId to brand name
    }, []);

    useEffect(() => {
        if (user) {
            fetchPastPOs();
        }
    }, [user]);

    useEffect(() => {
        if (selectedSupplier) {
            fetchProducts(selectedSupplier);
        } else {
            setProducts([]);
        }
        setSelectedProduct('');
        setQuantityToAdd(1);
    }, [selectedSupplier]);

    const fetchPastPOs = async () => {
        const customerId = (user as any)?._id || user?.id;
        if (!customerId) return;
        setLoadingPOs(true);
        try {
            const res = await fetch(`${API_BASE}/api/customer-po?customerId=${customerId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const json = await res.json();
            if (json.success) {
                setPastPOs(json.data || []);
            }
        } catch (e) {
            console.error(e);
        } finally {
            setLoadingPOs(false);
        }
    };

    const fetchSuppliers = async () => {
        setLoadingSuppliers(true);
        try {
            const res = await fetch(`${API_BASE}/api/supplier`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const json = await res.json();
            if (json.success) {
                setSuppliers(json.data || []);
            }
        } catch (e) {
            console.error(e);
        } finally {
            setLoadingSuppliers(false);
        }
    };

    const fetchBrands = async () => {
        try {
            const res = await fetch(`${API_BASE}/api/brands?limit=1000`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const json = await res.json();
            if (json.success) {
                setBrands(json.data.items || []);
            }
        } catch (e) {
            console.error(e);
        }
    };

    const fetchProducts = async (supplierId: string) => {
        setLoadingProducts(true);
        try {
            const res = await fetch(`${API_BASE}/api/products?supplierId=${supplierId}&limit=1000`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const json = await res.json();
            if (json.success) {
                setProducts(json.data.items || []);
            }
        } catch (e) {
            console.error(e);
        } finally {
            setLoadingProducts(false);
        }
    };

    const handleAddProduct = () => {
        if (!selectedProduct) {
            sileo.error({ title: "Validation", description: "Please select a product" });
            return;
        }
        if (quantityToAdd <= 0) {
            sileo.error({ title: "Validation", description: "Quantity must be at least 1" });
            return;
        }

        const product = products.find(p => p._id === selectedProduct || p.id === selectedProduct);
        if (!product) return;

        // Add separately as a new row
        setPoItems([...poItems, { product, quantity: quantityToAdd, unitPrice: product.price || product.basePrice || 0 }]);
        
        // Reset selection
        setSelectedProduct('');
        setQuantityToAdd(1);
    };

    const handleRemoveItem = (index: number) => {
        const newItems = [...poItems];
        newItems.splice(index, 1);
        setPoItems(newItems);
    };

    const updateQuantity = (index: number, newQty: number) => {
        if (newQty < 1) return;
        const newItems = [...poItems];
        newItems[index].quantity = newQty;
        setPoItems(newItems);
    };

    const handleSubmitPO = async () => {
        if (poItems.length === 0) {
            sileo.error({ title: "Empty PO", description: "Please add at least one product to the Purchase Order" });
            return;
        }

        setIsSubmitting(true);
        try {
            const payload = {
                customer: (user as any)?._id || user?.id,
                supplier: selectedSupplier || null,
                items: poItems.map(item => ({
                    product: item.product._id || item.product.id,
                    name: item.product.name,
                    sku: item.product.sku || "",
                    quantity: item.quantity,
                    unitPrice: item.unitPrice
                })),
                createdBy: user?.name || "Customer"
            };

            const res = await fetch(`${API_BASE}/api/customer-po`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(payload)
            });

            const data = await res.json();
            if (!res.ok || !data.success) {
                throw new Error(data.error || "Failed to submit Purchase Order");
            }

            sileo.success({ title: "Success", description: "Purchase Order submitted successfully!" });
            setPoItems([]);
            setSelectedSupplier('');
            fetchPastPOs();
        } catch (e: any) {
            sileo.error({ title: "Error", description: e.message || "Failed to submit Purchase Order" });
        } finally {
            setIsSubmitting(false);
        }
    }

    // Group products by brand
    const groupedProducts = products.reduce((acc: any, p: any) => {
        const brandId = p.categoryId;
        const brand = brands.find(b => b._id === brandId);
        const brandName = brand ? brand.name : "Other";
        if (!acc[brandName]) acc[brandName] = [];
        acc[brandName].push(p);
        return acc;
    }, {});
    
    const subtotal = poItems.reduce((acc, item) => acc + (item.unitPrice * item.quantity), 0);
    const gst = subtotal * 0.18;
    const grandTotal = subtotal + gst;

    return (
        <div className="space-y-6">
            <div className="flex items-end gap-4">
                <div className="w-[28%]">
                    <label className="block text-sm font-medium text-[#4a5568] mb-1.5">Supplier</label>
                    <div className="relative">
                        <Tag className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#a0aec0] w-4 h-4" />
                        <select
                            value={selectedSupplier}
                            onChange={(e) => setSelectedSupplier(e.target.value)}
                            className="w-full pl-10 pr-8 py-2.5 border border-[#e2e8f0] rounded-xl focus:ring-2 focus:ring-amber-500 outline-none appearance-none bg-white text-[#4a5568] text-sm h-[44px]"
                        >
                            <option value="">{loadingSuppliers ? 'Loading...' : 'Select a supplier'}</option>
                            {suppliers.map(s => (
                                <option key={s._id} value={s._id}>{s.businessName || s.shopName || s.ownerName}</option>
                            ))}
                        </select>
                        <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none text-[#a0aec0]">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                        </div>
                    </div>
                </div>
                
                <div className="flex-1">
                    <label className="block text-sm font-medium text-[#4a5568] mb-1.5">Product</label>
                    <div className="relative">
                        <ShoppingBag className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#a0aec0] w-4 h-4" />
                        <select
                            value={selectedProduct}
                            onChange={(e) => setSelectedProduct(e.target.value)}
                            disabled={!selectedSupplier || loadingProducts}
                            className="w-full pl-10 pr-8 py-2.5 border border-[#e2e8f0] rounded-xl focus:ring-2 focus:ring-amber-500 outline-none appearance-none bg-white text-[#4a5568] text-sm h-[44px] disabled:bg-slate-50"
                        >
                            <option value="">{loadingProducts ? 'Loading products...' : 'Select a product'}</option>
                            {Object.entries(groupedProducts).map(([brandName, brandProducts]: [string, any]) => (
                                <optgroup key={brandName} label={brandName}>
                                    {brandProducts.map((p: any) => (
                                        <option key={p._id || p.id} value={p._id || p.id}>{p.name} {p.sku ? `(${p.sku})` : ''}</option>
                                    ))}
                                </optgroup>
                            ))}
                        </select>
                        <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none text-[#a0aec0]">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                        </div>
                    </div>
                </div>
                
                <div className="flex-shrink-0">
                    <button
                        onClick={handleAddProduct}
                        disabled={!selectedProduct}
                        className="h-[44px] px-8 flex items-center justify-center gap-1.5 bg-amber-500 hover:bg-amber-600 text-white font-semibold rounded-xl transition-colors disabled:opacity-70 disabled:cursor-not-allowed text-sm whitespace-nowrap"
                    >
                        + Add
                    </button>
                </div>
            </div>

            {poItems.length > 0 && (
                <div className="border border-[#e2e8f0] rounded-xl overflow-hidden mt-6">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-[#f8fafc] border-b border-[#e2e8f0]">
                            <tr>
                                <th className="px-5 py-3 w-[45%] text-[11px] font-bold text-[#718096] uppercase tracking-wider">PRODUCT</th>
                                <th className="px-5 py-3 text-center text-[11px] font-bold text-[#718096] uppercase tracking-wider">UNIT PRICE</th>
                                <th className="px-5 py-3 text-center text-[11px] font-bold text-[#718096] uppercase tracking-wider">QUANTITY</th>
                                <th className="px-5 py-3 text-right text-[11px] font-bold text-[#718096] uppercase tracking-wider">SUBTOTAL</th>
                                <th className="px-4 py-3 text-center w-12"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#e2e8f0]">
                            {poItems.map((item, index) => (
                                <tr key={index} className="bg-white">
                                    <td className="px-5 py-3">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-md overflow-hidden border border-[#e2e8f0] flex-shrink-0">
                                                <img 
                                                    src={(item.product.images && item.product.images[0]?.url) || (item.product.images && item.product.images[0]) || "/images/placeholder.png"} 
                                                    alt={item.product.name}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                            <div>
                                                <p className="font-semibold text-[#2d3748] text-[13px]">{item.product.name}</p>
                                                <p className="text-[11px] text-[#a0aec0] mt-0.5">{item.product.sku}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-5 py-3 text-center text-[13px] text-[#718096]">
                                        ₹{item.unitPrice.toLocaleString('en-IN')}/{item.product.uom || 'pcs'}
                                    </td>
                                    <td className="px-5 py-3 text-center">
                                        <input
                                            type="number"
                                            min="1"
                                            value={item.quantity}
                                            onChange={(e) => updateQuantity(index, parseInt(e.target.value) || 1)}
                                            className="w-16 h-8 text-center border border-[#e2e8f0] rounded-lg text-[13px] text-[#2d3748] focus:ring-1 focus:ring-amber-500 outline-none font-medium"
                                        />
                                    </td>
                                    <td className="px-5 py-3 text-right font-bold text-[#2d3748] text-[13px]">
                                        ₹{(item.unitPrice * item.quantity).toLocaleString('en-IN', {minimumFractionDigits: 2})}
                                    </td>
                                    <td className="px-4 py-3 text-center">
                                        <button 
                                            onClick={() => handleRemoveItem(index)}
                                            className="text-[#cbd5e0] hover:text-red-500 transition-colors"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                        <tfoot className="bg-white border-t border-[#e2e8f0]">
                            <tr>
                                <td colSpan={5} className="p-0">
                                    <div className="px-5 py-4 flex items-start justify-between">
                                        <div className="text-[11px] font-bold text-[#718096] uppercase tracking-wider pt-1">
                                            {poItems.length} PRODUCT{poItems.length !== 1 ? 'S' : ''}
                                        </div>
                                        <div className="w-[280px]">
                                            <div className="flex justify-between items-center mb-3">
                                                <span className="text-[11px] font-bold text-[#a0aec0] uppercase tracking-wider">SUBTOTAL</span>
                                                <span className="font-bold text-[#2d3748] text-[13px]">₹{subtotal.toLocaleString('en-IN', {minimumFractionDigits: 2})}</span>
                                            </div>
                                            <div className="flex justify-between items-center mb-4">
                                                <span className="text-[11px] font-bold text-[#a0aec0] uppercase tracking-wider">GST</span>
                                                <span className="font-bold text-[#2d3748] text-[13px]">₹{gst.toLocaleString('en-IN', {minimumFractionDigits: 2})}</span>
                                            </div>
                                            <div className="flex justify-between items-center pt-4 border-t border-[#e2e8f0]">
                                                <span className="text-[11px] font-bold text-[#2d3748] uppercase tracking-wider">GRAND TOTAL (INCL. GST)</span>
                                                <span className="font-bold text-[#d69e2e] text-base">₹{grandTotal.toLocaleString('en-IN', {minimumFractionDigits: 2})}</span>
                                            </div>
                                        </div>
                                    </div>
                                </td>
                            </tr>
                        </tfoot>
                    </table>
                </div>
            )}
            
            {poItems.length > 0 && (
                <div className="mt-6 flex justify-end">
                    <button
                        onClick={handleSubmitPO}
                        disabled={isSubmitting}
                        className="bg-amber-600 hover:bg-amber-700 text-white px-8 py-3 rounded-xl font-medium transition-colors flex items-center gap-2"
                    >
                        {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : null}
                        {isSubmitting ? 'Submitting PO...' : 'Submit Purchase Order'}
                    </button>
                </div>
            )}

            {/* Past POs List */}
            <div className="mt-12 pt-8 border-t border-[#e2e8f0]">
                <h3 className="text-lg font-bold text-[#2d3748] mb-6">My Purchase Orders</h3>
                {loadingPOs ? (
                    <div className="flex justify-center py-8">
                        <Loader2 className="w-8 h-8 animate-spin text-amber-500" />
                    </div>
                ) : pastPOs.length === 0 ? (
                    <div className="text-center py-8 text-[#a0aec0] bg-[#f8fafc] rounded-xl border border-dashed border-[#cbd5e0]">
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
                                    <div className={`px-3 py-1 rounded-full text-xs font-bold ${
                                        po.status === 'Approved' ? 'bg-green-100 text-green-700' :
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
        </div>
    );
}
