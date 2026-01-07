import { valueServices } from '@/lib/data';

export default function ValueSection() {
  return (
    <section className="py-20 bg-[#FAFAF7]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-light text-[#111827] mb-4">
            Reinvent Your Bakery Business Today
          </h2>
          <p className="text-base text-gray-600 max-w-2xl mx-auto">
            From ingredients to equipment — we help bakeries scale faster
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {valueServices.map((service, index) => (
            <div
              key={index}
              className="group text-center p-6 rounded-xl bg-white border border-gray-100 hover:border-[#D97706] transition-all cursor-pointer hover:shadow-lg"
            >
              {/* Icon */}
              <div className="text-4xl mb-3 group-hover:scale-110 transition-transform duration-300 text-[#D97706]">
                {service.icon}
              </div>

              {/* Title */}
              <h3 className="font-bold text-gray-900 mb-1 text-sm">
                {service.title}
              </h3>

              {/* Description */}
              <p className="text-xs text-gray-500 leading-relaxed">
                {service.description}
              </p>
            </div>
          ))}
        </div>

        {/* Optional Bottom Section */}
        <div className="mt-16 text-center">
          <div className="inline-flex items-center gap-2 bg-[#ffe5c7] px-6 py-3 rounded-full">
            <svg className="w-5 h-5 text-[#D97706]" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span className="text-sm font-medium text-gray-700">
              Trusted by 1000+ bakeries across India
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}