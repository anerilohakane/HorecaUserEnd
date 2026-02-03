'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/lib/context/AuthContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Bell, Check, Trash2, AlertTriangle, Info, CheckCircle, XCircle, Filter, Calendar } from 'lucide-react';
import Link from 'next/link';
import { format, isToday, isYesterday } from 'date-fns';
import PageTransition from '@/components/ui/PageTransition';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://horeca-backend-six.vercel.app";

type Notification = {
    _id: string;
    title: string;
    message: string;
    type: 'info' | 'warning' | 'error' | 'success';
    isRead: boolean;
    createdAt: string;
    metadata?: any;
};

export default function NotificationsPage() {
    const { user, token, isAuthenticated } = useAuth();
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<'all' | 'unread'>('all');

    useEffect(() => {
        if (isAuthenticated && user && token) {
            fetchNotifications();
        } else if (!loading) {
            // Optional: Handle unauth state
        }
    }, [isAuthenticated, user, token]);

    const fetchNotifications = async () => {
        try {
            const userId = (user as any)?.id || (user as any)?._id;
            const res = await fetch(`${API_BASE}/api/notifications?userId=${userId}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            if (data.success) {
                setNotifications(data.data);
            }
        } catch (error) {
            console.error("Failed to fetch notifications", error);
        } finally {
            setLoading(false);
        }
    };

    const markAsRead = async (id: string) => {
        try {
            // Optimistic update
            setNotifications(prev => prev.map(n => n._id === id ? { ...n, isRead: true } : n));

            await fetch(`${API_BASE}/api/notifications/${id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ isRead: true })
            });
        } catch (error) {
            console.error(error);
        }
    };

    const deleteNotification = async (id: string) => {
        try {
            // Optimistic update
            setNotifications(prev => prev.filter(n => n._id !== id));

            await fetch(`${API_BASE}/api/notifications/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
        } catch (error) {
            console.error(error);
        }
    };

    const clearAll = async () => {
        if (!confirm("Are you sure you want to clear all notifications?")) return;
        try {
            const userId = (user as any)?.id || (user as any)?._id;
            await fetch(`${API_BASE}/api/notifications?userId=${userId}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            setNotifications([]);
        } catch (error) {
            console.error(error);
        }
    };

    const getIcon = (type: string) => {
        switch (type) {
            case 'warning': return <AlertTriangle className="w-5 h-5 text-amber-600" />;
            case 'error': return <XCircle className="w-5 h-5 text-red-600" />;
            case 'success': return <CheckCircle className="w-5 h-5 text-emerald-600" />;
            default: return <Info className="w-5 h-5 text-[#D97706]" />;
        }
    };

    // Filter Logic
    const filteredNotifications = notifications.filter(n => {
        if (filter === 'unread') return !n.isRead;
        return true;
    });

    // Group by Date
    const groupedNotifications = filteredNotifications.reduce((groups, notif) => {
        const date = new Date(notif.createdAt);
        let key = 'Earlier';
        if (isToday(date)) key = 'Today';
        else if (isYesterday(date)) key = 'Yesterday';

        if (!groups[key]) groups[key] = [];
        groups[key].push(notif);
        return groups;
    }, {} as Record<string, Notification[]>);

    const groupOrder = ['Today', 'Yesterday', 'Earlier'];

    return (
        <div className="min-h-screen bg-[#FAFAF7] flex flex-col font-sans">
            <Header />

            <main className="container mx-auto px-4 md:px-6 py-12 max-w-5xl flex-grow">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-[#111827] flex items-center gap-3">
                            <span className="bg-gradient-to-br from-[#D97706] to-[#F59E0B] p-2.5 rounded-xl shadow-md text-white">
                                <Bell className="w-6 h-6" />
                            </span>
                            Notifications
                        </h1>
                        <p className="text-gray-500 mt-2 ml-1 text-sm">
                            Manage your alerts and order updates
                        </p>
                    </div>

                    <div className="flex items-center gap-3 bg-white p-1.5 rounded-xl shadow-sm border border-gray-100 w-fit">
                        <button
                            onClick={() => setFilter('all')}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${filter === 'all' ? 'bg-[#D97706] text-white shadow-sm' : 'text-gray-600 hover:bg-gray-50'}`}
                        >
                            All
                        </button>
                        <button
                            onClick={() => setFilter('unread')}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${filter === 'unread' ? 'bg-[#D97706] text-white shadow-sm' : 'text-gray-600 hover:bg-gray-50'}`}
                        >
                            Unread
                        </button>
                    </div>
                </div>

                {/* Content Area */}
                <div className="bg-white rounded-3xl border border-gray-100 shadow-[0_2px_20px_rgba(0,0,0,0.02)] min-h-[500px] p-6 md:p-8 relative">

                    {/* Clear All Button - Top Right Absolute */}
                    {notifications.length > 0 && (
                        <div className="absolute top-6 right-6 z-10">
                            <button
                                onClick={clearAll}
                                className="group flex items-center gap-2 text-xs font-semibold text-gray-400 hover:text-red-600 transition-colors px-3 py-1.5 rounded-full hover:bg-red-50"
                            >
                                <Trash2 className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
                                Clear History
                            </button>
                        </div>
                    )}

                    {loading ? (
                        <div className="space-y-8 animate-pulse">
                            {[1, 2].map(i => (
                                <div key={i}>
                                    <div className="h-4 w-24 bg-gray-100 rounded mb-4" />
                                    <div className="space-y-3">
                                        <div className="h-24 bg-gray-50 rounded-2xl" />
                                        <div className="h-24 bg-gray-50 rounded-2xl" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : filteredNotifications.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center py-20">
                            <div className="w-24 h-24 bg-[#FAFAF7] rounded-full flex items-center justify-center mb-6">
                                <div className="w-16 h-16 bg-[#D97706]/10 rounded-full flex items-center justify-center animate-pulse">
                                    <Bell className="w-8 h-8 text-[#D97706]" />
                                </div>
                            </div>
                            <h3 className="text-xl font-bold text-[#111827]">All caught up!</h3>
                            <p className="text-gray-400 mt-2 max-w-xs text-center">
                                {filter === 'unread' ? "You have no unread notifications." : "You have no notifications at the moment."}
                            </p>
                            {filter === 'unread' && (
                                <button
                                    onClick={() => setFilter('all')}
                                    className="mt-6 text-[#D97706] font-medium hover:underline text-sm"
                                >
                                    View all notifications
                                </button>
                            )}
                        </div>
                    ) : (
                        <div className="space-y-10">
                            {groupOrder.map(group => {
                                const groupItems = groupedNotifications[group];
                                if (!groupItems || groupItems.length === 0) return null;

                                return (
                                    <div key={group}>
                                        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                                            <Calendar className="w-3.5 h-3.5" />
                                            {group}
                                        </h3>
                                        <div className="space-y-3">
                                            <AnimatePresence>
                                                {groupItems.map((notif) => (
                                                    <motion.div
                                                        key={notif._id}
                                                        initial={{ opacity: 0, x: -10 }}
                                                        animate={{ opacity: 1, x: 0 }}
                                                        exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                                                        layout
                                                        className={`group relative overflow-hidden rounded-2xl border transition-all duration-300 ${notif.isRead
                                                            ? 'bg-white border-gray-100 hover:border-gray-200'
                                                            : 'bg-[#FFFCF5] border-[#D97706]/20 shadow-sm'
                                                            }`}
                                                    >
                                                        {/* Unread Indicator Bar */}
                                                        {!notif.isRead && (
                                                            <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#D97706]" />
                                                        )}

                                                        <div className="p-5 flex gap-5">
                                                            {/* Icon Box */}
                                                            <div className={`flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center ${notif.isRead ? 'bg-gray-50' : 'bg-white shadow-sm border border-[#D97706]/10'
                                                                }`}>
                                                                {getIcon(notif.type)}
                                                            </div>

                                                            <div className="flex-1 min-w-0">
                                                                <div className="flex justify-between items-start mb-1">
                                                                    <h3 className={`font-semibold text-base pr-8 ${notif.isRead ? 'text-gray-700' : 'text-[#111827]'}`}>
                                                                        {notif.title}
                                                                    </h3>
                                                                    <span className="text-[11px] text-gray-400 font-medium whitespace-nowrap bg-gray-50 px-2 py-1 rounded-full">
                                                                        {format(new Date(notif.createdAt), 'h:mm a')}
                                                                    </span>
                                                                </div>

                                                                <p className={`text-sm leading-relaxed ${notif.isRead ? 'text-gray-500' : 'text-gray-700'}`}>
                                                                    {notif.message}
                                                                </p>

                                                                {/* Action Link Example - Subscription */}
                                                                {notif.metadata?.subscriptionId && (
                                                                    <div className="mt-3">
                                                                        <Link
                                                                            href="/profile?tab=subscriptions"
                                                                            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#D97706] hover:text-[#B45309] bg-[#D97706]/5 hover:bg-[#D97706]/10 px-3 py-1.5 rounded-lg transition-colors"
                                                                        >
                                                                            View Subscription <ArrowRight className="w-3 h-3" />
                                                                        </Link>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>

                                                        {/* Hover Actions */}
                                                        <div className="absolute top-4 right-4 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity bg-white/80 backdrop-blur-sm p-1 rounded-lg shadow-sm border border-gray-100">
                                                            {!notif.isRead && (
                                                                <button
                                                                    onClick={() => markAsRead(notif._id)}
                                                                    className="p-1.5 text-gray-400 hover:text-[#D97706] rounded-md hover:bg-[#D97706]/5 transition-colors"
                                                                    title="Mark as read"
                                                                >
                                                                    <Check className="w-4 h-4" />
                                                                </button>
                                                            )}
                                                            <button
                                                                onClick={() => deleteNotification(notif._id)}
                                                                className="p-1.5 text-gray-400 hover:text-red-500 rounded-md hover:bg-red-50 transition-colors"
                                                                title="Delete"
                                                            >
                                                                <Trash2 className="w-4 h-4" />
                                                            </button>
                                                        </div>
                                                    </motion.div>
                                                ))}
                                            </AnimatePresence>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </main>
            <Footer />
        </div>
    );
}

function ArrowRight({ className }: { className?: string }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
            <path d="M5 12h14" />
            <path d="m12 5 7 7-7 7" />
        </svg>
    );
}
