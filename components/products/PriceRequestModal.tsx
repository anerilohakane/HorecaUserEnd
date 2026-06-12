import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, AlertCircle, RefreshCw } from 'lucide-react';
import { useAuth } from '@/lib/context/AuthContext';
import { sileo } from 'sileo';

interface PriceRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: any;
  currentPrice: number;
}

export default function PriceRequestModal({ isOpen, onClose, product, currentPrice }: PriceRequestModalProps) {
  const { user, token } = useAuth();
  const [requestedPrice, setRequestedPrice] = useState<number | ''>('');
  const [quantity, setQuantity] = useState<number>(product?.minOrder || 1);
  const [remark, setRemark] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen || !product) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !user) {
      sileo.warning({ title: 'Login Required', description: 'Please login to request a better price.' });
      return;
    }
    if (!requestedPrice || requestedPrice >= currentPrice) {
      sileo.warning({ title: 'Invalid Price', description: 'Requested price must be lower than the current price.' });
      return;
    }

    setIsSubmitting(true);
    try {
      const base = (process.env.NEXT_PUBLIC_BACKEND_URL || "https://horeca-backend-six.vercel.app").replace(/\/$/, "");
      const res = await fetch(`${base}/api/price-requests`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          customerId: user.id || (user as any)._id,
          productId: product.id || product._id,
          originalPrice: currentPrice,
          requestedPrice: Number(requestedPrice),
          quantity: Number(quantity),
          remark
        })
      });

      const json = await res.json();
      if (res.ok && json.success) {
        sileo.success({ title: 'Request Submitted', description: 'Your price request has been sent to sales. We will get back to you soon.' });
        onClose();
        setRequestedPrice('');
        setRemark('');
        setQuantity(product.minOrder || 1);
      } else {
        throw new Error(json.error || 'Failed to submit request');
      }
    } catch (err: any) {
      console.error(err);
      sileo.error({ title: 'Request Failed', description: err.message || 'An error occurred while submitting your request.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col"
            >
              <div className="flex items-center justify-between p-6 border-b border-gray-100">
                <h2 className="text-xl font-bold text-gray-900">Request Better Price</h2>
                <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-5">
                <div className="bg-gray-50 p-4 rounded-xl flex items-center gap-4">
                  {product.image && (
                    <img 
                      src={product.image} 
                      alt={product.name} 
                      className="w-16 h-16 object-cover rounded-lg border border-gray-200 bg-white"
                      onError={(e) => { e.currentTarget.src = '/images/placeholder.png'; }}
                    />
                  )}
                  <div>
                    <h3 className="font-semibold text-gray-900 line-clamp-1">{product.name}</h3>
                    <p className="text-sm text-gray-500">Current Price: <span className="font-bold text-gray-900">₹{currentPrice}</span> / {product.unit}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Requested Price (₹)</label>
                    <input
                      type="number"
                      required
                      min={1}
                      max={currentPrice - 1}
                      value={requestedPrice}
                      onChange={(e) => setRequestedPrice(e.target.value ? Number(e.target.value) : '')}
                      placeholder={`< ₹${currentPrice}`}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-[#D97706] focus:border-[#D97706] outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
                    <input
                      type="number"
                      required
                      min={product.minOrder || 1}
                      value={quantity}
                      onChange={(e) => setQuantity(Number(e.target.value))}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-[#D97706] focus:border-[#D97706] outline-none"
                    />
                    <p className="text-xs text-gray-500 mt-1">Min: {product.minOrder || 1}</p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Optional Remark</label>
                  <textarea
                    rows={3}
                    value={remark}
                    onChange={(e) => setRemark(e.target.value)}
                    placeholder="Any message for our sales team..."
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-[#D97706] focus:border-[#D97706] outline-none resize-none"
                  ></textarea>
                </div>

                <div className="bg-orange-50 border border-orange-100 p-3 rounded-lg flex gap-2 text-orange-800 text-sm">
                  <AlertCircle className="w-5 h-5 flex-shrink-0" />
                  <p>Your request will be sent to our sales team for review. You can track its status in your profile.</p>
                </div>

                <div className="pt-2 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-5 py-2.5 text-gray-600 font-medium hover:bg-gray-100 rounded-xl transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting || !requestedPrice}
                    className="flex items-center gap-2 px-6 py-2.5 bg-[#D97706] text-white font-medium rounded-xl hover:bg-[#B45309] transition-colors shadow-sm disabled:opacity-50"
                  >
                    {isSubmitting ? <RefreshCw className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                    Submit Request
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
