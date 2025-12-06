import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import ErrorBoundary from './components/common/ErrorBoundary';

// Auth pages
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';

// Layouts
import CustomerLayout from './layouts/CustomerLayout';
import AdminLayout from './layouts/AdminLayout';

// Customer Pages
import CustomerDashboard from './pages/customer/DashboardPage';
import ReservationPage from './pages/customer/ReservationPage';
import PaymentPage from './pages/customer/PaymentPage';
import CustomerProfile from './pages/customer/ProfilePage';
import CustomerHistory from './pages/customer/HistoryPage';
import CustomerActivity from './pages/customer/ActivityPage';

// Admin Pages
import AdminDashboard from './pages/admin/DashboardPage';
import TableManagement from './pages/admin/TableManagementPage';
import TableTypeManagement from './pages/admin/TableTypeManagementPage';
import PromoManagement from './pages/admin/PromoManagementPage';
import ReportsPage from './pages/admin/ReportsPage';

function App() {
    return (
        <ErrorBoundary>
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
                                <Route path="payment" element={<PaymentPage />} />
                                <Route path="history" element={<CustomerHistory />} />
                                <Route path="activity" element={<CustomerActivity />} />
                                <Route path="profile" element={<CustomerProfile />} />
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
                                <Route path="table-types" element={<TableTypeManagement />} />
                                <Route path="promos" element={<PromoManagement />} />
                                <Route path="reports" element={<ReportsPage />} />
                            </Route>

                            {/* 404 */}
                            <Route path="*" element={<Navigate to="/" replace />} />
                        </Routes>
                    </div>
                </AuthProvider>
            </Router>
        </ErrorBoundary>
    );
}



export default App;
