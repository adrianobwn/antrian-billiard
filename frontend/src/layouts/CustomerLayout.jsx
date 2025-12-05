import React from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { LogOut, Home, CalendarPlus, History, User } from 'lucide-react';

const CustomerLayout = () => {
    const { logout, user } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    const isActive = (path) => {
        return location.pathname === path ? 'text-customer-primary' : 'text-text-secondary hover:text-customer-primary';
    };

    return (
        <div className="min-h-screen flex flex-col bg-background">
            {/* Navbar */}
            <nav className="bg-surface shadow-md border-b border-text-muted/10 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex items-center">
                            <span className="text-xl font-bold text-customer-primary">BillZ</span>
                        </div>

                        {/* Desktop Menu */}
                        <div className="hidden md:flex items-center space-x-8">
                            <Link to="/customer/dashboard" className={`flex items-center gap-2 font-medium transition-colors ${isActive('/customer/dashboard')}`}>
                                <Home size={18} /> Dashboard
                            </Link>
                            <Link to="/customer/reservations/new" className={`flex items-center gap-2 font-medium transition-colors ${isActive('/customer/reservations/new')}`}>
                                <CalendarPlus size={18} /> Book Table
                            </Link>
                            <Link to="/customer/history" className={`flex items-center gap-2 font-medium transition-colors ${isActive('/customer/history')}`}>
                                <History size={18} /> History
                            </Link>
                            <Link to="/customer/profile" className={`flex items-center gap-2 font-medium transition-colors ${isActive('/customer/profile')}`}>
                                <User size={18} /> Profile
                            </Link>
                        </div>

                        <div className="flex items-center gap-4">
                            <div className="hidden md:block text-sm text-text-secondary">
                                {user?.name}
                            </div>
                            <button
                                onClick={handleLogout}
                                className="p-2 rounded-full hover:bg-surface-elevated text-text-muted hover:text-status-error transition-colors"
                                title="Logout"
                            >
                                <LogOut size={20} />
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fadeIn">
                <Outlet />
            </main>

            {/* Mobile Bottom Nav (Optional, good for mobile responsiveness) */}
            <div className="md:hidden fixed bottom-0 left-0 right-0 bg-surface border-t border-text-muted/10 pb-safe">
                <div className="flex justify-around p-4">
                    <Link to="/customer/dashboard" className={`flex flex-col items-center gap-1 ${isActive('/customer/dashboard')}`}>
                        <Home size={20} /> <span className="text-xs">Home</span>
                    </Link>
                    <Link to="/customer/reservations/new" className={`flex flex-col items-center gap-1 ${isActive('/customer/reservations/new')}`}>
                        <CalendarPlus size={20} /> <span className="text-xs">Book</span>
                    </Link>
                    <Link to="/customer/profile" className={`flex flex-col items-center gap-1 ${isActive('/customer/profile')}`}>
                        <User size={20} /> <span className="text-xs">Profile</span>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default CustomerLayout;
