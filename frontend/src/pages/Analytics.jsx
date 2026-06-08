import { useEffect, useState } from 'react';

import DashboardLayout from '../layouts/DashboardLayout';
import SummaryCard from '../components/SummaryCard';
import api from "../api/axios";

import {
    FaWallet,
    FaArrowDown,
    FaShieldAlt,
    FaFire
} from 'react-icons/fa';

import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    Legend,
    PieChart,
    Pie,
    Cell,
    CartesianGrid
} from "recharts";

function Analytics() {

    const [analytics, setAnalytics] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const COLORS = [
        "#3B82F6",
        "#10B981",
        "#F59E0B",
        "#EF4444",
        "#8B5CF6",
        "#EC4899",
    ];

    useEffect(() => {

        const fetchInsights = async () => {
            try {
                const response = await api.get(
                    "/transactions/insights"
                );
                console.log(response.data);
                setAnalytics(response.data);
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

    const alertStyles = {
        healthy: "bg-green-50 border-green-500 text-green-800",
        warning: "bg-yellow-50 border-yellow-500 text-yellow-800",
        overspending: "bg-red-50 border-red-500 text-red-800",
        no_income: "bg-white-50 border-gray-500 text-white-800"
    }

    if (loading) {
        return (
            <DashboardLayout>
                Loading...
            </DashboardLayout>
        );
    }

    if (error) {
        return (
            <DashboardLayout>
                {error}
            </DashboardLayout>
        );
    }

    if (!analytics) {
        return null;
    }

    return (
        <DashboardLayout>

            {/* Header */}
            <div className="mb-8">

                <h1 className="text-2xl md:text-3xl font-bold text-slate-900">
                    Financial Analytics
                </h1>

                <p className="text-slate-500 mt-2">
                    Overview of your income, expenses & savings
                </p>

            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">

                <SummaryCard
                    title="TOTAL INCOME"
                    value={`₹${analytics.summary.total_income}`}
                    subtitle="This period"
                    icon={<FaWallet />}
                    iconBg="bg-indigo-500"
                />

                <SummaryCard
                    title="TOTAL EXPENSES"
                    value={`₹${analytics.summary.total_expense}`}
                    subtitle="This period"
                    icon={<FaArrowDown />}
                    iconBg="bg-red-500"
                />

                <SummaryCard
                    title="NET SAVINGS"
                    value={`₹${analytics.summary.net_savings}`}
                    subtitle={`${(
                        (analytics.summary.net_savings /
                            analytics.summary.total_income) *
                        100
                    ).toFixed(1)}% of income saved`}
                    icon={<FaShieldAlt />}
                    iconBg="bg-emerald-500"
                />

                <SummaryCard
                    title="SPENDING RATIO"
                    value={`${analytics.summary.spending_ratio_percent}%`}
                    subtitle="of total income"
                    icon={<FaFire />}
                    iconBg="bg-amber-500"
                />

            </div>

            {/* Alert + Top Category */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">

                <div
                    className={`p-6 rounded-xl border-l-4 shadow ${alertStyles[
                        analytics.spending_alert.status
                    ]
                        }`}
                >

                    <h2 className="font-semibold text-lg mb-2">
                        Spending Alert
                    </h2>

                    <p>
                        {analytics.spending_alert.message}
                    </p>

                </div>

                <div className="bg-white p-6 rounded-xl shadow">

                    <h2 className="text-lg font-semibold mb-3">
                        Top Expense Category
                    </h2>

                    <p className="text-slate-500">
                        {analytics.top_expense_category.category}
                    </p>

                    <p className="text-2xlmd:text-3xl font-bold mt-2">
                        ₹{analytics.top_expense_category.amount}
                    </p>

                </div>

            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                {/* Monthly Trend */}
                <div className="bg-white p-6 rounded-xl shadow h-[420px]">

                    <h2 className="text-xl font-semibold mb-4">
                        Monthly Trend
                    </h2>

                    <ResponsiveContainer
                        width="100%"
                        height={250}
                    >

                        <BarChart
                            data={analytics.monthly_trend}
                        >

                            <CartesianGrid
                                strokeDasharray="3 3"
                                vertical={false}
                            />

                            <XAxis dataKey="month" />

                            <YAxis />

                            <Tooltip />

                            <Legend />

                            <Bar
                                dataKey="income"
                                fill="#34D399"
                                radius={[6, 6, 0, 0]}
                            />

                            <Bar
                                dataKey="expense"
                                fill="#F87171"
                                radius={[6, 6, 0, 0]}
                            />

                        </BarChart>

                    </ResponsiveContainer>

                </div>

                {/* Expense Breakdown */}
                <div className="bg-white p-6 rounded-xl shadow h-[420px]">

                    <h2 className="text-xl font-semibold mb-4">
                        Expense Breakdown
                    </h2>

                    <div className="flex flex-col lg:flex-row items-center justify-between h-full">

                        <ResponsiveContainer
                            width="100%"
                            height={300}
                        >

                            <PieChart>

                                <Pie
                                    data={analytics.category_breakdown}
                                    dataKey="amount"
                                    nameKey="category"
                                    innerRadius={55}
                                    outerRadius={85}
                                    paddingAngle={3}
                                >

                                    {analytics.category_breakdown.map(
                                        (entry, index) => (
                                            <Cell
                                                key={index}
                                                fill={
                                                    COLORS[
                                                    index %
                                                    COLORS.length
                                                    ]
                                                }
                                            />
                                        )
                                    )}

                                </Pie>

                                <Tooltip />

                            </PieChart>

                        </ResponsiveContainer>

                        <div className="space-y-3">

                            {analytics.category_breakdown.map(
                                (item, index) => (

                                    <div
                                        key={index}
                                        className="flex items-center justify-between gap-6"
                                    >

                                        <div className="flex items-center gap-2">

                                            <div
                                                className="w-3 h-3 rounded-full"
                                                style={{
                                                    backgroundColor:
                                                        COLORS[
                                                        index %
                                                        COLORS.length
                                                        ]
                                                }}
                                            />

                                            <span>
                                                {item.category}
                                            </span>

                                        </div>

                                        <span className="font-medium">
                                            ₹{item.amount}
                                        </span>

                                    </div>

                                )
                            )}

                        </div>

                    </div>

                </div>

            </div>

        </DashboardLayout>
    );
}

export default Analytics;