import { ArrowRight } from 'lucide-react';
import Image from 'next/image';

export default function Hero() {
  return (
    <section className="relative bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <div className="space-y-8 text-center lg:text-left order-2 lg:order-1">
            <div className="space-y-6">
              <h1 className="text-5xl lg:text-7xl font-light text-[#111827] leading-tight tracking-tight">
                Baking for
                <br />
                <span className="font-normal italic">Everyone</span>
              </h1>
              <p className="text-base lg:text-lg text-gray-600 leading-relaxed max-w-lg mx-auto lg:mx-0">
                A good place to find bakery supplies, packaging, quality ingredients, 
                tools and all that good stuff.
              </p>
            </div>

            {/* CTA Button */}
            <div className="flex justify-center lg:justify-start">
              <button className="bg-[#D97706] text-white px-10 py-4 rounded-full hover:bg-[#db8c32] transition-all shadow-lg hover:shadow-xl font-medium text-base inline-flex items-center gap-2 group">
                Shop Now
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>

          {/* Right Images */}
          <div className="relative order-1 lg:order-2">
            {/* Main Hero Images Grid */}
            <div className="grid grid-cols-2 gap-6">
              {/* Top Left - Decorative Ingredient */}
              <div className="relative h-64 lg:h-80">
                <div className="absolute inset-0 bg-white rounded-3xl overflow-hidden soft-shadow">
                  <Image
                    src="/images/hero/hero-left.jpg"
                    alt="Fresh baking ingredients"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>

              {/* Top Right - Product Display */}
              <div className="relative h-64 lg:h-80 mt-12">
                <div className="absolute inset-0 bg-[#E8F5E9] rounded-3xl overflow-hidden soft-shadow flex items-center justify-center">
                  <Image
                    src="/images/hero/hero-right.jpg"
                    alt="Unifoods quality products"
                    fill
                    className="object-contain p-8"
                  />
                </div>
              </div>

              {/* Bottom Left - Secondary Product */}
              <div className="relative h-48 lg:h-64 -mt-8">
                <div className="absolute inset-0 bg-white rounded-3xl overflow-hidden soft-shadow">
                  <Image
                    src="/images/products/flour.jpg"
                    alt="Premium flour"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>

              {/* Bottom Right - Feature Product */}
              <div className="relative h-48 lg:h-64">
                <div className="absolute inset-0 bg-[#FFF3E0] rounded-3xl overflow-hidden soft-shadow flex items-center justify-center">
                  <Image
                    src="/images/products/chocolate.jpg"
                    alt="Premium chocolate"
                    fill
                    className="object-contain p-6"
                  />
                </div>
              </div>
            </div>

            {/* Decorative Element */}
            <div className="absolute -z-10 -top-10 -right-10 w-64 h-64 bg-[#D97706] rounded-full opacity-5 blur-3xl"></div>
            <div className="absolute -z-10 -bottom-10 -left-10 w-64 h-64 bg-[#D97706] rounded-full opacity-5 blur-3xl"></div>
          </div>
        </div>
      </div>

      {/* Bottom Wave */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#FAFAF7] to-transparent"></div>
    </section>
  );
}