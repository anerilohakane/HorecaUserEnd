import { Check } from 'lucide-react';
import Image from 'next/image';

export default function FeatureImage() {
  return (
    <section className="py-20 bg-[#FAFAF7]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left: Image */}
          <div className="relative h-[500px] lg:h-[600px] rounded-3xl overflow-hidden soft-shadow">
            <Image
              src="/images/feature/bakery-scene.jpg"
              alt="Fresh baked goods and quality ingredients"
              fill
              className="object-cover"
            />
          </div>

          {/* Right: Content */}
          <div className="space-y-8">
            <div>
              <h2 className="text-4xl lg:text-5xl font-light text-[#111827] leading-tight mb-4">
                Why better?
              </h2>
              <div className="w-16 h-1 bg-[#D97706]"></div>
            </div>

            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 mt-1">
                  <div className="w-8 h-8 rounded-full bg-[#D97706] flex items-center justify-center">
                    <span className="text-white font-semibold text-sm">01</span>
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-[#111827] mb-2">
                    It&apos;s gentle, and eyes-safe
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    All our suppliers are verified for quality, consistency, and reliability. Your bakery deserves the best.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 mt-1">
                  <div className="w-8 h-8 rounded-full bg-[#D97706] flex items-center justify-center">
                    <span className="text-white font-semibold text-sm">02</span>
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-[#111827] mb-2">
                    It&apos;s gentle, and eyes-safe
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    Transparent pricing with no hidden costs. Get bulk discounts and save more on every order.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 mt-1">
                  <div className="w-8 h-8 rounded-full bg-[#D97706] flex items-center justify-center">
                    <span className="text-white font-semibold text-sm">03</span>
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-[#111827] mb-2">
                    It&apos;s gentle, and eyes-safe
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    Fast delivery across India. Fresh ingredients delivered right to your bakery doorstep.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 mt-1">
                  <div className="w-8 h-8 rounded-full bg-[#D97706] flex items-center justify-center">
                    <span className="text-white font-semibold text-sm">04</span>
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-[#111827] mb-2">
                    It&apos;s gentle, and eyes-safe
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    Quality assurance on every product. We ensure what you order meets professional standards.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}