"use client";

import { Search, Heart, ShoppingCart, User, Linkedin, Instagram, Facebook, Phone, Mail, X, Bell } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import CartButton from '@/components/cart/CartButton';
import LoginModal from '@/components/auth/LoginModal';
import { useAuth } from '@/lib/context/AuthContext';
import Fuse from 'fuse.js';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

export default function Header() {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [wishlistCount, setWishlistCount] = useState(0);
  const [wishlistLoading, setWishlistLoading] = useState(false);
  const { user, logout, isAuthenticated, isLoading } = useAuth();
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  // Search State
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  // Ensure component is mounted to avoid hydration issues
  useEffect(() => {
    setMounted(true);
  }, []);

  // Fetch wishlist count when user is authenticated
  const [notificationCount, setNotificationCount] = useState(0);

  const fetchNotificationCount = async () => {
    if (!user?.id) return;
    try {
      const token = localStorage.getItem("unifoods_token");
      const res = await fetch(`${API_BASE}/api/notifications?userId=${user.id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        // Count unread
        const unread = data.data.filter((n: any) => !n.isRead).length;
        setNotificationCount(unread);
      }
    } catch (error) {
      console.error("Failed to fetch notifications", error);
    }
  };

  // Fetch wishlist and notifications when auth updates
  useEffect(() => {
    if (mounted && isAuthenticated && user?.id) {
      fetchWishlistCount();
      fetchNotificationCount();
    } else {
      setWishlistCount(0);
      setNotificationCount(0);
    }
  }, [mounted, isAuthenticated, user?.id]);

  // Listen for realtime wishlist updates
  useEffect(() => {
    const handleWishlistUpdate = () => {
      if (user?.id) fetchWishlistCount();
    };

    window.addEventListener('wishlist-updated', handleWishlistUpdate);
    return () => window.removeEventListener('wishlist-updated', handleWishlistUpdate);
  }, [user?.id]);

  const performSearch = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    try {
      const url = `${API_BASE || 'https://horeca-backend-six.vercel.app'}/api/products?q=${encodeURIComponent(query)}&limit=5`;
      const res = await fetch(url);
      const data = await res.json();

      if (data.success && Array.isArray(data.data?.items)) {
        setSearchResults(data.data.items);
      } else {
        setSearchResults([]);
      }
    } catch (error) {
      console.error("Search failed:", error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    debounceRef.current = setTimeout(() => {
      performSearch(query);
    }, 300); // 300ms debounce
  };

  const fetchWishlistCount = async () => {
    if (!user?.id) return;

    setWishlistLoading(true);
    try {
      const token = localStorage.getItem("unifoods_token");
      if (!token) return;

      const url = `${API_BASE}/api/wishlist?userId=${user.id}`;

      const response = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });

      const data = await response.json();

      let count = 0;

      if (data?.data?.items) {
        count = data.data.items.length;
      } else if (data?.items) {
        count = data.items.length;
      }

      setWishlistCount(count);
    } catch (err) {
      console.error("🔥 Failed to fetch wishlist count:", err);
    } finally {
      setWishlistLoading(false);
    }
  };


  const formatPhoneNumber = (phone: string | undefined) => {
    if (!phone || typeof phone !== 'string' || phone.length < 10) {
      return '';
    }
    return `+91 ${phone.slice(0, 3)}***${phone.slice(6)}`;
  };

  const handleLogout = () => {
    logout();
    setWishlistCount(0);
  };

  const handleLoginClick = () => {
    setIsLoginModalOpen(true);
  };

  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen);
    if (!isSearchOpen) {
      setSearchQuery('');
      setSearchResults([]);
    }
  };

  // Don't render user-specific content during SSR
  if (!mounted) {
    return (
      <header className="w-full bg-white">
        <div className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-20">
              <Link href="/" className="flex items-center gap-2 group">
                <Image
                  src="/images/logo.png"
                  alt="Unifoods"
                  width={180}
                  height={60}
                  className="h-12 w-auto object-contain"
                  priority
                />
              </Link>
              <div className="flex items-center gap-5">
                <div className="w-5 h-5 bg-gray-200 rounded"></div>
                <div className="w-5 h-5 bg-gray-200 rounded"></div>
                <div className="w-5 h-5 bg-gray-200 rounded"></div>
                <div className="w-20 h-10 bg-gray-200 rounded-full"></div>
              </div>
            </div>
          </div>
        </div>
      </header>
    );
  }

  return (
    <>
      <>
        {/* Top Utility Bar */}
        <div className="bg-[#F0F4E8] border-b border-[#D4DFBD]">
          {/* ... existing utility bar content ... */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-2 text-xs">
              <div className="flex items-center gap-3">
                <span className="text-gray-600">Follow us</span>
                <div className="flex gap-2">
                  <Link href="#" className="text-gray-600 hover:text-[#D97706] transition-colors">
                    <Linkedin size={14} />
                  </Link>
                  <Link href="#" className="text-gray-600 hover:text-[#D97706] transition-colors">
                    <Instagram size={14} />
                  </Link>
                  <Link href="#" className="text-gray-600 hover:text-[#D97706] transition-colors">
                    <Facebook size={14} />
                  </Link>
                </div>
              </div>

              <div className="hidden md:block text-center">
                <span className="text-[#D97706] font-medium">
                  Get 10% off your first wholesale order • Use code UNIFOODS10 at checkout!
                </span>
              </div>

              <div className="flex items-center gap-4 text-xs">
                <a href="tel:+919324856780" className="flex items-center gap-1 text-gray-600 hover:text-[#D97706] transition-colors">
                  <Phone size={12} />
                  <span className="hidden sm:inline">+91 93248 56780</span>
                </a>
                <a href="mailto:sales@unifoods.in" className="flex items-center gap-1 text-gray-600 hover:text-[#D97706] transition-colors">
                  <Mail size={12} />
                  <span className="hidden sm:inline">sales@unifoods.in</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Main Navigation Bar */}
        <div className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm shadow-sm w-full">
          {/* ... existing navbar content ... */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-20">
              {/* Logo */}
              <Link href="/" className="flex items-center gap-2 group">
                <Image
                  src="/images/logo.png"
                  alt="Unifoods"
                  width={180}
                  height={60}
                  className="h-14 w-auto object-contain transition-transform group-hover:scale-105"
                  priority
                />
              </Link>

              {/* Navigation Menu */}
              <nav className={`hidden md:flex items-center gap-10 ${isSearchOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'} transition-opacity duration-200`}>
                <Link href="/" className="text-sm font-medium text-[#111827] hover:text-[#D97706] transition-colors relative group">
                  Home
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#D97706] group-hover:w-full transition-all"></span>
                </Link>
                <Link href="/products" className="text-sm font-medium text-[#111827] hover:text-[#D97706] transition-colors relative group">
                  Shop
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#D97706] group-hover:w-full transition-all"></span>
                </Link>
                <Link href="/categories" className="text-sm font-medium text-[#111827] hover:text-[#D97706] transition-colors relative group">
                  Categories
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#D97706] group-hover:w-full transition-all"></span>
                </Link>
                <Link href="/about" className="text-sm font-medium text-[#111827] hover:text-[#D97706] transition-colors relative group">
                  About Us
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#D97706] group-hover:w-full transition-all"></span>
                </Link>
                <Link href="/contact" className="text-sm font-medium text-[#111827] hover:text-[#D97706] transition-colors relative group">
                  Contact
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#D97706] group-hover:w-full transition-all"></span>
                </Link>
              </nav>

              {/* Right Icons */}
              <div className="flex items-center gap-5">

                {/* Search Container */}
                <div ref={searchContainerRef} className={`absolute right-4 left-4 md:left-auto md:relative flex items-center justify-end transition-all duration-300 ${isSearchOpen ? 'md:w-[400px] w-[calc(100%-32px)]' : 'w-auto'}`}>
                  {isSearchOpen ? (
                    <div className="relative w-full">
                      <input
                        ref={searchInputRef}
                        type="text"
                        value={searchQuery}
                        onChange={handleSearch}
                        placeholder="Search products..." // e.g., 'cherri' finds 'Cherry'
                        className="w-full pl-4 pr-10 py-2 rounded-full border border-gray-300 focus:outline-none focus:border-[#D97706] focus:ring-1 focus:ring-[#D97706] bg-white text-gray-900"
                      />
                      <button
                        onClick={toggleSearch}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-red-500"
                      >
                        <X size={18} />
                      </button>

                      {/* Dropdown Results */}
                      {searchQuery && (
                        <div className="absolute top-full mt-2 w-full bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-50">
                          {searchResults.length > 0 ? (
                            <ul>
                              {searchResults.map((product) => (
                                <li key={product._id || product.id}>
                                  <Link
                                    href={`/products/${product._id || product.id}`}
                                    className="flex items-center gap-3 p-3 hover:bg-gray-50 transition-colors"
                                    onClick={() => setIsSearchOpen(false)}
                                  >
                                    {product.image && (
                                      <div className="w-10 h-10 relative rounded overflow-hidden bg-gray-100 flex-shrink-0">
                                        <img
                                          src={typeof product.image === 'string' ? product.image : (product.images?.[0]?.url || '/placeholder.png')}
                                          alt={product.name}
                                          className="object-cover w-full h-full"
                                        />
                                      </div>
                                    )}
                                    <div>
                                      <p className="text-sm font-medium text-gray-900 line-clamp-1">{product.name}</p>
                                      <p className="text-xs text-gray-500">{product.category?.name || 'Product'}</p>
                                    </div>
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          ) : (
                            <div className="p-4 text-center text-gray-500 text-sm">
                              No matches found
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ) : (
                    <button
                      onClick={toggleSearch}
                      className="text-gray-600 hover:text-[#D97706] transition-colors p-1"
                    >
                      <Search size={20} />
                    </button>
                  )}
                </div>

                {/* Hide other icons when search is open on mobile */}
                <div className={`flex items-center gap-5 transition-opacity duration-200 ${isSearchOpen ? 'hidden md:flex opacity-50' : 'flex'}`}>
                  {/* Wishlist Button */}
                  {isAuthenticated ? (
                    <Link href="/wishlist">
                      <button className="relative p-2 hover:bg-gray-100 rounded-full transition-colors">
                        <Heart size={20} />
                        {wishlistLoading ? (
                          <span className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center">
                            <div className="w-4 h-4 border-2 border-gray-300 border-t-transparent rounded-full animate-spin"></div>
                          </span>
                        ) : wishlistCount > 0 ? (
                          <span className="absolute -top-1 -right-1 bg-[#D97706] text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                            {wishlistCount > 9 ? '9+' : wishlistCount}
                          </span>
                        ) : null}
                      </button>
                    </Link>
                  ) : (
                    <button
                      onClick={handleLoginClick}
                      className="relative p-2 hover:bg-gray-100 rounded-full transition-colors"
                      title="Login to view wishlist"
                    >
                      <Heart size={20} />
                    </button>
                  )}

                  {/* Cart Button */}
                  <CartButton />

                  {/* Notification Button */}
                  {isAuthenticated && (
                    <Link href="/notifications">
                      <button className="relative p-2 hover:bg-gray-100 rounded-full transition-colors">
                        <Bell size={20} />
                        {notificationCount > 0 && (
                          <span className="absolute -top-1 -right-1 bg-amber-600 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                            {notificationCount > 9 ? '9+' : notificationCount}
                          </span>
                        )}
                      </button>
                    </Link>
                  )}

                  {/* User Authentication Section - Only in Desktop if search hidden */}
                  <div className="hidden lg:block">
                    {isAuthenticated ? (
                      <div className="flex items-center gap-3">
                        {/* User Info */}
                        <div className="flex items-center gap-2">
                          <Link href="/profile">
                            <div className="w-8 h-8 bg-[#D97706]/10 rounded-full flex items-center justify-center">
                              <User size={16} className="text-[#D97706]" />
                            </div>
                          </Link>
                        </div>

                        {/* Logout Button */}
                        <button
                          onClick={handleLogout}
                          className="text-gray-600 hover:text-[#D97706] transition-colors p-2 rounded-full hover:bg-gray-100"
                          title="Logout"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                            <polyline points="16 17 21 12 16 7" />
                            <line x1="21" y1="12" x2="9" y2="12" />
                          </svg>
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={handleLoginClick}
                        className="flex items-center gap-2 bg-[#D97706] text-white px-6 py-2.5 rounded-full hover:bg-[#B45309] transition-all shadow-md hover:shadow-lg text-sm font-medium"
                      >
                        <User size={18} />
                        Login / Register
                      </button>
                    )}
                  </div>
                  <button
                    onClick={handleLoginClick}
                    className="lg:hidden text-gray-600 hover:text-[#D97706] transition-colors"
                  >
                    <User size={20} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Login Modal */}
        <LoginModal
          isOpen={isLoginModalOpen}
          onClose={() => {
            setIsLoginModalOpen(false);
          }}
        />
      </>
    </>
  );
}
