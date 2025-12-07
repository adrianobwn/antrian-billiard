import React, { useState, useEffect } from 'react';
import tableTypeService from '../../services/tableTypeService';
import { formatCurrency } from '../../utils/helpers';
import { Plus, Edit2, Trash2, Eye, Save, X, CheckCircle, AlertCircle, Power } from 'lucide-react';

const TableTypeManagement = () => {
    const [tableTypes, setTableTypes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    // Format number with dots (Indonesian style)
    const formatNumberWithDots = (value) => {
        // Remove any decimal portion and non-digit characters first
        const cleanValue = String(value).replace(/[^\d]/g, '');
        return cleanValue.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    };

    // Handle hourly rate input with formatting
    const handleHourlyRateChange = (e) => {
        let value = e.target.value;

        // Remove all non-digit characters
        value = value.replace(/[^\d]/g, '');

        // Format with dots
        if (value) {
            value = formatNumberWithDots(value);
        }

        setFormData({ ...formData, hourly_rate: value });
    };
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

        // Remove dots from hourly_rate before sending
        const submitData = {
            ...formData,
            hourly_rate: parseInt(formData.hourly_rate.replace(/\./g, '')) || 0
        };

        try {
            await tableTypeService.create(submitData);
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
        // Parse hourly_rate as integer to handle decimal values from database
        const hourlyRateValue = Math.floor(parseFloat(tableType.hourly_rate) || 0);
        setFormData({
            name: tableType.name,
            hourly_rate: formatNumberWithDots(hourlyRateValue.toString()),
            description: tableType.description || '',
            color: tableType.color || '#00a859',
            icon: tableType.icon || 'table'
        });
        setShowEditModal(true);
    };

    const handleUpdate = async () => {
        if (!formData.name || !formData.hourly_rate) {
            setError('Please fill in all required fields');
            return;
        }

        // Remove dots from hourly_rate before sending
        const submitData = {
            ...formData,
            hourly_rate: parseInt(formData.hourly_rate.replace(/\./g, '')) || 0
        };

        try {
            await tableTypeService.update(selectedTableType.id, submitData);
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
            const errorMessage = err.response?.data?.error?.message || err.message || 'Failed to delete table type';
            setShowDeleteModal(false);
            if (errorMessage.includes('associated tables') || errorMessage.includes('Cannot delete')) {
                setError(`Cannot delete this table type because it has associated tables. You can deactivate it instead.`);
            } else {
                setError(errorMessage);
            }
        }
    };

    const handleToggleActive = async (tableType) => {
        try {
            await tableTypeService.update(tableType.id, { is_active: !tableType.is_active });
            setSuccess(`Table type ${tableType.is_active ? 'deactivated' : 'activated'} successfully`);
            fetchTableTypes();
        } catch (err) {
            console.error('Failed to toggle table type status:', err);
            setError(err.response?.data?.error?.message || 'Failed to update table type status');
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
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white">Table Types</h1>
                    <p className="text-text-secondary">Manage different types of billiard tables and their pricing</p>
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
                <div className="alert alert-error">
                    <div className="flex items-center justify-between w-full">
                        <div className="flex items-center gap-2">
                            <AlertCircle size={20} />
                            <span>{error}</span>
                        </div>
                        {error.includes('deactivate') && selectedTableType && (
                            <button
                                onClick={() => {
                                    handleToggleActive(selectedTableType);
                                    setError('');
                                }}
                                className="btn btn-outline text-sm px-3 py-1 ml-4"
                            >
                                <Power size={14} className="mr-1" />
                                Deactivate Instead
                            </button>
                        )}
                    </div>
                </div>
            )}
            {success && (
                <div className="alert alert-success flex items-center gap-2">
                    <CheckCircle size={20} />
                    {success}
                </div>
            )}

            {/* Table Types List */}
            <div className="card p-6">
                <div className="mb-4">
                    <h3 className="text-lg font-semibold text-white mb-2">Active Table Types</h3>
                    <p className="text-text-secondary text-sm">Each table type has its own hourly rate and color coding for easy identification</p>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="text-left text-text-secondary text-sm border-b border-text-muted/20">
                                <th className="pb-4 pl-6 font-medium">Type Name</th>
                                <th className="pb-4 font-medium">Hourly Rate</th>
                                <th className="pb-4 font-medium">Description</th>
                                <th className="pb-4 font-medium">Color</th>
                                <th className="pb-4 font-medium">Status</th>
                                <th className="pb-4 pr-6 font-medium">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {tableTypes.map((type) => (
                                <tr key={type.id} className="border-b border-text-muted/10 hover:bg-surface-elevated/30 transition-colors">
                                    <td className="py-4 pl-6">
                                        <div className="flex items-center gap-3">
                                            <div
                                                className="w-4 h-4 rounded-full border-2 border-white/20"
                                                style={{ backgroundColor: type.color }}
                                            ></div>
                                            <span className="text-white font-medium">{type.name}</span>
                                        </div>
                                    </td>
                                    <td className="py-4">
                                        <span className="text-text-primary font-semibold text-lg">
                                            {formatCurrency(type.hourly_rate)}
                                        </span>
                                        <span className="text-text-muted text-xs block">/hour</span>
                                    </td>
                                    <td className="py-4">
                                        <p className="text-text-secondary text-sm max-w-xs">
                                            {type.description || <span className="text-text-muted italic">No description</span>}
                                        </p>
                                    </td>
                                    <td className="py-4">
                                        <div
                                            className="w-8 h-8 rounded-lg border-2 border-text-muted/20 shadow-sm"
                                            style={{ backgroundColor: type.color }}
                                            title={type.color}
                                        ></div>
                                    </td>
                                    <td className="py-4">
                                        <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${type.is_active ? 'bg-status-success/20 text-status-success' : 'bg-status-error/20 text-status-error'}`}>
                                            {type.is_active ? 'Active' : 'Inactive'}
                                        </span>
                                    </td>
                                    <td className="py-4 pr-6">
                                        <div className="flex items-center gap-1">
                                            <button
                                                onClick={() => handleEdit(type)}
                                                className="p-2 hover:bg-surface-elevated rounded-lg text-text-muted hover:text-text-secondary transition-colors"
                                                title="Edit table type"
                                            >
                                                <Edit2 size={16} />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(type)}
                                                className="p-2 hover:bg-surface-elevated rounded-lg text-text-muted hover:text-status-error transition-colors"
                                                title="Delete table type"
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
                        <div className="w-16 h-16 bg-surface-elevated rounded-full flex items-center justify-center mx-auto mb-4">
                            <Edit2 size={24} className="text-text-muted" />
                        </div>
                        <p className="text-text-secondary mb-2">No table types found</p>
                        <p className="text-text-muted text-sm">Create your first table type to get started with managing your billiard tables</p>
                    </div>
                )}
            </div>

            {/* Create Modal */}
            {showCreateModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                    <div className="bg-surface rounded-lg max-w-lg w-full p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold text-white">Create New Table Type</h2>
                            <button
                                onClick={() => setShowCreateModal(false)}
                                className="p-2 hover:bg-surface-elevated rounded-lg transition-colors"
                            >
                                <X size={20} className="text-text-muted" />
                            </button>
                        </div>

                        {error && (
                            <div className="alert alert-error mb-4">
                                <AlertCircle size={20} />
                                {error}
                            </div>
                        )}

                        <div className="space-y-5">
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-text-secondary">
                                    Table Type Name <span className="text-status-error">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="input"
                                    placeholder="e.g., Standard, VIP, VVIP"
                                    autoFocus
                                />
                                <p className="text-text-muted text-xs">Choose a descriptive name for this table type</p>
                            </div>

                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-text-secondary">
                                    Hourly Rate <span className="text-status-error">*</span>
                                </label>
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-muted text-sm font-medium">
                                        Rp
                                    </span>
                                    <input
                                        type="text"
                                        value={formData.hourly_rate}
                                        onChange={handleHourlyRateChange}
                                        className="input !pl-14 pr-4"
                                        placeholder="50.000"
                                    />
                                </div>
                                <p className="text-text-muted text-xs">Enter hourly rate in Rupiah (e.g., 50000 for Rp 50,000)</p>
                            </div>

                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-text-secondary">
                                    Description
                                </label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    className="input resize-none"
                                    rows={3}
                                    placeholder="Optional description of this table type..."
                                />
                                <p className="text-text-muted text-xs">Describe the features or benefits of this table type</p>
                            </div>

                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-text-secondary">
                                    Identification Color
                                </label>
                                <div className="flex items-center gap-4">
                                    <div className="flex-shrink-0">
                                        <input
                                            type="color"
                                            value={formData.color}
                                            onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                                            className="h-12 w-20 rounded-lg cursor-pointer border border-text-muted/20"
                                        />
                                    </div>
                                    <div className="flex-1">
                                        <input
                                            type="text"
                                            value={formData.color}
                                            onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                                            className="input"
                                            placeholder="#00a859"
                                        />
                                    </div>
                                </div>
                                <p className="text-text-muted text-xs">This color helps identify tables of this type in the dashboard</p>
                            </div>
                        </div>

                        <div className="flex justify-end gap-3 mt-8">
                            <button
                                onClick={() => {
                                    setShowCreateModal(false);
                                    setError('');
                                }}
                                className="btn btn-outline px-6"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleCreate}
                                className="btn btn-primary-admin inline-flex items-center gap-2 px-6"
                            >
                                <Save size={16} />
                                Create Table Type
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
                                    Hourly Rate *
                                </label>
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-muted text-sm font-medium">
                                        Rp
                                    </span>
                                    <input
                                        type="text"
                                        value={formData.hourly_rate}
                                        onChange={handleHourlyRateChange}
                                        className="input !pl-14"
                                        placeholder="50.000"
                                    />
                                </div>
                                <p className="text-text-muted text-xs mt-1">Enter amount in Rupiah</p>
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