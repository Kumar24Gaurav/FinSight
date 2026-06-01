import Sidebar from "../components/sidebar";
import Navbar from "../components/Navbar";


function DashboardLayout({ children }) {

    return (
        <div className="flex">
            <Sidebar />
            <div className="flex-1 bg-slate-100 min-h screen">
                <Navbar />

                <div className="p-6">
                    {children}
                </div>

            </div>
        </div>
    );
}

export default DashboardLayout;