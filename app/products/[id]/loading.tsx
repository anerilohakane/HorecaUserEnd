import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SkeletonCard from '@/components/products/SkeletonCard';

export default function Loading() {
    return (
        <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-grow bg-[#FAFAF7]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

                    {/* Breadcrumb */}
                    <div className="mb-6 h-4 w-32 bg-gray-200 rounded animate-pulse" />

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
                        {/* Left Column: Image Gallery */}
                        <div className="space-y-4 animate-pulse">
                            <div className="aspect-square bg-white rounded-2xl shadow-sm border border-gray-100" />
                            <div className="grid grid-cols-4 gap-4">
                                {[1, 2, 3, 4].map(i => (
                                    <div key={i} className="aspect-square bg-white rounded-lg border border-gray-100" />
                                ))}
                            </div>
                        </div>

                        {/* Right Column: Product Details */}
                        <div className="space-y-6 animate-pulse">
                            <div>
                                <div className="h-4 w-24 bg-orange-100 rounded-full mb-3" />
                                <div className="h-10 w-3/4 bg-gray-200 rounded mb-2" />
                                <div className="h-6 w-1/4 bg-gray-200 rounded" />
                            </div>

                            <div className="h-px bg-gray-200" />

                            <div className="h-12 w-1/3 bg-gray-200 rounded" />

                            <div className="space-y-4 pt-4">
                                <div className="h-4 w-full bg-gray-100 rounded" />
                                <div className="h-4 w-full bg-gray-100 rounded" />
                                <div className="h-4 w-2/3 bg-gray-100 rounded" />
                            </div>

                            <div className="flex gap-4 pt-6">
                                <div className="h-12 w-32 bg-gray-200 rounded-full" />
                                <div className="h-12 flex-1 bg-gray-300 rounded-full" />
                            </div>

                            <div className="grid grid-cols-2 gap-4 mt-8">
                                {[1, 2, 3, 4].map(i => (
                                    <div key={i} className="h-16 bg-white border border-gray-100 rounded-xl" />
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Related Products */}
                    <div className="mt-16 space-y-6">
                        <div className="h-8 w-48 bg-gray-200 rounded animate-pulse" />
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                            {Array.from({ length: 4 }).map((_, i) => (
                                <SkeletonCard key={i} />
                            ))}
                        </div>
                    </div>

                </div>
            </main>
            <Footer />
        </div>
    );
}
