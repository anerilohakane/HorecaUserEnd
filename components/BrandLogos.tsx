import { brandLogos } from '@/lib/data';

export default function BrandLogos() {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h3 className="text-2xl lg:text-3xl font-light text-[#111827] mb-2">
            Trusted by Top Food Brands
          </h3>
          <p className="text-sm text-gray-600">
            Partnering with industry leaders worldwide
          </p>
        </div>

        {/* Logos Row */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 items-center">
          {brandLogos.map((brand, index) => (
            <div
              key={index}
              className="flex items-center justify-center p-6 rounded-xl soft-shadow hover:elegant-shadow transition-all group bg-white"
            >
              <div className="text-xl font-semibold text-gray-400 group-hover:text-gray-600 transition-colors tracking-wide">
                {brand}
              </div>
            </div>
          ))}
        </div>

        {/* Optional Divider */}
        <div className="mt-12 flex items-center justify-center gap-2">
          <div className="h-px w-16 bg-gray-200"></div>
          <span className="text-xs text-gray-400 uppercase tracking-wider">
            And many more
          </span>
          <div className="h-px w-16 bg-gray-200"></div>
        </div>
      </div>
    </section>
  );
}