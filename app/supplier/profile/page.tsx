import { mockSupplierProfile } from '@/lib/mock/supplier';
import { Camera, MapPin, Mail, Phone, Building, Save } from 'lucide-react';

export default function SupplierProfilePage() {
    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-[#111827]">Business Profile</h1>
                <button className="flex items-center gap-2 bg-[#D97706] text-white px-6 py-2.5 rounded-full hover:bg-[#B45309] transition-colors font-medium shadow-md">
                    <Save size={18} />
                    Save Changes
                </button>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
                {/* Left Column - Main Info */}
                <div className="md:col-span-2 space-y-6">
                    <div className="bg-white p-6 rounded-2xl soft-shadow border border-gray-100">
                        <h2 className="text-lg font-bold text-[#111827] mb-6">Basic Information</h2>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Business Name</label>
                                <input
                                    type="text"
                                    defaultValue={mockSupplierProfile.name}
                                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-[#D97706] outline-none"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Business Type</label>
                                    <select
                                        defaultValue={mockSupplierProfile.type}
                                        className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-[#D97706] outline-none bg-white"
                                    >
                                        <option>Manufacturer</option>
                                        <option>Distributor</option>
                                        <option>Wholesaler</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">GST Number</label>
                                    <input
                                        type="text"
                                        defaultValue={mockSupplierProfile.gst}
                                        className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-[#D97706] outline-none uppercase"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-2xl soft-shadow border border-gray-100">
                        <h2 className="text-lg font-bold text-[#111827] mb-6">Contact & Address</h2>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                                <textarea
                                    defaultValue={mockSupplierProfile.address}
                                    rows={3}
                                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-[#D97706] outline-none resize-none"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                    <input
                                        type="email"
                                        defaultValue={mockSupplierProfile.email}
                                        className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-[#D97706] outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                                    <input
                                        type="tel"
                                        defaultValue={mockSupplierProfile.phone}
                                        className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-[#D97706] outline-none"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column - Profile Image & Status */}
                <div className="space-y-6">
                    <div className="bg-white p-6 rounded-2xl soft-shadow border border-gray-100 text-center">
                        <div className="relative w-32 h-32 bg-gray-100 rounded-full mx-auto mb-4 overflow-hidden border-4 border-white shadow-md">
                            <div className="w-full h-full flex items-center justify-center text-3xl font-bold text-gray-400">
                                NB
                            </div>
                        </div>
                        <button className="flex items-center gap-2 mx-auto text-[#D97706] font-medium hover:underline text-sm">
                            <Camera size={16} />
                            Change Logo
                        </button>
                        <div className="mt-6 pt-6 border-t border-gray-100">
                            <p className="text-sm text-gray-500 mb-1">Member Since</p>
                            <p className="font-semibold text-[#111827]">{mockSupplierProfile.joinedDate}</p>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                        <h3 className="font-bold text-[#111827] mb-4">Verification Status</h3>
                        <div className="flex items-center gap-3 p-3 bg-green-50 text-green-700 rounded-xl mb-3">
                            <Building size={20} />
                            <span className="font-medium text-sm">GST Verified</span>
                        </div>
                        <div className="flex items-center gap-3 p-3 bg-green-50 text-green-700 rounded-xl">
                            <Phone size={20} />
                            <span className="font-medium text-sm">Phone Verified</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
