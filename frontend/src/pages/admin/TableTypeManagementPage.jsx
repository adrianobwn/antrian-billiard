import React, { useState, useEffect } from 'react';
import tableTypeService from '../../services/tableTypeService';
import { formatCurrency } from '../../utils/helpers';
import { Plus, Edit2, Trash2, Eye, Save, X, CheckCircle, AlertCircle } from 'lucide-react';

const TableTypeManagement = () => {
    const [tableTypes, setTableTypes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedTableType, setSelectedTableType] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        hourly_rate: '',
        description: '',
        color: '#00a859',
        icon: 'table'
    });

    useEffect(() => {
        fetchTableTypes();
    }, []);

    const fetchTableTypes = async () => {
        try {
            const data = await tableTypeService.getAll();
            setTableTypes(data);
        } catch (err) {
            console.error('Failed to fetch table types:', err);
            setError('Failed to load table types');
        } finally {
            setLoading(false);
        }
    };

    const resetForm = () => {
        setFormData({
            name: '',
            hourly_rate: '',
            description: '',
            color: '#00a859',
            icon: 'table'
        });
        setError('');
        setSuccess('');
    };

    const handleCreate = async () => {
        if (!formData.name || !formData.hourly_rate) {
            setError('Please fill in all required fields');
            return;
        }

        try {
            await tableTypeService.create(formData);
            setSuccess('Table type created successfully');
            setShowCreateModal(false);
            resetForm();
            fetchTableTypes();
        } catch (err) {
            console.error('Failed to create table type:', err);
            setError(err.response?.data?.error?.message || 'Failed to create table type');
        }
    };

    const handleEdit = async (tableType) => {
        setSelectedTableType(tableType);
        setFormData({
            name: tableType.name,
            hourly_rate: tableType.hourly_rate,
            description: tableType.description || '',
            color: tableType.color,
            icon: tableType.icon
        });
        setShowEditModal(true);
    };

    const handleUpdate = async () => {
        if (!formData.name || !formData.hourly_rate) {
            setError('Please fill in all required fields');
            return;
        }

        try {
            await tableTypeService.update(selectedTableType.id, formData);
            setSuccess('Table type updated successfully');
            setShowEditModal(false);
            resetForm();
            fetchTableTypes();
        } catch (err) {
            console.error('Failed to update table type:', err);
            setError(err.response?.data?.error?.message || 'Failed to update table type');
        }
    };

    const handleDelete = async (tableType) => {
        setSelectedTableType(tableType);
        setShowDeleteModal(true);
    };

    const confirmDelete = async () => {
        try {
            await tableTypeService.delete(selectedTableType.id);
            setSuccess('Table type deleted successfully');
            setShowDeleteModal(false);
            fetchTableTypes();
        } catch (err) {
            console.error('Failed to delete table type:', err);
            setError(err.response?.data?.error?.message || 'Failed to delete table type');
        }
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
                    <h1 className="text-3xl font-bold text-white">Table Types</h1>
                    <p className="text-text-secondary">Manage different types of billiard tables</p>
                </div>
                <button
                    onClick={() => {
                        resetForm();
                        setShowCreateModal(true);
                    }}
                    className="btn btn-primary-admin inline-flex items-center gap-2"
                >
                    <Plus size={20} />
                    Add Table Type
                </button>
            </div>

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

            {/* Table Types List */}
            <div className="card">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="text-left text-text-secondary text-sm">
                                <th className="pb-4 font-medium">Type Name</th>
                                <th className="pb-4 font-medium">Hourly Rate</th>
                                <th className="pb-4 font-medium">Description</th>
                                <th className="pb-4 font-medium">Color</th>
                                <th className="pb-4 font-medium">Status</th>
                                <th className="pb-4 font-medium">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {tableTypes.map((type) => (
                                <tr key={type.id} className="border-t border-text-muted/10">
                                    <td className="py-4">
                                        <div className="flex items-center gap-3">
                                            <div
                                                className="w-4 h-4 rounded"
                                                style={{ backgroundColor: type.color }}
                                            ></div>
                                            <span className="text-white font-medium">{type.name}</span>
                                        </div>
                                    </td>
                                    <td className="py-4 text-text-primary font-medium">
                                        {formatCurrency(type.hourly_rate)}
                                    </td>
                                    <td className="py-4 text-text-secondary text-sm max-w-xs truncate">
                                        {type.description || '-'}
                                    </td>
                                    <td className="py-4">
                                        <div className="flex items-center gap-2">
                                            <div
                                                className="w-6 h-6 rounded border border-text-muted/20"
                                                style={{ backgroundColor: type.color }}
                                            ></div>
                                            <span className="text-text-secondary text-xs">{type.color}</span>
                                        </div>
                                    </td>
                                    <td className="py-4">
                                        <span className={`badge ${type.is_active ? 'badge-success' : 'badge-error'}`}>
                                            {type.is_active ? 'Active' : 'Inactive'}
                                        </span>
                                    </td>
                                    <td className="py-4">
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => handleEdit(type)}
                                                className="p-1 hover:bg-surface-elevated rounded text-text-muted hover:text-text-secondary"
                                                title="Edit"
                                            >
                                                <Edit2 size={16} />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(type)}
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

                {tableTypes.length === 0 && (
                    <div className="text-center py-12">
                        <p className="text-text-secondary">No table types found. Create your first table type to get started.</p>
                    </div>
                )}
            </div>

            {/* Create Modal */}
            {showCreateModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                    <div className="bg-surface rounded-lg max-w-md w-full p-6">
                        <h2 className="text-xl font-bold text-white mb-4">Create Table Type</h2>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-text-secondary mb-1">
                                    Type Name *
                                </label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="input"
                                    placeholder="e.g., Standard, VIP, VVIP"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-text-secondary mb-1">
                                    Hourly Rate (Rp) *
                                </label>
                                <input
                                    type="number"
                                    value={formData.hourly_rate}
                                    onChange={(e) => setFormData({ ...formData, hourly_rate: e.target.value })}
                                    className="input"
                                    placeholder="50000"
                                    min="0"
                                    step="1000"
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
                                    rows={3}
                                    placeholder="Optional description"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-text-secondary mb-1">
                                    Color
                                </label>
                                <div className="flex items-center gap-3">
                                    <input
                                        type="color"
                                        value={formData.color}
                                        onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                                        className="h-10 w-20"
                                    />
                                    <input
                                        type="text"
                                        value={formData.color}
                                        onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                                        className="input flex-1"
                                        placeholder="#00a859"
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="flex justify-end gap-3 mt-6">
                            <button
                                onClick={() => setShowCreateModal(false)}
                                className="btn btn-outline"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleCreate}
                                className="btn btn-primary-admin inline-flex items-center gap-2"
                            >
                                <Save size={16} />
                                Create
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Edit Modal */}
            {showEditModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                    <div className="bg-surface rounded-lg max-w-md w-full p-6">
                        <h2 className="text-xl font-bold text-white mb-4">Edit Table Type</h2>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-text-secondary mb-1">
                                    Type Name *
                                </label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="input"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-text-secondary mb-1">
                                    Hourly Rate (Rp) *
                                </label>
                                <input
                                    type="number"
                                    value={formData.hourly_rate}
                                    onChange={(e) => setFormData({ ...formData, hourly_rate: e.target.value })}
                                    className="input"
                                    min="0"
                                    step="1000"
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
                                    rows={3}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-text-secondary mb-1">
                                    Color
                                </label>
                                <div className="flex items-center gap-3">
                                    <input
                                        type="color"
                                        value={formData.color}
                                        onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                                        className="h-10 w-20"
                                    />
                                    <input
                                        type="text"
                                        value={formData.color}
                                        onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                                        className="input flex-1"
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="flex justify-end gap-3 mt-6">
                            <button
                                onClick={() => setShowEditModal(false)}
                                className="btn btn-outline"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleUpdate}
                                className="btn btn-primary-admin inline-flex items-center gap-2"
                            >
                                <Save size={16} />
                                Update
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {showDeleteModal && selectedTableType && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                    <div className="bg-surface rounded-lg max-w-md w-full p-6">
                        <h2 className="text-xl font-bold text-white mb-4">Confirm Delete</h2>
                        <p className="text-text-secondary mb-6">
                            Are you sure you want to delete the table type "{selectedTableType.name}"? This action cannot be undone.
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

export default TableTypeManagement;