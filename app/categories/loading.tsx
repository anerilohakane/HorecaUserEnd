import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SkeletonCategoryCard from '@/components/categories/SkeletonCategoryCard';

export default function Loading() {
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
            <Header />

            {/* Hero Skeleton */}
            <div className="py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <div className="h-10 w-64 bg-gray-200 rounded mx-auto mb-4 animate-pulse" />
                    <div className="h-4 w-96 bg-gray-200 rounded mx-auto mb-8 animate-pulse" />
                    <div className="h-12 w-[400px] bg-gray-200 rounded-full mx-auto animate-pulse" />
                </div>
            </div>

            <main className="flex-grow py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 md:gap-8">
                        {Array.from({ length: 15 }).map((_, i) => (
                            <SkeletonCategoryCard key={i} />
                        ))}
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
