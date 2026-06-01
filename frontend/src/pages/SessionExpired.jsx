import { Link } from 'react-router-dom';

function SessionExpired() {

    return (
        <div className='min-h-screen flex items-center justify-center bg-slate-100'>

            <div className='bg-white p-8 rounded-2xl shadow text-center'>

                <h1 className='text-3xl font-bold text-red-500 mb-4'>
                    Session Expired
                </h1>

                <p className='text-slate-500 mb-6'>
                    Your login session has Expired.
                    Please login again.
                </p>

                <Link
                    to="/"
                    className='bg-blue-600 text-white px-6 py-3 rounded-lg'
                >
                    Login Again
                </Link>
            </div>

        </div>
    );
}

export default SessionExpired;