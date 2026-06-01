import { Routes, Route } from 'react-router-dom';

import Login from "../pages/Login";
import Register from "../pages/Register";
import Dashboard from "../pages/Dashboard";
import Transactions from '../pages/Transactions';
import Analytics from '../pages/Analytics';
import Users from '../pages/Users';
import ProtectedRoute from './ProtectedRoute';
import SessionExpired from '../pages/SessionExpired';
import Unauthorized from '../pages/Unautharized';

function AppRoutes() {

    return (
        <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route
                path="/dashboard"
                element={
                    <ProtectedRoute
                        allowedRoles={[
                            "admin",
                            "analyst"
                        ]}
                    >
                        <Dashboard />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/transactions"
                element={
                    <ProtectedRoute
                        allowedRoles={[
                            "analyst"
                        ]}
                    >
                        <Transactions />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/analytics"
                element={
                    <ProtectedRoute
                        allowedRoles={[
                            "analyst"
                        ]}
                    >
                        <Analytics />
                    </ProtectedRoute>
                }
            />

            <Route
                path='/users'
                element={
                    <ProtectedRoute
                        allowedRoles={[
                            "admin"
                        ]}
                    >
                        <Users />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/session-expired"
                element={<SessionExpired />}
            />

            <Route
                path="/unauthorized"
                element={<Unauthorized />}
            />

        </Routes>
    )
}

export default AppRoutes;