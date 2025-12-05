import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

// Auth pages
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';

// Layouts
import CustomerLayout from './layouts/CustomerLayout';
import AdminLayout from './layouts/AdminLayout';

// Customer Pages
import CustomerDashboard from './pages/customer/DashboardPage';
import ReservationPage from './pages/customer/ReservationPage';
// import CustomerHistory from './pages/customer/HistoryPage'; // Coming next
// import CustomerProfile from './pages/customer/ProfilePage'; // Coming next

// Admin Pages
import AdminDashboard from './pages/admin/DashboardPage';
import TableManagement from './pages/admin/TableManagementPage';

function App() {
    return (
        <Router>
            <AuthProvider>
                <div className="min-h-screen bg-background text-text-primary font-sans">
                    <Routes>
                        {/* Public routes */}
                        <Route path="/" element={<Navigate to="/login" replace />} />
                        <Route path="/login" element={<LoginPage />} />
                        <Route path="/register" element={<RegisterPage />} />

                        {/* Customer routes */}
                        <Route
                            path="/customer"
                            element={
                                <ProtectedRoute>
                                    <CustomerLayout />
                                </ProtectedRoute>
                            }
                        >
                            <Route index element={<Navigate to="dashboard" replace />} />
                            <Route path="dashboard" element={<CustomerDashboard />} />
                            <Route path="reservations/new" element={<ReservationPage />} />
                            <Route path="history" element={<div className="p-8 text-center text-text-secondary">History Page (Coming Soon)</div>} />
                            <Route path="profile" element={<div className="p-8 text-center text-text-secondary">Profile Page (Coming Soon)</div>} />
                        </Route>

                        {/* Admin routes */}
                        <Route
                            path="/admin"
                            element={
                                <ProtectedRoute requireAdmin>
                                    <AdminLayout />
                                </ProtectedRoute>
                            }
                        >
                            <Route index element={<Navigate to="dashboard" replace />} />
                            <Route path="dashboard" element={<AdminDashboard />} />
                            <Route path="tables" element={<TableManagement />} />
                            <Route path="promos" element={<div className="p-8 text-center text-text-secondary">Promo Management (Coming Soon)</div>} />
                            <Route path="reports" element={<div className="p-8 text-center text-text-secondary">Reports (Coming Soon)</div>} />
                        </Route>

                        {/* 404 */}
                        <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                </div>
            </AuthProvider>
        </Router>
    );
}



export default App;
