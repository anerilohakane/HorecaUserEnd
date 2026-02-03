import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function Loading() {
    return (
        <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-grow bg-[#FAFAF7] py-8">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">

                    {/* Breadcrumb */}
                    <div className="mb-6 h-4 w-40 bg-gray-200 rounded animate-pulse" />

                    {/* Header */}
                    <div className="mb-8 space-y-2">
                        <div className="h-10 w-48 bg-gray-200 rounded animate-pulse" />
                        <div className="h-4 w-64 bg-gray-200 rounded animate-pulse" />
                    </div>

                    {/* Stepper */}
                    <div className="mb-8 bg-white rounded-2xl p-6 shadow-sm animate-pulse">
                        <div className="flex justify-between items-center px-10">
                            <div className="flex flex-col items-center gap-2">
                                <div className="w-12 h-12 rounded-full bg-gray-300" />
                                <div className="h-3 w-16 bg-gray-200 rounded" />
                            </div>
                            <div className="flex-1 h-1 bg-gray-200 mx-4" />
                            <div className="flex flex-col items-center gap-2">
                                <div className="w-12 h-12 rounded-full bg-gray-200" />
                                <div className="h-3 w-16 bg-gray-200 rounded" />
                            </div>
                            <div className="flex-1 h-1 bg-gray-200 mx-4" />
                            <div className="flex flex-col items-center gap-2">
                                <div className="w-12 h-12 rounded-full bg-gray-200" />
                                <div className="h-3 w-16 bg-gray-200 rounded" />
                            </div>
                        </div>
                    </div>

                    {/* Form Area Skeleton */}
                    <div className="bg-white rounded-2xl p-6 shadow-sm space-y-6 animate-pulse">
                        <div className="h-6 w-32 bg-gray-200 rounded mb-6" />
                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="h-12 bg-gray-100 rounded-lg" />
                            <div className="h-12 bg-gray-100 rounded-lg" />
                            <div className="h-12 bg-gray-100 rounded-lg md:col-span-2" />
                            <div className="h-12 bg-gray-100 rounded-lg" />
                            <div className="h-12 bg-gray-100 rounded-lg" />
                        </div>
                        <div className="h-12 w-full bg-gray-200 rounded-lg mt-8" />
                    </div>

                </div>
            </main>
            <Footer />
        </div>
    );
}
