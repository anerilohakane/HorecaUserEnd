'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Upload, Save, X, Plus } from 'lucide-react';
import Image from 'next/image';

export default function AddProductPage() {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [uploadedImages, setUploadedImages] = useState<string[]>([]);

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        // In a real app, upload to server/S3 here
        // For demo, we just simulate a local preview
        if (e.target.files && e.target.files[0]) {
            const url = URL.createObjectURL(e.target.files[0]);
            setUploadedImages([...uploadedImages, url]);
        }
    };

    const removeImage = (index: number) => {
        setUploadedImages(uploadedImages.filter((_, i) => i !== index));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Simulate API call
        setTimeout(() => {
            setIsSubmitting(false);
            router.push('/supplier/products');
        }, 1500);
    };

    return (
        <div className="max-w-5xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex items-center gap-4">
                <button
                    onClick={() => router.back()}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500"
                >
                    <ArrowLeft size={24} />
                </button>
                <h1 className="text-2xl font-bold text-[#111827]">Add New Product</h1>
            </div>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Left Col: Main Info */}
                <div className="lg:col-span-2 space-y-6">

                    {/* Basic Details Cards */}
                    <div className="bg-white p-6 rounded-2xl soft-shadow border border-gray-100">
                        <h2 className="text-lg font-bold text-[#111827] mb-6">Product Information</h2>

                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
                                <input
                                    type="text"
                                    required
                                    placeholder="e.g. Premium California Almonds"
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#D97706] focus:ring-1 focus:ring-[#D97706] outline-none transition-all"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                                    <select className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#D97706] outline-none bg-white">
                                        <option value="">Select Category</option>
                                        <option value="dry_fruits">Dry Fruits</option>
                                        <option value="spices">Spices</option>
                                        <option value="bakery">Bakery Ingredients</option>
                                        <option value="dairy">Dairy</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Brand (Optional)</label>
                                    <input
                                        type="text"
                                        placeholder="Your Brand Name"
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#D97706] outline-none"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                <textarea
                                    rows={4}
                                    placeholder="Describe your product features, quality, and usage..."
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#D97706] outline-none resize-none"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Pricing & Inventory */}
                    <div className="bg-white p-6 rounded-2xl soft-shadow border border-gray-100">
                        <h2 className="text-lg font-bold text-[#111827] mb-6">Pricing & Inventory</h2>

                        <div className="grid grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Price (₹)</label>
                                <input
                                    type="number"
                                    required
                                    placeholder="0.00"
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#D97706] outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Discounted Price (Optional)</label>
                                <input
                                    type="number"
                                    placeholder="0.00"
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#D97706] outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Stock Quantity</label>
                                <input
                                    type="number"
                                    required
                                    placeholder="0"
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#D97706] outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Unit</label>
                                <select className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#D97706] outline-none bg-white">
                                    <option value="kg">Kilogram (kg)</option>
                                    <option value="g">Gram (g)</option>
                                    <option value="l">Liter (l)</option>
                                    <option value="pc">Piece (pc)</option>
                                    <option value="box">Box</option>
                                </select>
                            </div>
                        </div>

                        <div className="mt-6 pt-6 border-t border-gray-100">
                            <label className="flex items-center gap-3 cursor-pointer">
                                <input type="checkbox" className="w-5 h-5 accent-[#D97706] border-gray-300 rounded" />
                                <span className="text-gray-700 font-medium">Accept Bulk Orders Only</span>
                            </label>
                            <div className="mt-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Minimum Order Quantity</label>
                                <input
                                    type="number"
                                    defaultValue={1}
                                    className="w-1/2 px-4 py-3 rounded-xl border border-gray-200 focus:border-[#D97706] outline-none"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Col: Media & Organization */}
                <div className="space-y-6">

                    {/* Image Upload */}
                    <div className="bg-white p-6 rounded-2xl soft-shadow border border-gray-100">
                        <h2 className="text-lg font-bold text-[#111827] mb-6">Product Images</h2>

                        <div className="grid grid-cols-2 gap-3 mb-4">
                            {uploadedImages.map((src, idx) => (
                                <div key={idx} className="relative aspect-square rounded-lg overflow-hidden border border-gray-200 group">
                                    <Image src={src} alt="Product preview" fill className="object-cover" />
                                    <button
                                        type="button"
                                        onClick={() => removeImage(idx)}
                                        className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        <X size={14} />
                                    </button>
                                </div>
                            ))}

                            <label className="aspect-square border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-[#D97706] hover:bg-orange-50 transition-colors">
                                <Upload className="text-gray-400 mb-2" />
                                <span className="text-xs text-gray-500 font-medium">Upload</span>
                                <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                            </label>
                        </div>

                        <p className="text-xs text-gray-500 text-center">
                            Upload up to 4 images. JPG, PNG recommended.
                        </p>
                    </div>

                    {/* Status */}
                    <div className="bg-white p-6 rounded-2xl soft-shadow border border-gray-100">
                        <h2 className="text-lg font-bold text-[#111827] mb-6">Status</h2>
                        <div className="space-y-4">
                            <label className="flex items-center gap-3 cursor-pointer p-3 border border-gray-200 rounded-xl hover:bg-gray-50">
                                <input type="radio" name="status" defaultChecked className="w-5 h-5 accent-[#D97706]" />
                                <div>
                                    <p className="font-medium text-[#111827]">Active</p>
                                    <p className="text-xs text-gray-500">Visible to all customers</p>
                                </div>
                            </label>
                            <label className="flex items-center gap-3 cursor-pointer p-3 border border-gray-200 rounded-xl hover:bg-gray-50">
                                <input type="radio" name="status" className="w-5 h-5 accent-[#D97706]" />
                                <div>
                                    <p className="font-medium text-[#111827]">Draft</p>
                                    <p className="text-xs text-gray-500">Saved but hidden</p>
                                </div>
                            </label>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-[#D97706] text-white py-4 rounded-xl font-semibold hover:bg-[#B45309] transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-70"
                    >
                        {isSubmitting ? 'Saving Product...' : 'Publish Product'}
                        {!isSubmitting && <Save size={20} />}
                    </button>

                </div>

            </form>
        </div>
    );
}
