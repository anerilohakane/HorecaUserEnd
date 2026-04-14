import Image from 'next/image';
import Link from 'next/link';

const qualityPoints = [
  {
    icon: '🌾',
    title: 'Farm collection centres',
    description: 'Direct sourcing from verified farms, ensuring freshness from harvest to your kitchen.',
  },
  {
    icon: '🏭',
    title: 'State-of-the-art food park',
    description: 'Modern processing facilities with cold-chain logistics to maintain ingredient integrity.',
  },
  {
    icon: '🔬',
    title: 'Rigorous quality checks',
    description: 'Every product undergoes multi-stage testing before reaching your doorstep.',
  },
  {
    icon: '📦',
    title: 'Tamper-proof packaging',
    description: 'Hygienic, sealed packaging that preserves freshness and prevents contamination.',
  },
];

export default function QualitySection() {
  return (
    <section className="py-16 lg:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ── Section Heading ── */}
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 mb-3">
            <span className="text-[#D97706] text-lg">✦</span>
            <h2 className="text-3xl lg:text-4xl font-semibold text-[#111827] tracking-tight">
              Quality at every step
            </h2>
            <span className="text-[#D97706] text-lg">✦</span>
          </div>
          <div className="flex items-center justify-center gap-3">
            <div className="h-px w-10 bg-gray-300" />
            <p className="text-sm text-gray-500 font-medium uppercase tracking-widest">Built on trust</p>
            <div className="h-px w-10 bg-gray-300" />
          </div>
        </div>

        {/* ── Two Column Layout ── */}
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">

          {/* Left: Quality points list */}
          <div className="space-y-0 divide-y divide-gray-100">
            {qualityPoints.map((point, i) => (
              <div
                key={i}
                className="flex items-start gap-5 py-5 group cursor-default"
              >
                {/* Dot + icon */}
                <div className="flex-shrink-0 flex flex-col items-center pt-1">
                  <div className="w-2 h-2 rounded-full bg-[#D97706] mt-2" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xl">{point.icon}</span>
                    <h3 className="font-semibold text-gray-900 text-base group-hover:text-[#D97706] transition-colors">
                      {point.title}
                    </h3>
                  </div>
                  <p className="text-sm text-gray-500 leading-relaxed">{point.description}</p>
                </div>
              </div>
            ))}

            <div className="pt-6">
              <Link
                href="/about"
                className="inline-flex items-center gap-2 bg-[#D97706] text-white px-7 py-3 rounded-full font-semibold text-sm hover:bg-[#B45309] transition-all shadow-md hover:shadow-lg"
              >
                Learn More About Our Process
              </Link>
            </div>
          </div>

          {/* Right: Image collage */}
          <div className="relative">
            <div className="grid grid-cols-2 gap-3">
              <div className="relative aspect-[3/4] rounded-2xl overflow-hidden shadow-lg">
                <Image
                  src="/images/categories/ingredients.jpg"
                  alt="Quality ingredients"
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>
              <div className="space-y-3 pt-8">
                <div className="relative aspect-square rounded-2xl overflow-hidden shadow-lg">
                  <Image
                    src="/images/categories/dairy-fats.jpg"
                    alt="Fresh dairy"
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </div>
                <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-lg">
                  <Image
                    src="/images/categories/packaging.jpg"
                    alt="Safe packaging"
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </div>
              </div>
            </div>

            {/* Floating badge */}
            <div className="absolute -bottom-4 left-6 bg-white rounded-xl shadow-xl px-5 py-3 flex items-center gap-3 border border-gray-100">
              <div className="w-10 h-10 bg-[#D97706]/10 rounded-full flex items-center justify-center text-xl">✅</div>
              <div>
                <div className="text-sm font-bold text-gray-900">100% Verified</div>
                <div className="text-xs text-gray-500">Suppliers & products</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
