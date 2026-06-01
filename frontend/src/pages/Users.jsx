import { useEffect, useState } from "react";

import DashboardLayout from "../layouts/DashboardLayout";
import api from "../api/axios";
import { FaEdit, FaTrash, FaCheck, FaTimes } from 'react-icons/fa';

function Users() {

    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [editId, setEditId] = useState(null);

    const [editData, setEditData] = useState({
        name: "",
        email: "",
        role: "",
    });

    const [pagination, setPagination] = useState({
        page: 1,
        total_pages: 1,
        total: 0,
        limit: 5,
    });

    const currentUser = JSON.parse(
        localStorage.getItem("user")
    );

    const statusStyles = {
        healthy:
            "bg-green-100 text-green-700",

        warning:
            "bg-yellow-100 text-yellow-700",

        overspending:
            "bg-red-100 text-red-700",

        no_income:
            "bg-gray-100 text-gray-700",
    };


    const fetchUsers = async (pageNumber = 1) => {

        try {

            const response = await api.get(
                "/users",
                {
                    params: {
                        page: pageNumber,
                        limit: 5
                    }
                }
            );
            setUsers(response.data.users);

            setPagination(response.data.pagination)
        } catch (err) {

            setError(
                err.response?.data?.error ||
                "Failed to load users"
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleDelete = async (id) => {
        const confirmDelete = window.confirm("Delete this user?")

        if (!confirmDelete) {
            return;
        }
        try {
            await api.delete(`/users/${id}`);

            fetchUsers();
        } catch (err) {
            alert(
                err.response?.data?.error ||
                "Failed to delete user"
            );
        }
    };

    const handleEdit = (user) => {

        setEditId(user.id);

        setEditData({
            name: user.name,
            email: user.email,
            role: user.role,
        });

    };


    const handleUpdate = async () => {

        try {

            await api.put(
                `/users/${editId}`,
                editData
            );


            alert(
                "User updated successfully"
            );


            setEditId(null);


            fetchUsers();


        } catch (err) {

            alert(
                err.response?.data?.error ||
                "Update failed"
            );

        }

    };



    if (loading) {
        return (
            <DashboardLayout>
                Loading...
            </DashboardLayout>
        )
    }

    if (error) {
        return (
            <DashboardLayout>
                {error}
            </DashboardLayout>
        )
    }

    return (

        <DashboardLayout>
            <h1 className="text-3xl font-bold mb-6 justify-between items-center flex">
                User Management
            </h1>

            <div className="bg-white rounded-xl shadow overflow-hidden">

                <div className="bg-white rounded-2xl shadow overflow-hidden">

                    <table className="w-full">

                        <thead className="bg-slate-50">


                            <tr>

                                <th className="p-5 text-left text-xs font-bold text-slate-500 uppercase">
                                    User
                                </th>

                                <th className="p-5 text-left text-xs font-bold text-slate-500 uppercase">
                                    Income
                                </th>

                                <th className="p-5 text-left text-xs font-bold text-slate-500 uppercase">
                                    Expense
                                </th>

                                <th className="p-5 text-left text-xs font-bold text-slate-500 uppercase">
                                    Status
                                </th>

                                <th className="p-5 text-left text-xs font-bold text-slate-500 uppercase">
                                    Role
                                </th>

                                <th className="p-5 text-left text-xs font-bold text-slate-500 uppercase">
                                    Actions
                                </th>

                            </tr>



                        </thead>


                        <tbody>

                            {users.map((user) => (

                                <tr
                                    key={user.id}
                                    className="border-t hover:bg-slate-50 transition"
                                >

                                    {/* User Info */}
                                    <td className="p-5">

                                        <div className="flex items-center gap-3">

                                            <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold">

                                                {user.name[0].toUpperCase()}

                                            </div>


                                            <div>

                                                <p className="font-semibold text-slate-800">
                                                    {user.name}
                                                </p>

                                                <p className="text-sm text-slate-500">
                                                    {user.email}
                                                </p>

                                            </div>

                                        </div>

                                    </td>

                                    {/* Income */}
                                    <td className="p-5 font-semibold text-green-600">

                                        ₹{user.total_income}

                                    </td>



                                    {/* Expense */}
                                    <td className="p-5 font-semibold text-red-600">

                                        ₹{user.total_expense}

                                    </td>



                                    {/* Status */}
                                    <td className="p-5">

                                        <span
                                            className={`
                                                px-3 py-1 rounded-full text-sm font-medium
                                                ${statusStyles[user.status]}
                                            `}
                                        >

                                            {
                                                user.status.replace("_", " ").toUpperCase()
                                            }

                                        </span>

                                    </td>



                                    {/* Role */}
                                    <td className="p-5 w-48">


                                        {
                                            editId === user.id
                                                ?

                                                (
                                                    <select
                                                        value={editData.role}
                                                        onChange={(e) =>
                                                            setEditData({
                                                                ...editData,
                                                                role: e.target.value
                                                            })
                                                        }
                                                        className="w-32 border rounded-lg px-3 py-2 bg-white"
                                                    >

                                                        <option value="admin">
                                                            Admin
                                                        </option>

                                                        <option value="analyst">
                                                            Analyst
                                                        </option>

                                                    </select>
                                                )


                                                :

                                                (
                                                    <span
                                                        className={`px-3 py-1 rounded-full text-sm font-medium
                                                            ${user.role === "admin"
                                                                ?
                                                                "bg-purple-100 text-purple-700"
                                                                :
                                                                "bg-green-100 text-green-700"
                                                            }`}
                                                    >

                                                        {user.role}

                                                    </span>
                                                )

                                        }


                                    </td>



                                    {/* Actions */}

                                    <td className="p-5 w-40">

                                        <div className="flex gap-3">


                                            {
                                                editId === user.id
                                                    ?

                                                    (
                                                        <>
                                                            <button
                                                                onClick={handleUpdate}
                                                                className="p-2 text-green-600 hover:bg-green-100 rounded-lg"
                                                            >
                                                                <FaCheck />
                                                            </button>

                                                            <button
                                                                onClick={() =>
                                                                    setEditId(null)
                                                                }
                                                                className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg"
                                                            >
                                                                <FaTimes />
                                                            </button>
                                                        </>


                                                    )

                                                    :

                                                    (

                                                        <button
                                                            onClick={() =>
                                                                handleEdit(user)
                                                            }
                                                            className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg"
                                                        >

                                                            <FaEdit />

                                                        </button>

                                                    )

                                            }



                                            {
                                                currentUser.id !== user.id && (

                                                    <button
                                                        onClick={() =>
                                                            handleDelete(user.id)
                                                        }
                                                        className="p-2 text-red-600 hover:bg-red-100 rounded-lg"
                                                    >

                                                        <FaTrash />

                                                    </button>

                                                )
                                            }


                                        </div>

                                    </td>


                                </tr>

                            ))}

                        </tbody>


                    </table>

                    <div className="mt-6">

                        <p className="text-center text-sm text-slate-500 mb-3">

                            Page {pagination.page}
                            {" "}of{" "}
                            {pagination.total_pages}

                            {" | "}

                            Users: {pagination.total}

                        </p>

                        <div className="flex justify-center gap-2">

                            <div className="flex justify-center gap-2">


                                <button

                                    disabled={
                                        pagination.page === 1
                                    }

                                    onClick={() =>
                                        fetchUsers(
                                            pagination.page - 1
                                        )
                                    }

                                    className="px-4 py-2 border rounded-lg disabled:opacity-50"
                                >

                                    Previous

                                </button>



                                {
                                    [...Array(
                                        pagination.total_pages
                                    )].map(
                                        (_, index) => (

                                            <button

                                                key={index}

                                                onClick={() =>
                                                    fetchUsers(
                                                        index + 1
                                                    )
                                                }

                                                className={`
                                                                px-4 py-2 rounded-lg
                                                                ${pagination.page === index + 1
                                                        ?
                                                        "bg-blue-600 text-white"
                                                        :
                                                        "border"
                                                    }
                                                    `}
                                            >

                                                {index + 1}

                                            </button>

                                        ))
                                }



                                <button

                                    disabled={
                                        pagination.page ===
                                        pagination.total_pages
                                    }

                                    onClick={() =>
                                        fetchUsers(
                                            pagination.page + 1
                                        )
                                    }

                                    className="px-4 py-2 border rounded-lg disabled:opacity-50"
                                >

                                    Next

                                </button>


                            </div>

                        </div>

                    </div>
                </div>


            </div>

        </DashboardLayout >

    )
}

export default Users;