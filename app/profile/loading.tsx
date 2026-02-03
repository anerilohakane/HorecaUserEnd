import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function Loading() {
    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            <Header />
            <main className="flex-grow py-8 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                    {/* Profile Header Skeleton */}
                    <div className="bg-white rounded-2xl p-6 mb-8 shadow-sm flex flex-col md:flex-row items-center gap-6 animate-pulse">
                        <div className="w-24 h-24 rounded-full bg-gray-200" />
                        <div className="flex-1 space-y-3 text-center md:text-left w-full">
                            <div className="h-8 w-48 bg-gray-200 rounded mx-auto md:mx-0" />
                            <div className="h-4 w-32 bg-gray-200 rounded mx-auto md:mx-0" />
                            <div className="flex gap-2 justify-center md:justify-start mt-2">
                                <div className="h-6 w-20 bg-gray-100 rounded-full" />
                                <div className="h-6 w-20 bg-gray-100 rounded-full" />
                            </div>
                        </div>
                        <div className="h-10 w-32 bg-gray-300 rounded-lg" />
                    </div>

                    <div className="grid grid-cols-12 gap-8">
                        {/* Sidebar Tabs */}
                        <div className="col-span-12 lg:col-span-3">
                            <div className="bg-white rounded-xl shadow-sm p-2 space-y-1 animate-pulse">
                                {Array.from({ length: 5 }).map((_, i) => (
                                    <div key={i} className="h-12 w-full bg-gray-100 rounded-lg" />
                                ))}
                            </div>
                        </div>

                        {/* Content Area */}
                        <div className="col-span-12 lg:col-span-9">
                            <div className="bg-white rounded-2xl shadow-sm p-6 space-y-6 animate-pulse">
                                <div className="h-8 w-40 bg-gray-200 rounded mb-6" />

                                <div className="grid md:grid-cols-2 gap-6">
                                    <div className="p-4 border rounded-xl space-y-3">
                                        <div className="h-4 w-20 bg-gray-200 rounded" />
                                        <div className="h-6 w-full bg-gray-100 rounded" />
                                    </div>
                                    <div className="p-4 border rounded-xl space-y-3">
                                        <div className="h-4 w-20 bg-gray-200 rounded" />
                                        <div className="h-6 w-full bg-gray-100 rounded" />
                                    </div>
                                </div>

                                <div className="h-px bg-gray-100 my-6" />

                                <div className="space-y-4">
                                    <div className="h-24 bg-gray-50 rounded-xl" />
                                    <div className="h-24 bg-gray-50 rounded-xl" />
                                    <div className="h-24 bg-gray-50 rounded-xl" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
