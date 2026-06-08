
import { useEffect, useState } from "react";

import DashboardLayout from "../layouts/DashboardLayout";
import SummaryCard from "../components/SummaryCard";
import api from "../api/axios";


import {
    FaWallet,
    FaArrowDown,
    FaShieldAlt,
    FaFire
} from 'react-icons/fa';


function Dashboard() {

    const [summary, setSummary] = useState({
        total_income: 0,
        total_expense: 0,
        net_savings: 0,
        spending_ratio_percent: 0,
    });

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");

    const [alert, setAlert] = useState(null);

    useEffect(() => {

        const fetchInsights = async () => {
            try {
                const response = await api.get(
                    "/transactions/insights"
                );
                console.log(response.data);
                setSummary(response.data.summary);
            } catch (err) {

                setError(
                    err.response?.data?.error ||
                    "Failed to load dashboard"
                );
            } finally {
                setLoading(false);
            }
        };

        fetchInsights();
    }, []);

    if (loading) {
        return (
            <DashboardLayout>
                <h2>Loading...</h2>
            </DashboardLayout>
        );
    }

    if (error) {
        return (
            <DashboardLayout>
                <h2>{error}</h2>
            </DashboardLayout>
        );
    }


    return (
        <DashboardLayout>

            <div className="mb-8">

                <h1 className="text-2xl md:text-3xl font-bold text-slate-900">
                    Dashboard
                </h1>

                <p className="text-slate-500 mt-2">
                    Your personal dashboard
                </p>

            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <SummaryCard
                    title="Total Income"
                    value={`₹${summary.total_income}`}
                    icon={<FaWallet />}
                    iconBg="bg-indigo-500"
                />
                <SummaryCard
                    title="Total Expense"
                    value={`₹${summary.total_expense}`}
                    icon={<FaArrowDown />}
                    iconBg="bg-red-500"
                />
                <SummaryCard
                    title="Net Savings"
                    value={`₹${summary.net_savings}`}
                    icon={<FaShieldAlt />}
                    iconBg="bg-emerald-500"
                />
                <SummaryCard
                    title="Spending Ratio"
                    value={`${summary.spending_ratio_percent}%`}
                    icon={<FaFire />}
                    iconBg="bg-amber-500"
                />

            </div>

        </DashboardLayout>
    );
}

export default Dashboard;