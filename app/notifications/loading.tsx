import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function Loading() {
    return (
        <div className="min-h-screen bg-[#FAFAF7] flex flex-col font-sans">
            <Header />
            <main className="container mx-auto px-4 md:px-6 py-12 max-w-5xl flex-grow">
                {/* Header Skeleton */}
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
                    <div className="h-10 w-48 bg-gray-200 rounded animate-pulse" />
                    <div className="h-10 w-32 bg-gray-200 rounded animate-pulse" />
                </div>

                {/* Content Skeleton */}
                <div className="bg-white rounded-3xl border border-gray-100 shadow-[0_2px_20px_rgba(0,0,0,0.02)] min-h-[500px] p-6 md:p-8 relative">
                    <div className="space-y-8">
                        {[1, 2, 3].map(i => (
                            <div key={i}>
                                <div className="h-4 w-24 bg-gray-100 rounded mb-4 animate-pulse" />
                                <div className="space-y-3">
                                    <div className="h-24 bg-gray-50 rounded-2xl animate-pulse" />
                                    <div className="h-24 bg-gray-50 rounded-2xl animate-pulse" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
