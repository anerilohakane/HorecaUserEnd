import SkeletonCard from '@/components/products/SkeletonCard';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function Loading() {
    return (
        <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-grow bg-gray-50 py-8">
                <div className="max-w-[1400px] mx-auto px-2 sm:px-4 py-4">
                    {/* Breadcrumb Skeleton */}
                    <div className="mb-4 h-4 w-32 bg-gray-200 rounded animate-pulse" />

                    {/* Header Skeleton */}
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
                        <div>
                            <div className="h-8 w-48 bg-gray-200 rounded animate-pulse mb-2" />
                            <div className="h-5 w-24 bg-gray-200 rounded animate-pulse" />
                        </div>
                    </div>

                    <div className="grid grid-cols-12 gap-8">
                        {/* Sidebar Skeleton */}
                        <aside className="hidden lg:block lg:col-span-3">
                            <div className="h-64 bg-white rounded-xl shadow-sm animate-pulse p-4 space-y-4">
                                <div className="h-6 w-3/4 bg-gray-200 rounded" />
                                <div className="h-4 w-full bg-gray-200 rounded" />
                                <div className="h-4 w-2/3 bg-gray-200 rounded" />
                            </div>
                        </aside>

                        {/* Grid Skeleton */}
                        <section className="col-span-12 lg:col-span-9">
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                                {Array.from({ length: 8 }).map((_, i) => (
                                    <SkeletonCard key={i} />
                                ))}
                            </div>
                        </section>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
