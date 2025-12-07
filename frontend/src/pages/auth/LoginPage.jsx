import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { ArrowLeft } from 'lucide-react';

function LoginPage() {
    const navigate = useNavigate();
    const { login } = useAuth();

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

        // Detect if admin based on email domain
        const isAdmin = formData.email.includes('@antrianbilliard.com');

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
        <div className="min-h-screen flex items-center justify-center bg-background px-4 relative">
            <Link to="/" className="absolute top-6 left-6 text-text-secondary hover:text-customer-primary flex items-center gap-2 transition-colors">
                <ArrowLeft size={20} />
                <span className="font-medium">Back to Home</span>
            </Link>

            <div className="card max-w-md w-full p-8 animate-fadeIn">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold mb-2 text-customer-primary">
                        🎱 Antrian Billiard
                    </h1>
                    <p className="text-text-secondary">
                        Masuk ke Akun Anda
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
                        className="btn w-full btn-primary-customer"
                    >
                        {loading ? 'Logging in...' : 'Masuk'}
                    </button>
                </form>

                <div className="mt-6 text-center">
                    <p className="text-text-muted text-sm">
                        Belum punya akun?{' '}
                        <Link to="/register" className="text-customer-primary hover:text-customer-primary-hover font-medium">
                            Daftar Sekarang
                        </Link>
                    </p>
                </div>

                <div className="mt-8 pt-6 border-t border-text-muted/10">
                    <p className="text-text-muted text-xs text-center">
                        Demo Customer: budi.santoso@email.com / password
                    </p>
                    <p className="text-text-muted text-xs text-center mt-1">
                        Demo Admin: admin@antrianbilliard.com / admin123
                    </p>
                </div>
            </div>
        </div>
    );
}

export default LoginPage;
