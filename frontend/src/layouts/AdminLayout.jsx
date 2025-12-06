import React from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { LogOut, LayoutDashboard, Grid, Tag, Ticket, BarChart3, Settings } from 'lucide-react';

const AdminLayout = () => {
    const { logout, user } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    const navItems = [
        { path: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
        { path: '/admin/tables', icon: Grid, label: 'Tables' },
        { path: '/admin/table-types', icon: Tag, label: 'Table Types' },
        { path: '/admin/promos', icon: Ticket, label: 'Promotions' },
        { path: '/admin/reports', icon: BarChart3, label: 'Reports' },
        // { path: '/admin/settings', icon: Settings, label: 'Settings' },
    ];

    const isActive = (path) => {
        return location.pathname === path
            ? 'bg-admin-primary/10 text-admin-primary border-r-2 border-admin-primary'
            : 'text-text-secondary hover:bg-surface-elevated hover:text-text-primary';
    };

    return (
        <div className="min-h-screen flex bg-background">
            {/* Sidebar */}
            <aside className="w-64 bg-surface shadow-xl border-r border-text-muted/10 hidden md:flex flex-col fixed h-full z-40">
                <div className="h-16 flex items-center px-6 border-b border-text-muted/10">
                    <span className="text-xl font-bold text-admin-primary">BillZ Admin</span>
                </div>

                <nav className="flex-1 py-6 space-y-1">
                    {navItems.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`flex items-center gap-3 px-6 py-3 transition-colors ${isActive(item.path)}`}
                        >
                            <item.icon size={20} />
                            <span className="font-medium">{item.label}</span>
                        </Link>
                    ))}
                </nav>

                <div className="p-4 border-t border-text-muted/10">
                    <div className="flex items-center gap-3 px-4 py-3 mb-2">
                        <div className="w-8 h-8 rounded-full bg-admin-primary/20 flex items-center justify-center text-admin-primary font-bold">
                            {user?.name?.[0] || 'A'}
                        </div>
                        <div className="overflow-hidden">
                            <p className="text-sm font-medium text-text-primary truncate">{user?.name}</p>
                            <p className="text-xs text-text-secondary truncate">Admin</p>
                        </div>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg border border-text-muted/20 text-text-muted hover:bg-status-error/10 hover:text-status-error hover:border-status-error/30 transition-all"
                    >
                        <LogOut size={16} /> Logout
                    </button>
                </div>
            </aside>

            {/* Main Content Wrapper */}
            <div className="flex-1 md:ml-64 flex flex-col min-h-screen">
                {/* Mobile Header */}
                <header className="md:hidden h-16 bg-surface border-b border-text-muted/10 flex items-center justify-between px-4 sticky top-0 z-30">
                    <span className="text-lg font-bold text-admin-primary">BillZ Admin</span>
                    <button onClick={handleLogout} className="p-2 text-text-muted">
                        <LogOut size={20} />
                    </button>
                </header>

                <main className="flex-1 p-6 lg:p-8 animate-fadeIn overflow-auto">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;
