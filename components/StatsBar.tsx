export default function StatsBar() {
  const stats = [
    { number: '500+', label: 'cities we\'re active in' },
    { number: '10K+', label: 'partners trust us' },
    { number: '5 Lakh+', label: 'orders delivered' },
    { number: '1000+', label: 'seller brands listed' },
  ];

  return (
    <section className="bg-white border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-gray-100">
          {stats.map((stat, i) => (
            <div key={i} className="py-8 px-6 text-center">
              <div className="text-3xl lg:text-4xl font-extrabold text-[#D97706] mb-1 tracking-tight">
                {stat.number}
              </div>
              <div className="text-sm text-gray-500 leading-tight">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
