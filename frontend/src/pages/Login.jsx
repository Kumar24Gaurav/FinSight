import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axios";

function Login() {

    const navigate = useNavigate();

    const [formData, setFormData] = useState({ email: "", password: "", });

    const [error, setError] = useState("");

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError("");

        try {
            const response = await api.post("/login", formData);

            localStorage.setItem(
                "token",
                response.data.access_token
            );
            localStorage.setItem(
                "user",
                JSON.stringify(response.data.user)
            );

            navigate("/dashboard");
        } catch (err) {
            setError(
                err.response?.data?.error ||
                "Login failed"
            );
        }
    };




    return (
        <div className="min-h-screen bg-slate-100 flex items-center justify-center px-4">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">

                {/**Logo */}
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-blue-600">
                        FinSight
                    </h1>

                    <p className="text-slate-500 mt-2">
                        Smart Financial Tracking & Insights
                    </p>
                </div>

                {error && (
                    <div className="bg-red-100 border border-red-300 text-red-700 px-4 py-3 rounded-lg mb-4">
                        {error}
                    </div>
                )}

                {/**Login Form */}
                <form className="space-y-5" onSubmit={handleSubmit}>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                            Email
                        </label>

                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="Enter your email"
                            className="w-full border border-slate-300 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-200"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                            Password
                        </label>

                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="Enter your password"
                            className="w-full border border-slate-300 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-200"
                        />
                    </div>

                    <button
                        type="submit"
                        className="cursor-pointer w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition"
                    >
                        Sign In
                    </button>
                </form>

                {/**Footer */}
                <p className="text-center text-slate-500 mt-6">
                    Don't have an account? {" "}
                    <Link
                        to="/register"
                        className="text-blue-600 font-medium hover:underline"
                    >
                        Register
                    </Link>
                </p>

            </div>
        </div>
    )
}

export default Login;