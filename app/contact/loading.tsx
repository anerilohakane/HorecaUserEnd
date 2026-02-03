import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function Loading() {
    return (
        <>
            <Header />
            <div className="min-h-screen bg-[#FAFAF7]">
                {/* HERO SKELETON */}
                <div className="bg-white border-b border-gray-100">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
                        <div className="h-12 w-64 bg-gray-200 rounded mx-auto mb-4 animate-pulse" />
                        <div className="h-6 w-96 bg-gray-100 rounded mx-auto animate-pulse" />
                    </div>
                </div>

                {/* CONTENT SKELETON */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                    <div className="grid lg:grid-cols-2 gap-12">
                        {/* LEFT SKELETON */}
                        <div className="space-y-8">
                            <div className="h-8 w-48 bg-gray-200 rounded animate-pulse" />
                            <div className="h-20 w-full bg-gray-100 rounded animate-pulse" />
                            <div className="space-y-6">
                                {[1, 2, 3].map(i => (
                                    <div key={i} className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-gray-100 rounded-xl animate-pulse" />
                                        <div className="space-y-2">
                                            <div className="h-4 w-16 bg-gray-100 rounded animate-pulse" />
                                            <div className="h-4 w-32 bg-gray-200 rounded animate-pulse" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* RIGHT SKELETON */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 h-[500px] animate-pulse" />
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
}
