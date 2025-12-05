import React, { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

function LoginPage() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { login } = useAuth();

    const isAdmin = searchParams.get('type') === 'admin';
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        const result = await login(formData, isAdmin);

        if (result.success) {
            // Redirect based on user type
            navigate(isAdmin ? '/admin/dashboard' : '/customer/dashboard');
        } else {
            setError(result.error?.message || 'Login failed');
        }

        setLoading(false);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-background px-4">
            <div className="card max-w-md w-full p-8 animate-fadeIn">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold mb-2" style={{ color: isAdmin ? '#f97316' : '#00a859' }}>
                        🎱 Billiard Reservation
                    </h1>
                    <p className="text-text-secondary">
                        {isAdmin ? 'Admin Portal' : 'Customer Portal'}
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {error && (
                        <div className="bg-status-error/20 border border-status-error/30 text-status-error px-4 py-3 rounded-lg text-sm">
                            {error}
                        </div>
                    )}

                    <div>
                        <label className="block text-text-secondary text-sm font-medium mb-2">
                            Email
                        </label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="input"
                            placeholder="your@email.com"
                            required
                            autoComplete="email"
                        />
                    </div>

                    <div>
                        <label className="block text-text-secondary text-sm font-medium mb-2">
                            Password
                        </label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            className="input"
                            placeholder="••••••••"
                            required
                            autoComplete="current-password"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className={`btn w-full ${isAdmin ? 'btn-primary-admin' : 'btn-primary-customer'}`}
                    >
                        {loading ? 'Logging in...' : 'Login'}
                    </button>
                </form>

                <div className="mt-6 text-center space-y-2">
                    {!isAdmin && (
                        <p className="text-text-muted text-sm">
                            Don't have an account?{' '}
                            <Link to="/register" className="text-customer-primary hover:text-customer-primary-hover">
                                Register
                            </Link>
                        </p>
                    )}

                    <p className="text-text-muted text-sm">
                        {isAdmin ? (
                            <Link to="/login" className="text-customer-primary hover:text-customer-primary-hover">
                                Login as Customer
                            </Link>
                        ) : (
                            <Link to="/login?type=admin" className="text-admin-accent hover:text-orange-600">
                                Admin Login
                            </Link>
                        )}
                    </p>
                </div>

                <div className="mt-8 pt-6 border-t border-text-muted/10">
                    <p className="text-text-muted text-xs text-center">
                        {isAdmin ? (
                            'Use: admin@antrianbilliard.com / admin123'
                        ) : (
                            'Use: budi.santoso@email.com / password'
                        )}
                    </p>
                </div>
            </div>
        </div>
    );
}

export default LoginPage;
