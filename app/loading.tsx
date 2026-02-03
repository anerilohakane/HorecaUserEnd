import { Loader2 } from "lucide-react";

export default function Loading() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="flex flex-col items-center gap-4">
                <Loader2 className="w-10 h-10 animate-spin text-[#D97706]" />
                <p className="text-gray-500 font-medium">Loading...</p>
            </div>
        </div>
    );
}
