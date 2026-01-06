import { howItWorksSteps } from '@/lib/data';
import Link from 'next/link';

export default function HowItWorks() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-light text-[#111827] mb-4">
            How It Works
          </h2>
          <p className="text-base text-gray-600 max-w-2xl mx-auto">
            Simple steps to order, source, and grow your bakery business
          </p>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6">
          {howItWorksSteps.map((step, index) => (
            <div
              key={step.step}
              className="relative group"
            >
              {/* Card */}
              <div className="bg-[#FAFAF7] rounded-2xl p-8 soft-shadow hover:elegant-shadow transition-all h-full">
                {/* Step Number Circle */}
                <div className="mb-6 flex justify-center">
                  <div className="w-12 h-12 bg-[#D97706] text-white rounded-full flex items-center justify-center font-semibold text-lg">
                    {step.step}
                  </div>
                </div>

                {/* Icon */}
                <div className="text-5xl mb-6 text-center group-hover:scale-110 transition-transform duration-300">
                  {step.icon}
                </div>

                {/* Title */}
                <h3 className="font-medium text-[#111827] mb-3 text-center leading-snug text-base">
                  {step.title}
                </h3>

                {/* Description */}
                <p className="text-sm text-gray-600 text-center leading-relaxed">
                  {step.description}
                </p>
              </div>

              {/* Connector Arrow (hidden on last item and mobile) */}
              {index < howItWorksSteps.length - 1 && (
                <div className="hidden lg:flex absolute top-1/2 -right-3 transform -translate-y-1/2 z-10">
                  <svg
                    className="w-6 h-6 text-[#D97706]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Bottom CTA (Optional) */}


        <div className="text-center mt-16">
          <p className="text-gray-600 mb-8">Ready to get started?</p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            {/* Primary Button – Start Ordering */}
            <Link
              href="/products"
              className="inline-flex items-center justify-center bg-[#D97706] text-white px-8 py-3 rounded-full hover:bg-[#e09a3e] transition-all shadow-md hover:shadow-lg font-medium text-sm w-full sm:w-auto"
            >
              Start Ordering Now
            </Link>

            {/* Secondary Button – Register */}
            <Link
              href="/become-supplier"
              className="inline-flex items-center justify-center bg-white text-[#D97706] border-2 border-[#D97706] px-8 py-3 rounded-full hover:bg-[#D97706] hover:text-white transition-all shadow-md hover:shadow-lg font-medium text-sm w-full sm:w-auto"
            >
              Become a Supplier
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}