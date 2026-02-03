import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function Loading() {
    return (
        <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-grow bg-[#FAFAF7] py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                    {/* Breadcrumb */}
                    <div className="mb-6 h-4 w-32 bg-gray-200 rounded animate-pulse" />

                    {/* Title */}
                    <div className="mb-8 flex justify-between">
                        <div className="space-y-2">
                            <div className="h-10 w-48 bg-gray-200 rounded animate-pulse" />
                            <div className="h-4 w-32 bg-gray-200 rounded animate-pulse" />
                        </div>
                        <div className="h-8 w-24 bg-gray-200 rounded animate-pulse" />
                    </div>

                    <div className="grid lg:grid-cols-3 gap-8">
                        {/* Cart Items */}
                        <div className="lg:col-span-2 space-y-4">
                            {Array.from({ length: 3 }).map((_, i) => (
                                <div key={i} className="bg-white p-4 rounded-xl flex gap-4 animate-pulse">
                                    <div className="w-24 h-24 bg-gray-200 rounded-lg flex-shrink-0" />
                                    <div className="flex-1 space-y-3 py-2">
                                        <div className="h-6 w-3/4 bg-gray-200 rounded" />
                                        <div className="h-4 w-1/2 bg-gray-200 rounded" />
                                        <div className="h-8 w-20 bg-gray-200 rounded mt-2" />
                                    </div>
                                    <div className="w-8 h-8 bg-gray-200 rounded self-center" />
                                </div>
                            ))}
                        </div>

                        {/* Summary */}
                        <div className="lg:block">
                            <div className="bg-white p-6 rounded-2xl shadow-sm space-y-4 animate-pulse">
                                <div className="h-6 w-1/3 bg-gray-200 rounded mb-4" />
                                <div className="space-y-2">
                                    <div className="flex justify-between"><div className="h-4 w-20 bg-gray-200 rounded" /><div className="h-4 w-10 bg-gray-200 rounded" /></div>
                                    <div className="flex justify-between"><div className="h-4 w-20 bg-gray-200 rounded" /><div className="h-4 w-10 bg-gray-200 rounded" /></div>
                                    <div className="flex justify-between"><div className="h-4 w-20 bg-gray-200 rounded" /><div className="h-4 w-10 bg-gray-200 rounded" /></div>
                                </div>
                                <div className="h-px bg-gray-100 my-4" />
                                <div className="flex justify-between items-center">
                                    <div className="h-6 w-24 bg-gray-200 rounded" />
                                    <div className="h-8 w-24 bg-gray-200 rounded" />
                                </div>
                                <div className="h-12 w-full bg-gray-300 rounded-full mt-6" />
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
