import { useState } from "react";

import Sidebar from "../components/Sidebar";

import Navbar from "../components/Navbar";


function DashboardLayout({ children }) {

    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (

        <div className="flex min-h-screen bg-slate-100">
            {/** Desktop sidebar */}
            <div className="hidden md:block">
                <Sidebar className="h-full" />
            </div>

            {/** Mobile sidebar overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 z-50 bg-black/50 md:hidden"
                    onClick={() => setSidebarOpen(false)}
                >
                    <div
                        className="absolute left-0 top-0 h-full w-64"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <Sidebar className="h-full" />
                    </div>
                </div>
            )}

            <div className="flex-1 bg-slate-100 min-h-screen">
                <Navbar setSidebarOpen={setSidebarOpen} />
                <main className="px-4 py-6 sm:px-6 lg:px-8">
                    {children}
                </main>
            </div>
        </div>
    );
}

export default DashboardLayout;