import Header from '@/components/Header';

export default function Loading() {
    return (
        <div className="min-h-screen bg-gray-50">
            <Header />
            {/* Map Placeholder */}
            <div className="fixed inset-0 top-[64px] z-0 bg-gray-200 animate-pulse" />

            {/* Sheet Skeleton */}
            <div className="fixed bottom-0 left-0 right-0 z-10 bg-white rounded-t-3xl shadow-xl h-[55vh] p-6 animate-pulse">
                <div className="w-16 h-1 bg-gray-300 rounded-full mx-auto mb-6" />
                <div className="flex justify-between items-start mb-6">
                    <div>
                        <div className="h-8 w-48 bg-gray-200 rounded mb-2" />
                        <div className="h-4 w-32 bg-gray-200 rounded" />
                    </div>
                    <div className="h-10 w-24 bg-gray-200 rounded-full" />
                </div>
                <div className="space-y-4">
                    <div className="h-20 bg-gray-100 rounded-xl" />
                    <div className="h-20 bg-gray-100 rounded-xl" />
                    <div className="h-20 bg-gray-100 rounded-xl" />
                </div>
            </div>
        </div>
    );
}
