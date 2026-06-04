
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axios";

function Register() {

    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
    });

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError("");
        setSuccess("");
        setLoading(true);

        try {
            const response = await api.post("/register", formData);

            setSuccess(response.data.message);

            setTimeout(() => {
                navigate("/");
            }, 1500);
        } catch (err) {
            setError(
                err.response?.data?.error ||
                "Registration failed"
            );
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen bg-slate-100 flex items-center justify-center px-4">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">

                {/**Logo */}
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-blue-600">
                        FinSight
                    </h1>

                    <p className="text-slate-500 mt-2">
                        Create your account
                    </p>
                </div>

                {error && (
                    <div className="bg-red-100 border border-red-300 text-red-700 px-4 py-3 rounded-lg mb-4">
                        {error}
                    </div>
                )}
                {success && (
                    <div className="bg-green-100 border border-green-300 text-green-700 p-3 rounded-lg mb-4">
                        {success}
                    </div>
                )}


                {/**Login Form */}
                <form className="space-y-5" onSubmit={handleSubmit}>
                    <div>
                        <label className="block text-sm font-medium mb-2">
                            Name
                        </label>

                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Enter your name"
                            className="w-full border border-slate-300 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-200"
                        />
                    </div>

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
                        disabled={loading}
                        className="cursor-pointer w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition disabled:bg-blue-400"
                    >
                        {loading
                            ? "Creating Account..."
                            : "Register"}
                    </button>
                </form>

                {/**Footer */}
                <p className="text-center text-slate-500 mt-6">
                    Already have an account? {" "}
                    <Link
                        to="/"
                        className="text-blue-600 font-medium hover:underline"
                    >
                        Login
                    </Link>
                </p>

            </div>
        </div>
    )

}

export default Register;