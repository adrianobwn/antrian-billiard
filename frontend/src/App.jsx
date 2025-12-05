import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

// Auth pages
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';

// Customer pages (will be created)
// import CustomerDashboard from './pages/customer/DashboardPage';

// Admin pages (will be created)
// import AdminDashboard from './pages/admin/DashboardPage';

function App() {
    return (
        <Router>
            <AuthProvider>
                <div className="min-h-screen bg-background">
                    <Routes>
                        {/* Public routes */}
                        <Route path="/" element={<Navigate to="/login" replace />} />
                        <Route path="/login" element={<LoginPage />} />
                        <Route path="/register" element={<RegisterPage />} />

                        {/* Customer routes */}
                        <Route
                            path="/customer/*"
                            element={
                                <ProtectedRoute>
                                    <div className="flex items-center justify-center min-h-screen">
                                        <div className="card p-8 text-center">
                                            <h2 className="text-2xl font-bold text-customer-primary mb-4">
                                                Customer Dashboard
                                            </h2>
                                            <p className="text-text-secondary">Coming soon...</p>
                                        </div>
                                    </div>
                                </ProtectedRoute>
                            }
                        />

                        {/* Admin routes */}
                        <Route
                            path="/admin/*"
                            element={
                                <ProtectedRoute requireAdmin>
                                    <div className="flex items-center justify-center min-h-screen">
                                        <div className="card p-8 text-center">
                                            <h2 className="text-2xl font-bold text-admin-accent mb-4">
                                                Admin Dashboard
                                            </h2>
                                            <p className="text-text-secondary">Coming soon...</p>
                                        </div>
                                    </div>
                                </ProtectedRoute>
                            }
                        />

                        {/* 404 */}
                        <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                </div>
            </AuthProvider>
        </Router>
    );
}

export default App;
