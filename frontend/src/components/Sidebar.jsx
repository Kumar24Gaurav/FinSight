
import { Link } from "react-router-dom";

import { FaRocket, FaTachometerAlt, FaExchangeAlt, FaChartPie, FaUser } from "react-icons/fa";

function Sidebar({ className = "" }) {

    const user = JSON.parse(
        localStorage.getItem("user")
    )

    const role = user?.role;

    return (

        <div className={`w-64 bg-slate-900 text-white min-h-screen p-5 ${className}`}>
            <div className="flex items-center gap-3">
                <FaRocket className="text-4xl text-blue-500 mb-4" />
                <h1 className="text-2xl font-bold mb-8">
                    FinSight
                </h1>
            </div>

            <nav className="space-y-3">

                {/* Dashboard - Both Admin and Analyst */}
                <Link
                    to="/dashboard"
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-800"
                >
                    <FaTachometerAlt className="text-slate-400 text-xl" />
                    <span>Dashboard</span>
                </Link>


                {/* Analyst Only */}
                {role === "analyst" && (
                    <>
                        <Link
                            to="/transactions"
                            className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-800"
                        >
                            <FaExchangeAlt className="text-slate-400 text-xl" />

                            <span>
                                Transactions
                            </span>
                        </Link>


                        <Link
                            to="/analytics"
                            className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-800"
                        >
                            <FaChartPie className="text-slate-400 text-xl" />

                            <span>
                                Analytics
                            </span>
                        </Link>
                    </>
                )}


                {/* Admin Only */}
                {role === "admin" && (

                    <Link
                        to="/users"
                        className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-800"
                    >
                        <FaUser className="text-slate-400 text-xl" />

                        <span>
                            Users
                        </span>

                    </Link>

                )}

            </nav>
        </div>
    );
}

export default Sidebar;