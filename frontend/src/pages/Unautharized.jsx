import { Link } from "react-router-dom";


function Unauthorized() {

    return (

        <div className="min-h-screen flex justify-center items-center  bg-slate-100 ">

            <div className=" bg-white p-8 rounded-xl shadow text-center ">

                <h1 className="  text-2xl md:text-3xl  font-bold  text-red-500  mb-4  ">
                    Access Denied
                </h1>

                <p className="  text-slate-500  mb-6  ">
                    You don't have permission
                    to access this page.
                </p>

                <Link to="/dashboard" className="  bg-blue-600  text-white  px-5  py-3  rounded-lg  ">
                    Go Back
                </Link>

            </div>

        </div>
    );
}


export default Unauthorized;