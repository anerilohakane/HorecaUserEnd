import SupplierSidebar from '@/components/supplier/Sidebar';
import Header from '@/components/supplier/Header';

export default function SupplierLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-[#FAFAF7]">
            <SupplierSidebar />
            <Header />
            <main className="md:ml-64 p-6">
                {children}
            </main>
        </div>
    );
}
