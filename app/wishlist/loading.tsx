import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SkeletonCard from '@/components/products/SkeletonCard';

export default function Loading() {
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
            <Header />

            {/* Hero Skeleton */}
            <div className="py-12">
                <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-4">
                    <div className="h-10 w-48 bg-gray-200 rounded animate-pulse" />
                </div>
            </div>

            <main className="flex-grow py-8 bg-[#FAFAF7]">
                <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex overflow-hidden gap-4">
                        {Array.from({ length: 4 }).map((_, i) => (
                            <div key={i} className="min-w-[260px]">
                                <SkeletonCard />
                            </div>
                        ))}
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
