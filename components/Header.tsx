// components/Header.tsx
'use client';

import { Search, Heart, ShoppingCart, User, Linkedin, Instagram, Facebook, Phone, Mail } from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import CartButton from '@/components/cart/CartButton';
import LoginModal from '@/components/auth/LoginModal';
import { useAuth } from '@/lib/context/AuthContext';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

export default function Header() {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [wishlistCount, setWishlistCount] = useState(0);
  const [wishlistLoading, setWishlistLoading] = useState(false);
  const { user, logout, isAuthenticated, isLoading } = useAuth();
  const [mounted, setMounted] = useState(false);

  console.log('🔷 Header component rendering...', {
    mounted,
    isAuthenticated,
    isLoading,
    user,
    isLoginModalOpen,
  });

  // Ensure component is mounted to avoid hydration issues
  useEffect(() => {
    // console.log('🔷 Header useEffect - setting mounted to true');
    setMounted(true);
  }, []);

  // Fetch wishlist count when user is authenticated
  useEffect(() => {
    if (mounted && isAuthenticated && user?.id) {
      fetchWishlistCount();
    } else {
      setWishlistCount(0);
    }
  }, [mounted, isAuthenticated, user?.id]);

  const fetchWishlistCount = async () => {
    if (!user?.id) return;

    setWishlistLoading(true);
    try {
      const token = localStorage.getItem("unifoods_token");
      if (!token) return;

      const url = `${API_BASE}/api/wishlist?userId=${user.id}`;
      // console.log("🌐 Header FetchWishlistCount URL:", url);

      const response = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });

      const data = await response.json();
      // console.log("📦 Header Wishlist Response JSON:", data);

      let count = 0;

      if (data?.data?.items) {
        count = data.data.items.length;
        // console.log("❤️ Count from data.data.items:", count);
      } else if (data?.items) {
        count = data.items.length;
        // console.log("❤️ Count from data.items:", count);
      } else {
        console.log("⚠️ Could not find wishlist items in response.");
      }

      setWishlistCount(count);
      // console.log("🔷 Wishlist count updated:", count);
    } catch (err) {
      console.error("🔥 Failed to fetch wishlist count:", err);
    } finally {
      setWishlistLoading(false);
    }
  };


  // Format phone number for display
  const formatPhoneNumber = (phone: string | undefined) => {
    // console.log('📞 formatPhoneNumber called with:', phone);

    if (!phone || typeof phone !== 'string' || phone.length < 10) {
      // console.log('❌ Invalid phone for formatting');
      return '';
    }

    const formatted = `+91 ${phone.slice(0, 3)}***${phone.slice(6)}`;
    // console.log('✅ Formatted phone:', formatted);
    return formatted;
  };

  const handleLogout = () => {
    // console.log('🔷 Logout button clicked');
    logout();
    setWishlistCount(0); // Reset wishlist count on logout
  };

  const handleLoginClick = () => {
    // console.log('🔷 Login button clicked, opening modal');
    setIsLoginModalOpen(true);
  };

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.preventDefault();
    // console.log('🔷 Wishlist button clicked');

    if (!isAuthenticated) {
      // console.log('🔷 User not authenticated, opening login modal');
      handleLoginClick();
      return;
    }

    // Navigate to wishlist page
    // console.log('🔷 Navigating to wishlist page');
    window.location.href = '/wishlist';
  };

  // Don't render user-specific content during SSR
  if (!mounted) {
    console.log('🔷 Header SSR mode - rendering skeleton');
    return (
      <header className="w-full bg-white">
        {/* Simplified static header during SSR */}
        <div className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-20">
              {/* Logo */}
              <Link href="/" className="flex items-center gap-2 group">
                <div className="text-3xl">🌾</div>
                <div>
                  <span className="text-3xl font-bold text-[#111827] block leading-none" style={{ fontFamily: 'serif' }}>
                    Unifoods
                  </span>
                  <span className="text-xs text-gray-500 uppercase tracking-wider">B2B Marketplace</span>
                </div>
              </Link>

              {/* Right Icons (skeleton) */}
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

  // console.log('🔷 Header client-side rendering...', {
  //   wishlistCount,
  //   wishlistLoading,
  //   isAuthenticated,
  // });

  return (
    <>
      <header className="w-full bg-white">
        {/* Top Utility Bar */}
        <div className="bg-[#F0F4E8] border-b border-[#D4DFBD]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-2 text-xs">
              {/* Left: Social */}
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

              {/* Center: Banner */}
              <div className="hidden md:block text-center">
                <span className="text-[#D97706] font-medium">
                  Get 10% off your first wholesale order • Use code UNIFOODS10 at checkout!
                </span>
              </div>

              {/* Right: Contact */}
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
        <div className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-20">
              {/* Logo */}
              <Link href="/" className="flex items-center gap-2 group">
                <div className="text-3xl transition-transform group-hover:scale-110">🌾</div>
                <div>
                  <span className="text-3xl font-bold text-[#111827] block leading-none" style={{ fontFamily: 'serif' }}>
                    Unifoods
                  </span>
                  <span className="text-xs text-gray-500 uppercase tracking-wider">B2B Marketplace</span>
                </div>
              </Link>

              {/* Navigation Menu */}
              <nav className="hidden md:flex items-center gap-10">
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
                {/* Search Button */}
                <button className="text-gray-600 hover:text-[#D97706] transition-colors">
                  <Search size={20} />
                </button>

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

                {/* User Authentication Section */}
                {isAuthenticated ? (
                  <div className="flex items-center gap-3">
                    {/* User Info */}
                    <div className="hidden sm:flex items-center gap-2">
                      <Link href="/profile">
                      <div className="w-8 h-8 bg-[#D97706]/10 rounded-full flex items-center justify-center">
                        <User size={16} className="text-[#D97706]" />
                      </div>
                      </Link>
                      {user?.name && (
                        <div className="hidden lg:block">
                          <p className="text-sm font-medium text-gray-900 truncate max-w-[120px]">
                            {user.name}
                          </p>
                          {user?.phone && (
                            <p className="text-xs text-gray-500">
                              {formatPhoneNumber(user.phone)}
                            </p>
                          )}
                        </div>
                      )}
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
                  <>
                    {/* Desktop Login Button */}
                    <button
                      onClick={handleLoginClick}
                      className="hidden lg:flex items-center gap-2 bg-[#D97706] text-white px-6 py-2.5 rounded-full hover:bg-[#B45309] transition-all shadow-md hover:shadow-lg text-sm font-medium"
                    >
                      <User size={18} />
                      Login / Register
                    </button>

                    {/* Mobile Login Icon */}
                    <button
                      onClick={handleLoginClick}
                      className="lg:hidden text-gray-600 hover:text-[#D97706] transition-colors"
                      title="Login"
                    >
                      <User size={20} />
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Login Modal */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => {
          console.log('🔷 LoginModal closed');
          setIsLoginModalOpen(false);
        }}
      />
    </>
  );
}