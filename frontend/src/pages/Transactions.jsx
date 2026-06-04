import { useEffect, useState } from 'react';

import DashboardLayout from '../layouts/DashboardLayout';
import api from '../api/axios';
import { FaTrash, FaPlus, FaEdit } from "react-icons/fa";

function Transactions() {

    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");


    const [showForm, setShowForm] = useState(false);

    const [formData, setFormData] = useState({
        amount: "",
        type: "expense",
        category: "",
        date: "",
        description: "",
    });

    const [pagination, setPagination] = useState({
        page: 1,
        total_pages: 1,
        total: 0,
        limit: 5,
    });

    const [editId, setEditId] = useState(null);

    const [category, setCategory] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");

    const [categories, setCategories] = useState([]);

    const handleEdit = (transaction) => {
        setEditId(transaction.id);

        setFormData({
            amount: transaction.amount,
            type: transaction.type,
            category: transaction.category,
            date: transaction.date,
            description: transaction.description,
        });

        setShowForm(true);
    }

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const fetchCategories = async () => {

        try {

            const response =
                await api.get(
                    "/transactions/categories"
                );

            setCategories(
                response.data
            );

        } catch (err) {

            console.log(err);

        }
    };


    const fetchTransactions = async (
        pageNumber = 1
    ) => {

        try {

            const response = await api.get("/transactions/filter",
                {
                    params: {
                        category,
                        start_date: startDate,
                        end_date: endDate,
                        page: pageNumber,
                        limit: 5
                    }
                }
            );

            setTransactions(
                response.data.transactions
            );

            setPagination(
                response.data.pagination
            );

        } catch (err) {

            setError(
                err.response?.data?.error ||
                "Failed to load transactions"
            );

        } finally {

            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTransactions();
        fetchCategories();
    }, []);




    const handleSubmit = async () => {

        try {

            if (editId) {
                await api.put(
                    `/transactions/${editId}`,
                    formData
                );

                alert(
                    "Transaction updated successfully"
                );
            } else {
                await api.post(
                    "/transactions",
                    formData
                );

                alert(
                    "Transaction added successfully"
                );
            }

            fetchTransactions();
        } catch (err) {
            alert(
                err.response?.data?.error
            )
        }
    }

    const handleDelete = async (id) => {

        const confirmDelete = window.confirm(
            "Are you sure you want to delete this transaction?"
        );

        if (!confirmDelete) {
            return;
        }
        try {
            await api.delete(
                `/transactions/${id}`
            );

            fetchTransactions();
        } catch (err) {
            alert(
                err.response?.data?.error ||
                "Failed to delete transaction"
            );
        }
    };




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

            <div className="mb-8 flex">

                <div>
                    <h1 className="text-3xl font-bold text-slate-900">
                        Transactions
                    </h1>

                    <p className="text-slate-500 mt-2">
                        Add, view, update and delete your record
                    </p>
                </div>

                <div className="ml-auto">
                    <button
                        onClick={() => setShowForm(!showForm)}
                        className="cursor-pointer flex items-center gap-2 bg-blue-600 text-white px-5 py-3 rounded-lg hover:bg-blue-700"
                    >
                        <FaPlus size={18} />
                        <span>Add Transaction</span>
                    </button>
                </div>


            </div>




            {
                showForm && (
                    <div className='bg-white rounded-xl shadow p-6 mb-6'>

                        <h2 className='text-xl font-semibold mb-4'>
                            Add Transaction
                        </h2>

                        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                            <input
                                type="number"
                                name="amount"
                                placeholder='Amount'
                                value={formData.amount}
                                onChange={handleChange}
                                className='border p-3 rounded-lg'
                            />

                            <select
                                name="type"
                                value={formData.type}
                                onChange={handleChange}
                                className='border p-3 rounded-lg'
                            >
                                <option value="income">Income</option>
                                <option value="expense">Expense</option>
                            </select>

                            <input
                                type="text"
                                name="category"
                                placeholder='Category'
                                value={formData.category}
                                onChange={handleChange}
                                className='border p-3 rounded-lg'
                            />

                            <input
                                type="date"
                                name="date"
                                value={formData.date}
                                onChange={handleChange}
                                className="border p-3 rounded-lg"
                            />
                        </div>

                        <textarea
                            name="description"
                            placeholder='Description'
                            value={formData.description}
                            onChange={handleChange}
                            className='border p-3 rounded-lg w-full mt-4'
                        />

                        <button
                            onClick={handleSubmit}
                            className='cursor-pointer bg-green-600 text-white px-5 py-3 rounded-lg mt-4 hover:bg-green-700'
                        >
                            Save Transaction
                        </button>

                    </div>
                )
            }


            <div className='bg-white rounded-xl shadow overflow-hidden'>
                <div className="bg-white p-4 rounded-xl shadow mb-6">

                    <h2 className="text-lg font-semibold mb-4">
                        Filters
                    </h2>

                    <div className="grid md:grid-cols-4 gap-4">

                        <select
                            value={category}
                            onChange={(e) =>
                                setCategory(e.target.value)
                            }
                            className="border rounded-lg px-3 py-2"
                        >

                            <option value="">
                                All Categories
                            </option>

                            {categories.map((cat) => (

                                <option
                                    key={cat}
                                    value={cat}
                                >
                                    {cat}
                                </option>

                            ))}

                        </select>

                        <input
                            type="date"
                            value={startDate}
                            onChange={(e) =>
                                setStartDate(e.target.value)
                            }
                            className="border rounded-lg px-3 py-2"
                        />

                        <input
                            type="date"
                            value={endDate}
                            onChange={(e) =>
                                setEndDate(e.target.value)
                            }
                            className="border rounded-lg px-3 py-2"
                        />

                        <button
                            onClick={() =>
                                fetchTransactions(1)
                            }
                            className="cursor-pointer bg-blue-600 text-white rounded-lg px-4 py-2 hover:bg-blue-700"
                        >
                            Apply Filters
                        </button>

                    </div>

                </div>

                <table className='w-full'>
                    <thead className='bg-slate-100'>

                        <tr>
                            <th className='p-4 text-left text-xs font-bold text-slate-500 uppercase'>Date</th>
                            <th className='p-4 text-left text-xs font-bold text-slate-500 uppercase'>Type</th>
                            <th className='p-4 text-left text-xs font-bold text-slate-500 uppercase'>Category</th>
                            <th className='p-4 text-left text-xs font-bold text-slate-500 uppercase'>Amount</th>
                            <th className='p-4 text-left text-xs font-bold text-slate-500 uppercase'>Description</th>
                            <th className="p-4 text-left text-xs font-bold text-slate-500 uppercase">Actions</th>
                        </tr>

                    </thead>

                    <tbody>
                        {transactions.map((transaction) => (

                            <tr key={transaction.id} className='border-t'>
                                <td className='p-4'>{transaction.date}</td>
                                <td className='p-4'>{transaction.type}</td>
                                <td className='p-4'>{transaction.category}</td>
                                <td className='p-4'>{transaction.amount}</td>
                                <td className='p-4'>{transaction.description}</td>

                                <td className='p-4'>
                                    <div className='flex items-center gap-4'>

                                        <button
                                            onClick={() => handleEdit(transaction)}
                                            className="cursor-pointer p-2 rounded-lg text-blue-500 hover:bg-blue-100 hover:text-blue-700 transition"
                                            title="Edit Transaction"
                                        >
                                            <FaEdit size={18} />
                                        </button>
                                        <button
                                            onClick={() =>
                                                handleDelete(transaction.id)
                                            }
                                            className='cursor-pointer p-2 rounded-lg text-red-500 hover:bg-red-100 hover:text-red-700 transition'
                                            title='Delete Transactions'
                                        >
                                            <FaTrash size={18} />
                                        </button>

                                    </div>
                                </td>
                            </tr>

                        ))}
                    </tbody>
                </table>

                <div className='mt-6'>

                    <p className='text-sm text-slate-500 mt-4 text-center'>

                        Showing page {pagination.page}
                        {" "}of{" "}
                        {pagination.total_pages}

                        {" . "}

                        Total Records:
                        {" "}
                        {pagination.total}

                    </p>

                    <div className='flex justify-center items-center gap-2 mt-6'>

                        <button
                            disabled={pagination.page === 1}
                            onClick={() => fetchTransactions(pagination.page - 1)}
                            className='cursor-pointer px-4 py-2 border rounded disabled:opacity-50'
                        >
                            Previous
                        </button>

                        {
                            [...Array(
                                pagination.total_pages
                            )].map((_, index) => (

                                <button
                                    key={index}
                                    onClick={() =>
                                        fetchTransactions(
                                            index + 1
                                        )
                                    }
                                    className={`cursor-pointer px-4 py-2 rounded ${pagination.page === index + 1
                                        ? "bg-blue-600 text-white"
                                        : "border"
                                        }`}
                                >
                                    {index + 1}
                                </button>
                            ))
                        }


                        <button
                            disabled={
                                pagination.page === pagination.total_pages
                            }
                            onClick={() => fetchTransactions(pagination.page + 1)}
                            className='cursor-pointer px-4 py-2 border rounded disabled:opacity-50'
                        >
                            Next
                        </button>
                    </div>


                </div>
            </div>
        </DashboardLayout>
    );
}


export default Transactions;