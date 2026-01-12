import AppHeader from "@/components/layout/AppHeader";
import AppSidebar from "@/components/layout/AppSidebar";

export default function ManagerLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen bg-secondary-50 flex font-sans text-secondary-900">
            <AppSidebar role="MANAGER" />

            <main className="flex-1 lg:pl-72 flex flex-col min-h-screen transition-all duration-300 ease-in-out w-full">
                <AppHeader title="Manager Portal" />

                <div className="p-4 md:p-8 flex-1 w-full max-w-7xl mx-auto">
                    {children}
                </div>
            </main>
        </div>
    )
}
