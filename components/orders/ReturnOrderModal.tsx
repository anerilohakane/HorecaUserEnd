import React, { useState } from 'react';
import { X, Upload, Loader2, AlertCircle, CheckSquare, Square } from 'lucide-react';

interface ReturnOrderModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: { selectedItems: any[], reason: string; comment: string; images: string[] }) => Promise<void>;
    orderItems: any[];
    orderId: string;
}

const ReturnOrderModal: React.FC<ReturnOrderModalProps> = ({ isOpen, onClose, onSubmit, orderItems, orderId }) => {
    const [reason, setReason] = useState<string>('');
    const [comment, setComment] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [selectedItems, setSelectedItems] = useState<string[]>([]); // Array of product IDs
    const [returnQuantities, setReturnQuantities] = useState<Record<string, number>>({});
    const [alreadyReturned, setAlreadyReturned] = useState<Record<string, number>>({});
    const [isLoadingData, setIsLoadingData] = useState(false);

    const [itemDetails, setItemDetails] = useState<Record<string, {
        reason: string;
        images: string[];
        expiryDate: string;
        deliveryDate: string;
        batchDetails: string;
    }>>({});
    const [uploadingItemId, setUploadingItemId] = useState<string | null>(null);

    // Initialize/Reset
    React.useEffect(() => {
        if (isOpen) {
            setReason('');
            setComment('');
            setError(null);
            
            const fetchReturnData = async () => {
                setIsLoadingData(true);
                try {
                    const API_BASE = (process.env.NEXT_PUBLIC_HORECA_BACKEND_URL || process.env.NEXT_PUBLIC_BACKEND_URL || "https://horeca-backend-six.vercel.app").replace(/\/$/, "");
                    const res = await fetch(`${API_BASE}/api/returns?orderId=${orderId}`);
                    const json = await res.json();
                    
                    const returnedRecord: Record<string, number> = {};
                    if (json.data) {
                        json.data.forEach((ret: any) => {
                            if (ret.status !== "Vendor Rejected" && ret.status !== "Return Closed") {
                                ret.items.forEach((ri: any) => {
                                    const pId = String(ri.product?._id || ri.product);
                                    if (ri.status !== "Rejected") {
                                        returnedRecord[pId] = (returnedRecord[pId] || 0) + (ri.requestedReturnQty || ri.quantity || 0);
                                    }
                                });
                            }
                        });
                    }
                    setAlreadyReturned(returnedRecord);

                    const initialSelection: string[] = [];
                    const initialQty: Record<string, number> = {};
                    const initialDetails: Record<string, {
                        reason: string;
                        images: string[];
                        expiryDate: string;
                        deliveryDate: string;
                        batchDetails: string;
                    }> = {};

                    orderItems.forEach(item => {
                        const pId = String(item.product?._id || item.product?.id || item.productId || item.product);
                        const maxAllowed = item.quantity - (returnedRecord[pId] || 0);
                        if (maxAllowed > 0) {
                            initialSelection.push(pId);
                            initialQty[pId] = maxAllowed;
                            initialDetails[pId] = {
                                reason: '',
                                images: [],
                                expiryDate: '',
                                deliveryDate: '',
                                batchDetails: ''
                            };
                        }
                    });

                    setSelectedItems(initialSelection);
                    setReturnQuantities(initialQty);
                    setItemDetails(initialDetails);
                } catch (err) {
                    console.error("Failed to fetch past returns", err);
                } finally {
                    setIsLoadingData(false);
                }
            };
            fetchReturnData();
        }
    }, [isOpen, orderItems, orderId]);

    if (!isOpen) return null;

    const toggleItem = (pId: string) => {
        setSelectedItems(prev => {
            if (prev.includes(pId)) {
                return prev.filter(id => id !== pId);
            } else {
                return [...prev, pId];
            }
        });
    };

    const updateItemDetail = (pId: string, field: string, value: any) => {
        setItemDetails(prev => ({
            ...prev,
            [pId]: {
                ...prev[pId],
                [field]: value
            }
        }));
    };

    const handleImageUpload = async (pId: string, files: FileList | null) => {
        if (!files || files.length === 0) return;
        setUploadingItemId(pId);
        setError(null);
        try {
            const API_BASE = (process.env.NEXT_PUBLIC_HORECA_BACKEND_URL || process.env.NEXT_PUBLIC_BACKEND_URL || "https://horeca-backend-six.vercel.app").replace(/\/$/, "");
            const uploadedUrls = [...(itemDetails[pId]?.images || [])];
            
            for (let i = 0; i < files.length; i++) {
                const file = files[i];
                const formData = new FormData();
                formData.append("file", file);
                
                const res = await fetch(`${API_BASE}/api/upload`, {
                    method: 'POST',
                    body: formData
                });
                
                const json = await res.json();
                if (!res.ok || !json.success) {
                    throw new Error(json.error || "Failed to upload photo");
                }
                
                uploadedUrls.push(json.url);
            }
            
            updateItemDetail(pId, 'images', uploadedUrls);
        } catch (err: any) {
            console.error("Upload error:", err);
            setError(`Image upload failed: ${err.message}`);
        } finally {
            setUploadingItemId(null);
        }
    };

    const removeImage = (pId: string, indexToRemove: number) => {
        const currentImages = itemDetails[pId]?.images || [];
        const updatedImages = currentImages.filter((_, idx) => idx !== indexToRemove);
        updateItemDetail(pId, 'images', updatedImages);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (selectedItems.length === 0) {
            setError("Please select at least one item to return");
            return;
        }

        // Validate details for all selected items
        for (const pId of selectedItems) {
            const details = itemDetails[pId];
            const item = orderItems.find(i => String(i.product?._id || i.product?.id || i.productId || i.product) === pId);
            const itemName = item ? (item.productName || item.name) : "Product";

            if (!details) {
                setError(`Please fill in return details for ${itemName}`);
                return;
            }
            if (!details.reason) {
                setError(`Please select a reason for ${itemName}`);
                return;
            }
            if (!details.expiryDate) {
                setError(`Please enter the expiry date for ${itemName}`);
                return;
            }
            if (!details.deliveryDate) {
                setError(`Please enter the delivery date for ${itemName}`);
                return;
            }
            if (!details.batchDetails || !details.batchDetails.trim()) {
                setError(`Please enter the batch details for ${itemName}`);
                return;
            }
            const imgCount = details.images?.length || 0;
            if (imgCount < 2) {
                setError(`Please upload at least 2 photos for ${itemName} (at least 2-3 photos of the product is required)`);
                return;
            }
        }

        setIsSubmitting(true);
        setError(null);
        try {
            // Filter original items based on selection and map to include requested quantity and details
            const itemsToReturn = orderItems.filter(item => {
                const pId = item.product?._id || item.product?.id || item.productId || item.product;
                return selectedItems.includes(pId);
            }).map(item => {
                const pId = item.product?._id || item.product?.id || item.productId || item.product;
                const details = itemDetails[pId];
                return {
                    ...item,
                    quantity: returnQuantities[pId] || 1,
                    requestedReturnQty: returnQuantities[pId] || 1,
                    reason: details.reason,
                    images: details.images,
                    expiryDate: details.expiryDate,
                    deliveryDate: details.deliveryDate,
                    batchDetails: details.batchDetails
                };
            });

            const primaryReason = itemsToReturn[0]?.reason || "Not specified";

            await onSubmit({ selectedItems: itemsToReturn, reason: primaryReason, comment, images: [] });
            onClose();
        } catch (err: any) {
            setError(err.message || 'Failed to submit return request');
        } finally {
            setIsSubmitting(false);
        }
    };

    const reasons = [
        "Defective/Damaged Product",
        "Wrong Item Received",
        "Item Not as Described",
        "Size/Fit Issues",
        "No Longer Needed",
        "Other"
    ];

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl animate-in fade-in zoom-in duration-200 flex flex-col max-h-[90vh]">

                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-100 flex-shrink-0">
                    <div>
                        <h3 className="text-xl font-bold text-gray-900">Return Order</h3>
                        <p className="text-sm text-gray-500 mt-1">Order #{orderId.slice(-6).toUpperCase()}</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                        <X size={20} className="text-gray-500" />
                    </button>
                </div>

                {/* Scrollable Content */}
                <div className="overflow-y-auto p-6 space-y-6">

                    {/* Error Message */}
                    {error && (
                        <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm flex items-center gap-2">
                            <AlertCircle size={16} />
                            {error}
                        </div>
                    )}
                    {isLoadingData && (
                        <div className="text-sm text-gray-500 flex items-center gap-2">
                            <div className="w-4 h-4 border-2 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
                            Checking return eligibility...
                        </div>
                    )}

                    {/* Item Selection */}
                    <div className="space-y-3">
                        <label className="text-sm font-medium text-gray-700 block">Select Items to Return ({selectedItems.length})</label>
                        <div className="border rounded-xl divide-y overflow-hidden">
                            {orderItems.map((item) => {
                                const pId = String(item.product?._id || item.product?.id || item.productId || item.product);
                                const maxAllowed = item.quantity - (alreadyReturned[pId] || 0);
                                const isFullyReturned = maxAllowed <= 0;
                                const isSelected = selectedItems.includes(pId);
                                return (
                                    <div key={pId} className="flex flex-col border-b last:border-b-0">
                                        <div
                                            onClick={() => !isFullyReturned && toggleItem(pId)}
                                            className={`flex items-center gap-3 p-3 transition-colors ${isFullyReturned ? 'opacity-50 cursor-not-allowed bg-gray-50' : isSelected ? 'bg-amber-50/50 cursor-pointer' : 'hover:bg-gray-50 cursor-pointer'}`}
                                        >
                                            <div className={`w-5 h-5 rounded border flex items-center justify-center flex-shrink-0 ${isFullyReturned ? 'bg-gray-200 border-gray-300' : isSelected ? 'bg-amber-600 border-amber-600 text-white' : 'border-gray-300 text-transparent'}`}>
                                                <CheckSquare size={14} />
                                            </div>
                                            <div className="flex-1 flex items-center justify-between">
                                                <div>
                                                    <p className="font-medium text-gray-900 text-sm">{item.productName || item.name}</p>
                                                    <p className="text-xs text-gray-500">
                                                        Ordered: {item.quantity} 
                                                        {alreadyReturned[pId] > 0 && ` • Previously Returned: ${alreadyReturned[pId]}`} 
                                                        {isFullyReturned && <span className="text-rose-600 font-medium ml-2">(Max Reached)</span>}
                                                    </p>
                                                </div>
                                                {isSelected && !isFullyReturned && (
                                                    <div className="flex items-center gap-3 bg-white border rounded-lg px-2 py-1 ml-4" onClick={e => e.stopPropagation()}>
                                                        <button 
                                                            disabled={(returnQuantities[pId] || 1) <= 1}
                                                            type="button"
                                                            onClick={() => setReturnQuantities(prev => ({ ...prev, [pId]: Math.max(1, (prev[pId] || 1) - 1) }))}
                                                            className="text-gray-500 hover:text-amber-600 disabled:opacity-50 text-lg font-medium px-1"
                                                        >-</button>
                                                        <span className="text-sm font-bold text-gray-900 w-4 text-center">{returnQuantities[pId] || 1}</span>
                                                        <button 
                                                            disabled={(returnQuantities[pId] || 1) >= maxAllowed}
                                                            type="button"
                                                            onClick={() => setReturnQuantities(prev => ({ ...prev, [pId]: Math.min(maxAllowed, (prev[pId] || 1) + 1) }))}
                                                            className="text-gray-500 hover:text-amber-600 disabled:opacity-50 text-lg font-medium px-1"
                                                        >+</button>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {/* Product Details Form (Only when selected) */}
                                        {isSelected && !isFullyReturned && (
                                            <div className="p-4 bg-gray-50/50 border-t border-dashed border-gray-150 space-y-4" onClick={e => e.stopPropagation()}>
                                                {/* Reason for return */}
                                                <div className="space-y-1">
                                                    <label className="text-xs font-semibold text-gray-700 block">Reason for Return *</label>
                                                    <select 
                                                        value={itemDetails[pId]?.reason || ''} 
                                                        onChange={e => updateItemDetail(pId, 'reason', e.target.value)}
                                                        className="w-full p-2 border border-gray-200 rounded-lg text-sm bg-white focus:ring-1 focus:ring-amber-500 focus:outline-none text-gray-800"
                                                    >
                                                        <option value="">Select a reason...</option>
                                                        {reasons.map(r => (
                                                            <option key={r} value={r}>{r}</option>
                                                        ))}
                                                    </select>
                                                </div>

                                                {/* Expiry Date & Delivery Date */}
                                                <div className="grid grid-cols-2 gap-3">
                                                    <div className="space-y-1">
                                                        <label className="text-xs font-semibold text-gray-700 block">Expiry Date *</label>
                                                        <input 
                                                            type="date"
                                                            value={itemDetails[pId]?.expiryDate || ''}
                                                            onChange={e => updateItemDetail(pId, 'expiryDate', e.target.value)}
                                                            className="w-full p-2 border border-gray-200 rounded-lg text-sm focus:ring-1 focus:ring-amber-500 focus:outline-none text-gray-800"
                                                        />
                                                    </div>
                                                    <div className="space-y-1">
                                                        <label className="text-xs font-semibold text-gray-700 block">Delivery Date *</label>
                                                        <input 
                                                            type="date"
                                                            value={itemDetails[pId]?.deliveryDate || ''}
                                                            onChange={e => updateItemDetail(pId, 'deliveryDate', e.target.value)}
                                                            className="w-full p-2 border border-gray-200 rounded-lg text-sm focus:ring-1 focus:ring-amber-500 focus:outline-none text-gray-800"
                                                        />
                                                    </div>
                                                </div>

                                                {/* Batch Details */}
                                                <div className="space-y-1">
                                                    <label className="text-xs font-semibold text-gray-700 block">Batch Details *</label>
                                                    <input 
                                                        type="text"
                                                        placeholder="e.g. BATCH-1234, MFG-05/26"
                                                        value={itemDetails[pId]?.batchDetails || ''}
                                                        onChange={e => updateItemDetail(pId, 'batchDetails', e.target.value)}
                                                        className="w-full p-2 border border-gray-200 rounded-lg text-sm focus:ring-1 focus:ring-amber-500 focus:outline-none text-gray-800"
                                                    />
                                                </div>

                                                {/* Photos Upload */}
                                                <div className="space-y-1">
                                                    <label className="text-xs font-semibold text-gray-700 block">Product Photos * (At least 2-3 required)</label>
                                                    <div className="flex flex-wrap gap-2 items-center mt-2">
                                                        {(itemDetails[pId]?.images || []).map((imgUrl, idx) => (
                                                            <div key={idx} className="relative w-16 h-16 border rounded-lg overflow-hidden group">
                                                                <img src={imgUrl} className="w-full h-full object-cover" />
                                                                <button 
                                                                    type="button"
                                                                    onClick={() => removeImage(pId, idx)}
                                                                    className="absolute inset-0 bg-black/70 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-xs font-bold"
                                                                >
                                                                    Remove
                                                                </button>
                                                            </div>
                                                        ))}
                                                        {uploadingItemId === pId ? (
                                                            <div className="w-16 h-16 border border-dashed rounded-lg flex flex-col items-center justify-center bg-gray-50 text-[10px] text-gray-500">
                                                                <Loader2 className="animate-spin text-amber-600 mb-1" size={16} />
                                                                Uploading...
                                                            </div>
                                                        ) : (
                                                            <label className="w-16 h-16 border-2 border-dashed border-gray-200 hover:border-amber-500 rounded-lg flex flex-col items-center justify-center bg-gray-50 hover:bg-amber-50/20 cursor-pointer transition-colors text-[10px] text-gray-500">
                                                                <Upload size={16} className="text-gray-400 mb-1" />
                                                                Add Photo
                                                                <input 
                                                                    type="file" 
                                                                    accept="image/*" 
                                                                    multiple 
                                                                    className="hidden" 
                                                                    onChange={e => handleImageUpload(pId, e.target.files)} 
                                                                />
                                                            </label>
                                                        )}
                                                    </div>
                                                    <p className="text-[10px] text-gray-500 mt-1">Uploaded: {(itemDetails[pId]?.images || []).length} (Min 2 required)</p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Comment */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">
                            Additional Comments (Optional)
                        </label>
                        <textarea
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            className="w-full p-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all resize-none h-24 text-sm"
                            placeholder="Please provide more details about the issue..."
                        />
                    </div>
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-gray-100 flex-shrink-0">
                    <button
                        onClick={handleSubmit}
                        disabled={isSubmitting || selectedItems.length === 0}
                        className="w-full bg-[#D97706] text-white py-4 rounded-xl font-medium hover:bg-[#B45309] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {isSubmitting ? (
                            <>
                                <Loader2 size={20} className="animate-spin" />
                                Submitting Request...
                            </>
                        ) : (
                            `Return ${selectedItems.length} Item${selectedItems.length !== 1 ? 's' : ''}`
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ReturnOrderModal;
