import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import customerService from '../../services/customerService';
import { User, Mail, Phone, MapPin, Save, Eye, EyeOff, Check, X } from 'lucide-react';

const CustomerProfile = () => {
    const { user, updateUser } = useAuth();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });
    const [showPassword, setShowPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [profileData, setProfileData] = useState({
        name: '',
        email: '',
        phone: '',
        address: ''
    });
    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const response = await customerService.getProfile();
            if (response.success) {
                const profile = response.data;
                setProfileData({
                    name: profile.name || '',
                    email: profile.email || '',
                    phone: profile.phone || '',
                    address: profile.address || ''
                });
            }
        } catch (error) {
            console.error('Failed to fetch profile:', error);
            showMessage('error', 'Failed to load profile data');
        } finally {
            setLoading(false);
        }
    };

    const showMessage = (type, text) => {
        setMessage({ type, text });
        setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    };

    const handleProfileSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            const response = await customerService.updateProfile(profileData);
            if (response.success) {
                updateUser(response.data);
                showMessage('success', 'Profile updated successfully');
            } else {
                showMessage('error', response.message || 'Failed to update profile');
            }
        } catch (error) {
            console.error('Failed to update profile:', error);
            showMessage('error', 'Failed to update profile');
        } finally {
            setSaving(false);
        }
    };

    const handlePasswordSubmit = async (e) => {
        e.preventDefault();

        if (passwordData.newPassword !== passwordData.confirmPassword) {
            showMessage('error', 'New passwords do not match');
            return;
        }

        if (passwordData.newPassword.length < 6) {
            showMessage('error', 'Password must be at least 6 characters');
            return;
        }

        setSaving(true);
        try {
            const response = await customerService.changePassword(passwordData);
            if (response.success) {
                showMessage('success', 'Password changed successfully');
                setPasswordData({
                    currentPassword: '',
                    newPassword: '',
                    confirmPassword: ''
                });
            } else {
                showMessage('error', response.message || 'Failed to change password');
            }
        } catch (error) {
            console.error('Failed to change password:', error);
            showMessage('error', 'Failed to change password');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-customer-primary"></div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-white mb-2">My Profile</h1>
                <p className="text-text-secondary">Manage your personal information and security settings</p>
            </div>

            {message.text && (
                <div className={`alert ${message.type === 'success' ? 'alert-success' : 'alert-error'}`}>
                    {message.type === 'success' ? <Check size={20} /> : <X size={20} />}
                    {message.text}
                </div>
            )}

            {/* Profile Information */}
            <div className="card p-6">
                <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
                    <User size={24} className="text-customer-primary" />
                    Personal Information
                </h2>

                <form onSubmit={handleProfileSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-text-secondary mb-1">
                                Full Name
                            </label>
                            <input
                                type="text"
                                value={profileData.name}
                                onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                                className="input"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-text-secondary mb-1">
                                Email Address
                            </label>
                            <div className="relative">
                                <Mail size={18} className="absolute left-3 top-3 text-text-muted" />
                                <input
                                    type="email"
                                    value={profileData.email}
                                    onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                                    className="input pl-10"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-text-secondary mb-1">
                                Phone Number
                            </label>
                            <div className="relative">
                                <Phone size={18} className="absolute left-3 top-3 text-text-muted" />
                                <input
                                    type="tel"
                                    value={profileData.phone}
                                    onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                                    className="input pl-10"
                                    placeholder="+62 812-3456-7890"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-text-secondary mb-1">
                                Address
                            </label>
                            <div className="relative">
                                <MapPin size={18} className="absolute left-3 top-3 text-text-muted" />
                                <input
                                    type="text"
                                    value={profileData.address}
                                    onChange={(e) => setProfileData({ ...profileData, address: e.target.value })}
                                    className="input pl-10"
                                    placeholder="Jakarta, Indonesia"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end pt-4">
                        <button
                            type="submit"
                            disabled={saving}
                            className="btn btn-primary-customer inline-flex items-center gap-2"
                        >
                            <Save size={18} />
                            {saving ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </form>
            </div>

            {/* Change Password */}
            <div className="card p-6">
                <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
                    <User size={24} className="text-customer-primary" />
                    Change Password
                </h2>

                <form onSubmit={handlePasswordSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-text-secondary mb-1">
                            Current Password
                        </label>
                        <div className="relative">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                value={passwordData.currentPassword}
                                onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                                className="input pr-10"
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-3 text-text-muted hover:text-text-secondary"
                            >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-text-secondary mb-1">
                            New Password
                        </label>
                        <div className="relative">
                            <input
                                type={showNewPassword ? 'text' : 'password'}
                                value={passwordData.newPassword}
                                onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                                className="input pr-10"
                                required
                                minLength="6"
                            />
                            <button
                                type="button"
                                onClick={() => setShowNewPassword(!showNewPassword)}
                                className="absolute right-3 top-3 text-text-muted hover:text-text-secondary"
                            >
                                {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-text-secondary mb-1">
                            Confirm New Password
                        </label>
                        <input
                            type="password"
                            value={passwordData.confirmPassword}
                            onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                            className="input"
                            required
                            minLength="6"
                        />
                    </div>

                    <div className="flex justify-end pt-4">
                        <button
                            type="submit"
                            disabled={saving}
                            className="btn btn-primary-customer inline-flex items-center gap-2"
                        >
                            <Save size={18} />
                            {saving ? 'Changing...' : 'Change Password'}
                        </button>
                    </div>
                </form>
            </div>

            {/* Account Statistics */}
            <div className="card p-6">
                <h2 className="text-xl font-semibold text-white mb-6">Account Statistics</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="text-center">
                        <div className="text-3xl font-bold text-customer-primary mb-1">
                            {new Date(user?.created_at).toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })}
                        </div>
                        <div className="text-text-secondary text-sm">Member Since</div>
                    </div>
                    <div className="text-center">
                        <div className="text-3xl font-bold text-customer-primary mb-1">
                            {user?.total_reservations || 0}
                        </div>
                        <div className="text-text-secondary text-sm">Total Reservations</div>
                    </div>
                    <div className="text-center">
                        <div className="text-3xl font-bold text-customer-primary mb-1">
                            {user?.completed_reservations || 0}
                        </div>
                        <div className="text-text-secondary text-sm">Completed Games</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CustomerProfile;