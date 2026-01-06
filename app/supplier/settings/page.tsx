'use client';

import { useState } from 'react';
import { Save, Bell, Shield, CreditCard, Check } from 'lucide-react';

export default function SupplierSettingsPage() {
    const [activeTab, setActiveTab] = useState('payout' as 'payout' | 'notifications' | 'security');
    const [isSaving, setIsSaving] = useState(false);

    const handleSave = () => {
        setIsSaving(true);
        setTimeout(() => {
            setIsSaving(false);
        }, 1000);
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <h1 className="text-2xl font-bold text-[#111827]">Account Settings</h1>

            <div className="flex flex-col md:flex-row gap-6">

                {/* Settings Sidebar */}
                <div className="w-full md:w-64 flex-shrink-0">
                    <div className="bg-white rounded-2xl soft-shadow border border-gray-100 overflow-hidden">
                        <button
                            onClick={() => setActiveTab('payout')}
                            className={`w-full flex items-center gap-3 px-6 py-4 text-left font-medium transition-colors ${activeTab === 'payout'
                                    ? 'bg-orange-50 text-[#D97706] border-l-4 border-[#D97706]'
                                    : 'text-gray-600 hover:bg-gray-50 border-l-4 border-transparent'
                                }`}
                        >
                            <CreditCard size={20} />
                            Payout Details
                        </button>
                        <button
                            onClick={() => setActiveTab('notifications')}
                            className={`w-full flex items-center gap-3 px-6 py-4 text-left font-medium transition-colors ${activeTab === 'notifications'
                                    ? 'bg-orange-50 text-[#D97706] border-l-4 border-[#D97706]'
                                    : 'text-gray-600 hover:bg-gray-50 border-l-4 border-transparent'
                                }`}
                        >
                            <Bell size={20} />
                            Notifications
                        </button>
                        <button
                            onClick={() => setActiveTab('security')}
                            className={`w-full flex items-center gap-3 px-6 py-4 text-left font-medium transition-colors ${activeTab === 'security'
                                    ? 'bg-orange-50 text-[#D97706] border-l-4 border-[#D97706]'
                                    : 'text-gray-600 hover:bg-gray-50 border-l-4 border-transparent'
                                }`}
                        >
                            <Shield size={20} />
                            Security
                        </button>
                    </div>
                </div>

                {/* Content Area */}
                <div className="flex-grow">

                    {/* Payout Details */}
                    {activeTab === 'payout' && (
                        <div className="bg-white p-6 rounded-2xl soft-shadow border border-gray-100 space-y-6">
                            <div>
                                <h2 className="text-lg font-bold text-[#111827]">Bank Account Details</h2>
                                <p className="text-sm text-gray-500">Your earnings will be transferred to this account.</p>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Account Holder Name</label>
                                    <input
                                        type="text"
                                        className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-[#D97706] outline-none"
                                        placeholder="As per bank records"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Account Number</label>
                                    <input
                                        type="password"
                                        className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-[#D97706] outline-none"
                                        placeholder="•••• •••• •••• 1234"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">IFSC Code</label>
                                        <input
                                            type="text"
                                            className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-[#D97706] outline-none uppercase"
                                            placeholder="HDFC0001234"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Bank Name</label>
                                        <input
                                            type="text"
                                            className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-[#D97706] outline-none"
                                            placeholder="HDFC Bank"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Notifications */}
                    {activeTab === 'notifications' && (
                        <div className="bg-white p-6 rounded-2xl soft-shadow border border-gray-100 space-y-6">
                            <div>
                                <h2 className="text-lg font-bold text-[#111827]">Notification Preferences</h2>
                                <p className="text-sm text-gray-500">Manage how you receive alerts and updates.</p>
                            </div>

                            <div className="space-y-4">
                                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                                    <div>
                                        <h3 className="font-medium text-[#111827]">New Order Alerts</h3>
                                        <p className="text-sm text-gray-500">Receive an email when a customer places an order.</p>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input type="checkbox" defaultChecked className="sr-only peer" />
                                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#D97706]"></div>
                                    </label>
                                </div>

                                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                                    <div>
                                        <h3 className="font-medium text-[#111827]">Low Stock Warnings</h3>
                                        <p className="text-sm text-gray-500">Get notified when product stock falls below 20 units.</p>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input type="checkbox" defaultChecked className="sr-only peer" />
                                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#D97706]"></div>
                                    </label>
                                </div>

                                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                                    <div>
                                        <h3 className="font-medium text-[#111827]">Marketing Emails</h3>
                                        <p className="text-sm text-gray-500">Receive tips and promotional offers.</p>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input type="checkbox" className="sr-only peer" />
                                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#D97706]"></div>
                                    </label>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Security */}
                    {activeTab === 'security' && (
                        <div className="bg-white p-6 rounded-2xl soft-shadow border border-gray-100 space-y-6">
                            <div>
                                <h2 className="text-lg font-bold text-[#111827]">Security Settings</h2>
                                <p className="text-sm text-gray-500">Update your password to keep your account safe.</p>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
                                    <input
                                        type="password"
                                        className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-[#D97706] outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                                    <input
                                        type="password"
                                        className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-[#D97706] outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
                                    <input
                                        type="password"
                                        className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-[#D97706] outline-none"
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Save Button */}
                    <div className="mt-6 flex justify-end">
                        <button
                            onClick={handleSave}
                            disabled={isSaving}
                            className="flex items-center gap-2 bg-[#D97706] text-white px-8 py-3 rounded-full hover:bg-[#B45309] transition-all font-medium shadow-md shadow-orange-100 disabled:opacity-70"
                        >
                            {isSaving ? <span className="animate-spin">⟳</span> : <Check size={20} />}
                            {isSaving ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>

                </div>
            </div>
        </div>
    );
}
