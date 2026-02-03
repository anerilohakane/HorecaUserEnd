'use client';
import { Search, ArrowRight, MapPin, Loader2 } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function Hero() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [locationName, setLocationName] = useState('Mumbai');
  const [isLocating, setIsLocating] = useState(false);

  const handleSearch = () => {
    if (!searchQuery.trim()) return;
    router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
  };

  const handleLocationClick = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }

    setIsLocating(true);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          // Using OpenStreetMap Nominatim for free reverse geocoding
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
          );
          const data = await response.json();

          if (data && data.address) {
            // Prefer city, then town, then village, then county
            const city = data.address.city || data.address.town || data.address.village || data.address.county || "Current Location";
            setLocationName(city);
          } else {
            setLocationName("Current Location");
          }
        } catch (error) {
          console.error("Error fetching location name:", error);
          setLocationName("Current Location");
        } finally {
          setIsLocating(false);
        }
      },
      (error) => {
        console.error("Error getting location:", error);
        alert("Unable to retrieve your location");
        setIsLocating(false);
      }
    );
  };

  return (
    <section className="relative bg-[#FAFAF7] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-10 lg:pt-16 lg:pb-12">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <div className="space-y-10 text-center lg:text-left order-2 lg:order-1 relative z-10">
            <div className="space-y-4">
              <h1 className="text-5xl lg:text-7xl font-extrabold text-[#111827] leading-tight tracking-tight">
                Quality Supplies <br />
                <span className="text-[#D97706]">Best Prices.</span>
              </h1>
              <p className="text-lg text-gray-500 max-w-lg mx-auto lg:mx-0 font-medium leading-relaxed">
                One-stop solution for all your Unifood needs.
                <span className="hidden lg:inline"> Fresh ingredients, packaging, and equipment delivered to your doorstep.</span>
              </p>
            </div>

            {/* Search Bar Container */}
            <div className="bg-white p-2 rounded-full shadow-xl border border-gray-100 flex items-center max-w-xl mx-auto lg:mx-0 transform transition-all hover:scale-[1.01]">

              {/* Location Mockup */}
              <button
                onClick={handleLocationClick}
                disabled={isLocating}
                className="hidden sm:flex items-center gap-2 pl-6 pr-4 border-r border-gray-100 text-sm font-medium text-gray-600 hover:text-[#D97706] transition-colors cursor-pointer"
                title="Detect my location"
              >
                {isLocating ? (
                  <Loader2 size={18} className="text-[#D97706] animate-spin" />
                ) : (
                  <MapPin size={18} className="text-[#D97706]" />
                )}
                <span className="truncate max-w-[100px]">{locationName}</span>
              </button>

              <div className="pl-4 text-gray-400">
                <Search size={20} />
              </div>
              <input
                type="text"
                value={searchQuery || ''}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                placeholder="Search for sugar, flour, butter..."
                className="flex-1 w-full p-4 outline-none text-gray-700 placeholder-gray-400 bg-transparent text-lg"
              />
              <button
                onClick={handleSearch}
                className="bg-[#D97706] text-white px-8 py-3 rounded-full font-bold hover:bg-[#B45309] transition-colors"
              >
                Search
              </button>
            </div>
          </div>

          {/* Right Images */}
          <div className="relative order-1 lg:order-2">
            {/* Main Hero Composite */}
            <div className="relative z-10">
              <div className="relative h-[28rem] w-full">
                {/* We can use a single composed image or a nice grid. 
                      For Hyperpure style, let's keep it clean. 
                      Maybe a single high-quality collage or the existing grid if it looks neat. 
                      Let's stick to the existing grid but simplified props. */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-4 pt-8">
                    <div className="relative h-48 bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100">
                      <Image src="/images/hero/hero-left.jpg" alt="Fresh" fill className="object-cover" />
                    </div>
                    <div className="relative h-32 bg-[#FFF3E0] rounded-2xl overflow-hidden shadow-sm flex items-center justify-center">
                      <Image src="/images/products/flour.jpg" alt="Flour" fill className="object-contain p-4" />
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="relative h-32 bg-[#E8F5E9] rounded-2xl overflow-hidden shadow-sm flex items-center justify-center">
                      <Image src="/images/products/chocolate.jpg" alt="Chocolate" fill className="object-contain p-4" />
                    </div>
                    <div className="relative h-48 bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100">
                      <Image src="/images/hero/hero-right.jpg" alt="Quality" fill className="object-cover" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Subtle Decor */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-orange-100/50 rounded-full blur-3xl -z-10"></div>
          </div>
        </div>
      </div>
    </section>
  );
}