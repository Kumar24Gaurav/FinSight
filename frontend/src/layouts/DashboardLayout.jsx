import { useState } from "react";

import Sidebar from "../components/Sidebar";

import Navbar from "../components/Navbar";


function DashboardLayout({ children }) {

    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (

        <div className="flex min-h-screen">
            {/**Desktop sidebar */}
            <div className="hidden md:block">
                <Sidebar />
            </div>

            {/**Mobile Sidebar */}
            {
                sidebarOpen && (
                    <div
                        className="fixed inset-0 z-50 bg-black/50 md:hidden"
                        onClick={() => setSidebarOpen(false)}
                    >
                        <div className="w-64"
                            onClick={(e) => e.stopPropagation()}>
                            <Sidebar />
                        </div>

                    </div>
                )
            }

            <div className="flex-1 bg-slate-100 min-h-screen">
                <Navbar setSidebarOpen={setSidebarOpen} />
                <div className="p-6 md:p-6">
                    {children}
                </div>
            </div>

        </div>
    );
}

export default DashboardLayout;