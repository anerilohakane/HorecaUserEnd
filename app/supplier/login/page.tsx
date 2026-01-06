'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Mail, Lock, ArrowRight, Award } from 'lucide-react';

export default function SupplierLoginPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Simulate Login Delay
        setTimeout(() => {
            setIsSubmitting(false);
            router.push('/supplier');
        }, 1500);
    };

    return (
        <div className="min-h-screen bg-[#FAFAF7] flex items-center justify-center px-4">
            <div className="max-w-md w-full">

                {/* Logo/Brand */}
                <div className="text-center mb-8">
                    <Link href="/" className="inline-flex items-center gap-2 mb-4 group">
                        <Award className="text-[#D97706] group-hover:scale-110 transition-transform" size={40} />
                        <span className="font-bold text-3xl text-[#111827]">Supplier<span className="text-[#D97706]">Hub</span></span>
                    </Link>
                    <h2 className="text-2xl font-bold text-gray-900">Welcome Back</h2>
                    <p className="text-gray-600 mt-2">Log in to manage your business and orders</p>
                </div>

                {/* Login Form */}
                <div className="bg-white p-8 rounded-2xl soft-shadow border border-gray-100">
                    <form onSubmit={handleSubmit} className="space-y-6">

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                                <input
                                    type="email"
                                    required
                                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-[#D97706] focus:ring-1 focus:ring-[#D97706] outline-none transition-all"
                                    placeholder="name@business.com"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                />
                            </div>
                        </div>

                        <div>
                            <div className="flex items-center justify-between mb-1">
                                <label className="block text-sm font-medium text-gray-700">Password</label>
                                <a href="#" className="text-xs font-medium text-[#D97706] hover:underline">Forgot password?</a>
                            </div>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                                <input
                                    type="password"
                                    required
                                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-[#D97706] focus:ring-1 focus:ring-[#D97706] outline-none transition-all"
                                    placeholder="••••••••"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full bg-[#D97706] text-white py-3.5 rounded-xl font-semibold hover:bg-[#B45309] transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-70"
                        >
                            {isSubmitting ? 'Logging in...' : 'Sign In'}
                            {!isSubmitting && <ArrowRight size={20} />}
                        </button>

                    </form>

                    <div className="mt-8 pt-6 border-t border-gray-100 text-center">
                        <p className="text-sm text-gray-600">
                            New to Horeca? <Link href="/become-supplier" className="text-[#D97706] font-medium hover:underline">Register as a Supplier</Link>
                        </p>
                    </div>
                </div>

                <div className="text-center mt-8">
                    <Link href="/" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">
                        ← Back to Marketplace
                    </Link>
                </div>

            </div>
        </div>
    );
}
