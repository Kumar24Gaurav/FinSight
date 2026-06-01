
import { useNavigate } from "react-router-dom";

import { FaSignOutAlt } from "react-icons/fa";

function Navbar() {

    const navigate = useNavigate();

    const user = JSON.parse(
        localStorage.getItem("user")
    );

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        navigate("/");
    }

    return (
        <div className="bg-white shadow px-6 py-4 flex justify-between items-center">

            <h2 className="text-xl font-semibold">
                Welcome, {user?.name}
            </h2>

            <div className="flex justify-between items-center gap-3">
                <div>


                    <span className="ml-3 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                        {user?.role}
                    </span>
                </div>
                <div>

                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
                        title="logout"
                    >
                        <FaSignOutAlt
                            className="text-white-400 text-xl"
                        />
                        Logout
                    </button>
                </div>
            </div>


        </div>
    );
}

export default Navbar;