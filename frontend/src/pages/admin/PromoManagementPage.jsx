import React, { useState, useEffect } from 'react';
import promoService from '../../services/promoService';
import { formatCurrency, formatDateTime } from '../../utils/helpers';
import { Plus, Edit2, Trash2, Eye, Save, X, CheckCircle, AlertCircle, Tag, TrendingUp, Users, Target } from 'lucide-react';

const PromoManagement = () => {
    const [promos, setPromos] = useState([]);
    const [stats, setStats] = useState({
        totalPromos: 0,
        activePromos: 0,
        totalUses: 0,
        topPromos: []
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedPromo, setSelectedPromo] = useState(null);
    const [showInactive, setShowInactive] = useState(false);
    const [formData, setFormData] = useState({
        code: '',
        description: '',
        discount_type: 'percentage',
        discount_value: '',
        min_hours: '0',
        valid_from: '',
        valid_until: '',
        max_uses: '',
        is_active: true
    });

    useEffect(() => {
        fetchData();
    }, [showInactive]);

    const fetchData = async () => {
        try {
            const [promosData, statsData] = await Promise.all([
                promoService.getAll(showInactive),
                promoService.getStats()
            ]);
            setPromos(promosData);
            setStats(statsData);
        } catch (err) {
            console.error('Failed to fetch data:', err);
            setError('Failed to load promos data');
        } finally {
            setLoading(false);
        }
    };

    const resetForm = () => {
        setFormData({
            code: '',
            description: '',
            discount_type: 'percentage',
            discount_value: '',
            min_hours: '0',
            valid_from: '',
            valid_until: '',
            max_uses: '',
            is_active: true
        });
        setError('');
        setSuccess('');
    };

    const handleCreate = async () => {
        if (!formData.code || !formData.discount_value || !formData.valid_from || !formData.valid_until) {
            setError('Please fill in all required fields');
            return;
        }

        try {
            await promoService.create(formData);
            setSuccess('Promo created successfully');
            setShowCreateModal(false);
            resetForm();
            fetchData();
        } catch (err) {
            console.error('Failed to create promo:', err);
            setError(err.response?.data?.error?.message || 'Failed to create promo');
        }
    };

    const handleEdit = async (promo) => {
        setSelectedPromo(promo);
        setFormData({
            code: promo.code,
            description: promo.description || '',
            discount_type: promo.discount_type,
            discount_value: promo.discount_value,
            min_hours: promo.min_hours.toString(),
            valid_from: promo.valid_from.split('T')[0],
            valid_until: promo.valid_until.split('T')[0],
            max_uses: promo.max_uses || '',
            is_active: promo.is_active
        });
        setShowEditModal(true);
    };

    const handleUpdate = async () => {
        if (!formData.code || !formData.discount_value || !formData.valid_from || !formData.valid_until) {
            setError('Please fill in all required fields');
            return;
        }

        try {
            await promoService.update(selectedPromo.id, formData);
            setSuccess('Promo updated successfully');
            setShowEditModal(false);
            resetForm();
            fetchData();
        } catch (err) {
            console.error('Failed to update promo:', err);
            setError(err.response?.data?.error?.message || 'Failed to update promo');
        }
    };

    const handleDelete = async (promo) => {
        setSelectedPromo(promo);
        setShowDeleteModal(true);
    };

    const confirmDelete = async () => {
        try {
            await promoService.delete(selectedPromo.id);
            setSuccess('Promo deleted successfully');
            setShowDeleteModal(false);
            fetchData();
        } catch (err) {
            console.error('Failed to delete promo:', err);
            setError(err.response?.data?.error?.message || 'Failed to delete promo');
        }
    };

    const getUsagePercentage = (promo) => {
        if (!promo.max_uses) return 0;
        return Math.round((promo.current_uses / promo.max_uses) * 100);
    };

    const getStatusBadge = (promo) => {
        const now = new Date();
        const validFrom = new Date(promo.valid_from);
        const validUntil = new Date(promo.valid_until);

        if (!promo.is_active) {
            return <span className="badge badge-error">Inactive</span>;
        }

        if (now < validFrom) {
            return <span className="badge badge-warning">Upcoming</span>;
        }

        if (now > validUntil) {
            return <span className="badge badge-error">Expired</span>;
        }

        if (promo.max_uses && promo.current_uses >= promo.max_uses) {
            return <span className="badge badge-error">Used Up</span>;
        }

        return <span className="badge badge-success">Active</span>;
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-admin-primary"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-white">Promotions</h1>
                    <p className="text-text-secondary">Manage promotional codes and discounts</p>
                </div>
                <button
                    onClick={() => {
                        resetForm();
                        setShowCreateModal(true);
                    }}
                    className="btn btn-primary-admin inline-flex items-center gap-2"
                >
                    <Plus size={20} />
                    Add Promo
                </button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="card p-6">
                    <div className="flex items-center justify-between mb-2">
                        <h3 className="text-text-secondary text-sm font-medium">Total Promos</h3>
                        <Tag size={20} className="text-admin-primary" />
                    </div>
                    <p className="text-3xl font-bold text-white">{stats.totalPromos}</p>
                </div>
                <div className="card p-6">
                    <div className="flex items-center justify-between mb-2">
                        <h3 className="text-text-secondary text-sm font-medium">Active</h3>
                        <CheckCircle size={20} className="text-status-success" />
                    </div>
                    <p className="text-3xl font-bold text-white">{stats.activePromos}</p>
                </div>
                <div className="card p-6">
                    <div className="flex items-center justify-between mb-2">
                        <h3 className="text-text-secondary text-sm font-medium">Total Uses</h3>
                        <Users size={20} className="text-admin-accent" />
                    </div>
                    <p className="text-3xl font-bold text-white">{stats.totalUses}</p>
                </div>
                <div className="card p-6">
                    <div className="flex items-center justify-between mb-2">
                        <h3 className="text-text-secondary text-sm font-medium">Show Inactive</h3>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input
                            type="checkbox"
                            checked={showInactive}
                            onChange={(e) => setShowInactive(e.target.checked)}
                            className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-admin-primary"></div>
                    </label>
                </div>
            </div>

            {/* Top Promos */}
            {stats.topPromos && stats.topPromos.length > 0 && (
                <div className="card p-6">
                    <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                        <TrendingUp size={24} className="text-admin-primary" />
                        Top Performing Promos
                    </h2>
                    <div className="space-y-3">
                        {stats.topPromos.map((promo, index) => (
                            <div key={promo.id} className="flex items-center justify-between p-3 bg-surface-elevated rounded-lg">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 bg-admin-primary/20 rounded-full flex items-center justify-center text-admin-primary font-bold">
                                        {index + 1}
                                    </div>
                                    <div>
                                        <p className="text-white font-medium">{promo.code}</p>
                                        <p className="text-text-secondary text-sm">{promo.description}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-text-primary font-semibold">{promo.current_uses} uses</p>
                                    {promo.max_uses && (
                                        <p className="text-text-muted text-xs">{getUsagePercentage(promo)}% used</p>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Alert Messages */}
            {error && (
                <div className="alert alert-error flex items-center gap-2">
                    <AlertCircle size={20} />
                    {error}
                </div>
            )}
            {success && (
                <div className="alert alert-success flex items-center gap-2">
                    <CheckCircle size={20} />
                    {success}
                </div>
            )}

            {/* Promos List */}
            <div className="card">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="text-left text-text-secondary text-sm">
                                <th className="pb-4 font-medium">Code</th>
                                <th className="pb-4 font-medium">Description</th>
                                <th className="pb-4 font-medium">Discount</th>
                                <th className="pb-4 font-medium">Min Hours</th>
                                <th className="pb-4 font-medium">Usage</th>
                                <th className="pb-4 font-medium">Status</th>
                                <th className="pb-4 font-medium">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {promos.map((promo) => (
                                <tr key={promo.id} className="border-t border-text-muted/10">
                                    <td className="py-4">
                                        <div className="flex items-center gap-2">
                                            <Target size={16} className="text-admin-accent" />
                                            <span className="text-white font-mono font-bold">{promo.code}</span>
                                        </div>
                                    </td>
                                    <td className="py-4 text-text-secondary text-sm max-w-xs truncate">
                                        {promo.description || '-'}
                                    </td>
                                    <td className="py-4">
                                        {promo.discount_type === 'percentage' ? (
                                            <span className="text-admin-primary font-semibold">{promo.discount_value}%</span>
                                        ) : (
                                            <span className="text-admin-primary font-semibold">{formatCurrency(promo.discount_value)}</span>
                                        )}
                                    </td>
                                    <td className="py-4 text-text-secondary">{promo.min_hours}h</td>
                                    <td className="py-4">
                                        {promo.max_uses ? (
                                            <div className="flex items-center gap-2">
                                                <div className="w-16 bg-surface-elevated rounded-full h-2">
                                                    <div
                                                        className="bg-admin-primary h-2 rounded-full"
                                                        style={{ width: `${getUsagePercentage(promo)}%` }}
                                                    ></div>
                                                </div>
                                                <span className="text-text-secondary text-sm">
                                                    {promo.current_uses}/{promo.max_uses}
                                                </span>
                                            </div>
                                        ) : (
                                            <span className="text-text-secondary">{promo.current_uses} uses</span>
                                        )}
                                    </td>
                                    <td className="py-4">{getStatusBadge(promo)}</td>
                                    <td className="py-4">
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => handleEdit(promo)}
                                                className="p-1 hover:bg-surface-elevated rounded text-text-muted hover:text-text-secondary"
                                                title="Edit"
                                            >
                                                <Edit2 size={16} />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(promo)}
                                                className="p-1 hover:bg-surface-elevated rounded text-text-muted hover:text-status-error"
                                                title="Delete"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {promos.length === 0 && (
                    <div className="text-center py-12">
                        <Tag size={48} className="mx-auto text-text-muted mb-4 opacity-50" />
                        <p className="text-text-secondary">No promos found. Create your first promo to get started.</p>
                    </div>
                )}
            </div>

            {/* Create/Edit Modal */}
            {(showCreateModal || showEditModal) && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                    <div className="bg-surface rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto p-6">
                        <h2 className="text-xl font-bold text-white mb-4">
                            {showCreateModal ? 'Create Promo' : 'Edit Promo'}
                        </h2>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-text-secondary mb-1">
                                    Promo Code *
                                </label>
                                <input
                                    type="text"
                                    value={formData.code}
                                    onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                                    className="input"
                                    placeholder="e.g., WELCOME10"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-text-secondary mb-1">
                                    Description
                                </label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    className="input"
                                    rows={2}
                                    placeholder="Optional description"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-text-secondary mb-1">
                                    Discount Type *
                                </label>
                                <select
                                    value={formData.discount_type}
                                    onChange={(e) => setFormData({ ...formData, discount_type: e.target.value })}
                                    className="input"
                                >
                                    <option value="percentage">Percentage (%)</option>
                                    <option value="fixed">Fixed Amount (Rp)</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-text-secondary mb-1">
                                    Discount Value *
                                </label>
                                <input
                                    type="number"
                                    value={formData.discount_value}
                                    onChange={(e) => setFormData({ ...formData, discount_value: e.target.value })}
                                    className="input"
                                    min="0"
                                    step={formData.discount_type === 'percentage' ? '1' : '1000'}
                                    placeholder={formData.discount_type === 'percentage' ? '10' : '10000'}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-text-secondary mb-1">
                                    Minimum Hours
                                </label>
                                <input
                                    type="number"
                                    value={formData.min_hours}
                                    onChange={(e) => setFormData({ ...formData, min_hours: e.target.value })}
                                    className="input"
                                    min="0"
                                    placeholder="0"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-text-secondary mb-1">
                                    Valid From *
                                </label>
                                <input
                                    type="date"
                                    value={formData.valid_from}
                                    onChange={(e) => setFormData({ ...formData, valid_from: e.target.value })}
                                    className="input"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-text-secondary mb-1">
                                    Valid Until *
                                </label>
                                <input
                                    type="date"
                                    value={formData.valid_until}
                                    onChange={(e) => setFormData({ ...formData, valid_until: e.target.value })}
                                    className="input"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-text-secondary mb-1">
                                    Maximum Uses (optional)
                                </label>
                                <input
                                    type="number"
                                    value={formData.max_uses}
                                    onChange={(e) => setFormData({ ...formData, max_uses: e.target.value })}
                                    className="input"
                                    min="1"
                                    placeholder="Leave empty for unlimited"
                                />
                            </div>
                            <div>
                                <label className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        checked={formData.is_active}
                                        onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                                        className="rounded"
                                    />
                                    <span className="text-sm text-text-secondary">Active</span>
                                </label>
                            </div>
                        </div>
                        <div className="flex justify-end gap-3 mt-6">
                            <button
                                onClick={() => {
                                    setShowCreateModal(false);
                                    setShowEditModal(false);
                                }}
                                className="btn btn-outline"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={showCreateModal ? handleCreate : handleUpdate}
                                className="btn btn-primary-admin inline-flex items-center gap-2"
                            >
                                <Save size={16} />
                                {showCreateModal ? 'Create' : 'Update'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {showDeleteModal && selectedPromo && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                    <div className="bg-surface rounded-lg max-w-md w-full p-6">
                        <h2 className="text-xl font-bold text-white mb-4">Confirm Delete</h2>
                        <p className="text-text-secondary mb-6">
                            Are you sure you want to delete the promo "{selectedPromo.code}"? This action cannot be undone.
                        </p>
                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => setShowDeleteModal(false)}
                                className="btn btn-outline"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmDelete}
                                className="btn btn-danger inline-flex items-center gap-2"
                            >
                                <Trash2 size={16} />
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PromoManagement;