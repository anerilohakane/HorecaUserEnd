'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useRouter } from 'next/navigation';
import { Building2, CheckCircle, ArrowRight, Upload, ShieldCheck, TrendingUp } from 'lucide-react';

export default function BecomeSupplierPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        businessName: '',
        contactName: '',
        email: '',
        phone: '',
        category: '',
        gst: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Simulate API call
        setTimeout(() => {
            setIsSubmitting(false);
            // Redirect to static dashboard
            router.push('/supplier');
        }, 1500);
    };

    return (
        <div className="min-h-screen flex flex-col bg-[#FAFAF7]">
            <Header />

            <main className="flex-grow">
                {/* Hero Section */}
                {/* <section className="bg-[#111827] text-white py-20 px-4">
                    <div className="max-w-7xl mx-auto text-center">
                        <h1 className="text-4xl md:text-5xl font-bold mb-6">
                            Grow Your Business with Unifoods
                        </h1>
                        <p className="text-lg text-gray-300 max-w-2xl mx-auto mb-10">
                            Join thousands of suppliers selling to bakeries, cafes, and hotels across India.
                            Manage products, track orders, and boost revenue with our dedicated supplier dashboard.
                        </p>
                        <div className="flex justify-center gap-4">
                            <div className="flex items-center gap-2 text-[#D97706]">
                                <CheckCircle size={20} />
                                <span>Zero Commission for 1st Month</span>
                            </div>
                            <div className="flex items-center gap-2 text-[#D97706]">
                                <CheckCircle size={20} />
                                <span>Verified Buyers</span>
                            </div>
                        </div>
                    </div>
                </section> */}

                <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16 grid lg:grid-cols-2 gap-16">

                    {/* Registration Form */}
                    <div className="bg-white p-8 rounded-2xl soft-shadow border border-gray-100">
                        <h2 className="text-2xl font-bold text-[#111827] mb-6">Register as a Supplier</h2>
                        <form onSubmit={handleSubmit} className="space-y-5">

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Business Name</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-[#D97706] focus:ring-1 focus:ring-[#D97706] outline-none transition-all"
                                    placeholder="e.g. Nature's Best Supplies"
                                    value={formData.businessName}
                                    onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Contact Person</label>
                                    <input
                                        type="text"
                                        required
                                        className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-[#D97706] outline-none"
                                        placeholder="Full Name"
                                        value={formData.contactName}
                                        onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                                    <input
                                        type="tel"
                                        required
                                        className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-[#D97706] outline-none"
                                        placeholder="+91 98765 43210"
                                        value={formData.phone}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                                <input
                                    type="email"
                                    required
                                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-[#D97706] outline-none"
                                    placeholder="business@example.com"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Business Category</label>
                                <select
                                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-[#D97706] outline-none bg-white"
                                    value={formData.category}
                                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                >
                                    <option value="">Select Category</option>
                                    <option value="bakery">Bakery Ingredients</option>
                                    <option value="dairy">Dairy Products</option>
                                    <option value="packaging">Packaging</option>
                                    <option value="equipment">Equipment</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">GST Number (Optional)</label>
                                <input
                                    type="text"
                                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-[#D97706] outline-none"
                                    placeholder="GSTIN"
                                    value={formData.gst}
                                    onChange={(e) => setFormData({ ...formData, gst: e.target.value })}
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full bg-[#D97706] text-white py-4 rounded-xl font-semibold hover:bg-[#B45309] transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-70"
                            >
                                {isSubmitting ? 'Registering...' : 'Complete Registration'}
                                {!isSubmitting && <ArrowRight size={20} />}
                            </button>

                            <p className="text-center text-sm text-gray-500">
                                Already registered? <a href="/supplier/login" className="text-[#D97706] font-medium hover:underline">Login here</a>
                            </p>
                        </form>
                    </div>

                    {/* Benefits Section */}
                    <div className="space-y-10 py-8">
                        <div>
                            <h3 className="text-3xl font-light text-[#111827] mb-6">Why Sell on Unifoods?</h3>
                            <p className="text-gray-600 leading-relaxed">
                                We connect you directly with verified businesses, eliminating middlemen and payment delays.
                                Our platform provides powerful tools to manage your inventory and orders efficiently.
                            </p>
                        </div>

                        <div className="space-y-6">
                            <div className="flex gap-4">
                                <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                    <TrendingUp className="text-[#D97706]" size={24} />
                                </div>
                                <div>
                                    <h4 className="font-semibold text-lg text-[#111827]">Increase Sales</h4>
                                    <p className="text-gray-600">Access thousands of new customers looking for quality supplies.</p>
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                    <ShieldCheck className="text-[#D97706]" size={24} />
                                </div>
                                <div>
                                    <h4 className="font-semibold text-lg text-[#111827]">Verified Payments</h4>
                                    <p className="text-gray-600">Secure payments and timely settlements directly to your bank account.</p>
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                    <Building2 className="text-[#D97706]" size={24} />
                                </div>
                                <div>
                                    <h4 className="font-semibold text-lg text-[#111827]">Business Tools</h4>
                                    <p className="text-gray-600">Advanced dashboard for inventory management, analytics, and invoicing.</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-amber-50 rounded-xl p-6 border border-amber-100">
                            <div className="flex items-start gap-3">
                                <Upload className="text-[#D97706] mt-1" size={24} />
                                <div>
                                    <h4 className="font-semibold text-[#111827] mb-1">Easy Onboarding</h4>
                                    <p className="text-sm text-gray-600">
                                        Register in minutes. Upload your catalog using our specific Excel templates or add products one by one.
                                    </p>
                                </div>
                            </div>
                        </div>

                    </div>

                </div>

            </main>
            <Footer />
        </div>
    );
}
