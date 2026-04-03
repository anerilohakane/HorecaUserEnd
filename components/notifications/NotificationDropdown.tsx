'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, Check, Trash2, AlertTriangle, Info, CheckCircle, XCircle, X, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import { format } from 'date-fns';

type Notification = {
    _id: string;
    title: string;
    message: string;
    type: 'info' | 'warning' | 'error' | 'success';
    isRead: boolean;
    createdAt: string;
    metadata?: any;
};

interface NotificationDropdownProps {
    isOpen: boolean;
    onClose: () => void;
    notifications: Notification[];
    onMarkAsRead: (id: string) => void;
    onDelete: (id: string) => void;
    onClearAll: () => void;
}

export default function NotificationDropdown({
    isOpen,
    onClose,
    notifications,
    onMarkAsRead,
    onDelete,
    onClearAll
}: NotificationDropdownProps) {
    const unreadCount = notifications.filter(n => !n.isRead).length;

    const getIcon = (type: string) => {
        switch (type) {
            case 'warning': return <AlertTriangle className="w-4 h-4 text-amber-500" />;
            case 'error': return <XCircle className="w-4 h-4 text-red-500" />;
            case 'success': return <CheckCircle className="w-4 h-4 text-emerald-500" />;
            default: return <Info className="w-4 h-4 text-blue-500" />;
        }
    };

    if (!isOpen) return null;

    return (
        <>
            {/* Backdrop for closing */}
            <div className="fixed inset-0 z-40" onClick={onClose} />
            
            <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                className="absolute right-0 top-full mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-gray-100 z-50 overflow-hidden"
            >
                {/* Header */}
                <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                    <div>
                        <h3 className="font-bold text-gray-900 flex items-center gap-2">
                            Notifications
                            {unreadCount > 0 && (
                                <span className="bg-[#D97706] text-white text-[10px] px-1.5 py-0.5 rounded-full">
                                    {unreadCount} New
                                </span>
                            )}
                        </h3>
                    </div>
                    <div className="flex items-center gap-2">
                        {notifications.length > 0 && (
                             <button 
                                onClick={onClearAll}
                                className="text-[10px] font-bold text-gray-400 hover:text-red-500 uppercase tracking-wider transition-colors"
                             >
                                Clear All
                             </button>
                        )}
                        <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
                            <X size={18} />
                        </button>
                    </div>
                </div>

                {/* List */}
                <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
                    {notifications.length === 0 ? (
                        <div className="py-12 flex flex-col items-center justify-center text-center px-4">
                            <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mb-3">
                                <Bell className="text-gray-300 w-6 h-6" />
                            </div>
                            <p className="text-sm font-medium text-gray-900">All caught up!</p>
                            <p className="text-xs text-gray-500 mt-1">No new notifications at the moment.</p>
                        </div>
                    ) : (
                        <div className="divide-y divide-gray-50">
                            {notifications.slice(0, 10).map((notif) => (
                                <div 
                                    key={notif._id}
                                    className={`p-4 hover:bg-gray-50/80 transition-colors relative group ${!notif.isRead ? 'bg-[#FFFCF5]' : ''}`}
                                >
                                    <div className="flex gap-4">
                                        <div className={`mt-1 flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center ${!notif.isRead ? 'bg-white shadow-sm border border-amber-100' : 'bg-gray-100'}`}>
                                            {getIcon(notif.type)}
                                        </div>
                                        <div className="flex-1 min-w-0 pr-6">
                                            <div className="flex justify-between items-start mb-0.5">
                                                <h4 className={`text-sm font-bold truncate ${!notif.isRead ? 'text-gray-900' : 'text-gray-600'}`}>
                                                    {notif.title}
                                                </h4>
                                                <span className="text-[10px] text-gray-400 font-medium ml-2 shrink-0">
                                                    {format(new Date(notif.createdAt), 'h:mm a')}
                                                </span>
                                            </div>
                                            <p className={`text-xs leading-relaxed line-clamp-2 ${!notif.isRead ? 'text-gray-700' : 'text-gray-500'}`}>
                                                {notif.message}
                                            </p>
                                        </div>
                                    </div>
                                    
                                    {/* Action Buttons Overlay */}
                                    <div className="absolute right-2 top-2 bottom-2 flex flex-col justify-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity translate-x-2 group-hover:translate-x-0 transition-all duration-200">
                                        {!notif.isRead && (
                                            <button 
                                                onClick={() => onMarkAsRead(notif._id)}
                                                className="p-1 bgColor-[#D97706]/10 text-[#D97706] rounded-md hover:bg-[#D97706]/20"
                                                title="Mark as read"
                                            >
                                                <Check size={14} />
                                            </button>
                                        )}
                                        <button 
                                            onClick={() => onDelete(notif._id)}
                                            className="p-1 bg-red-100/50 text-red-500 rounded-md hover:bg-red-100"
                                            title="Delete"
                                        >
                                            <Trash2 size={14} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="p-3 border-t border-gray-100 bg-gray-50/30 text-center">
                    <Link 
                        href="/notifications" 
                        onClick={onClose}
                        className="text-xs font-bold text-[#D97706] hover:text-[#B45309] flex items-center justify-center gap-1.5 transition-colors"
                    >
                        View All Activity <ExternalLink size={12} />
                    </Link>
                </div>
            </motion.div>
        </>
    );
}
