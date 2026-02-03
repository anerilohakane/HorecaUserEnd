import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function Loading() {
    return (
        <>
            <Header />
            <main className="bg-[#FAFAF7] min-h-screen">
                {/* HERO SKELETON */}
                <div className="bg-white border-b border-gray-200 py-16">
                    <div className="max-w-7xl mx-auto px-6 text-center space-y-4">
                        <div className="h-12 w-64 bg-gray-200 rounded mx-auto animate-pulse" />
                        <div className="h-6 w-3/4 max-w-2xl bg-gray-200 rounded mx-auto animate-pulse" />
                    </div>
                </div>

                {/* WHO WE ARE SKELETON */}
                <div className="max-w-7xl mx-auto px-6 py-16">
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <div className="space-y-4">
                            <div className="h-8 w-48 bg-gray-200 rounded animate-pulse" />
                            <div className="h-4 w-full bg-gray-200 rounded animate-pulse" />
                            <div className="h-4 w-full bg-gray-200 rounded animate-pulse" />
                            <div className="h-4 w-3/4 bg-gray-200 rounded animate-pulse" />
                        </div>
                        <div className="h-64 bg-gray-200 rounded-2xl animate-pulse" />
                    </div>
                </div>
            </main>
            <Footer />
        </>
    );
}
