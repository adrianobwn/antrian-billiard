import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import tableService from '../../services/tableService';
import { Plus, Edit2, Trash2, X, Save } from 'lucide-react';

const tableSchema = z.object({
    number: z.string().min(1, 'Table number is required'),
    capacity: z.coerce.number().min(1, 'Must have at least 1 capacity'),
    status: z.enum(['available', 'occupied', 'maintenance']),
});

const TableManagementPage = () => {
    const [tables, setTables] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [currentTable, setCurrentTable] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm({
        resolver: zodResolver(tableSchema),
        defaultValues: {
            status: 'available'
        }
    });

    const fetchTables = async () => {
        try {
            const data = await tableService.getAll();
            setTables(data);
        } catch (error) {
            console.error("Failed to load tables", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTables();
    }, []);

    const openModal = (table = null) => {
        if (table) {
            setIsEditing(true);
            setCurrentTable(table);
            setValue('number', table.number);
            setValue('capacity', table.capacity);
            setValue('status', table.status);
        } else {
            setIsEditing(false);
            setCurrentTable(null);
            reset({ status: 'available' });
        }
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        reset();
    };

    const onSubmit = async (data) => {
        try {
            if (isEditing && currentTable) {
                await tableService.update(currentTable.id, data);
            } else {
                await tableService.create(data);
            }
            fetchTables();
            closeModal();
        } catch (error) {
            console.error("Failed to save table", error);
            alert("Failed to save table");
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this table?")) {
            try {
                await tableService.delete(id);
                fetchTables();
            } catch (error) {
                console.error("Failed to delete table", error);
            }
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-white">Table Management</h1>
                <button
                    onClick={() => openModal()}
                    className="btn btn-primary-admin flex items-center gap-2"
                >
                    <Plus size={20} /> Add Table
                </button>
            </div>

            {loading ? (
                <div className="text-text-muted">Loading tables...</div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {tables.map(table => (
                        <div key={table.id} className="card p-6 flex flex-col justify-between">
                            <div>
                                <div className="flex justify-between items-start mb-4">
                                    <h3 className="text-xl font-bold text-white">Table {table.number}</h3>
                                    <span className={`badge ${table.status === 'available' ? 'badge-success' :
                                            table.status === 'occupied' ? 'badge-warning' :
                                                'badge-error'
                                        }`}>
                                        {table.status}
                                    </span>
                                </div>
                                <p className="text-text-secondary mb-2">Capacity: {table.capacity} players</p>
                            </div>

                            <div className="flex justify-end gap-2 mt-4 pt-4 border-t border-text-muted/10">
                                <button
                                    onClick={() => openModal(table)}
                                    className="p-2 text-text-muted hover:text-admin-primary transition-colors"
                                    title="Edit"
                                >
                                    <Edit2 size={18} />
                                </button>
                                <button
                                    onClick={() => handleDelete(table.id)}
                                    className="p-2 text-text-muted hover:text-status-error transition-colors"
                                    title="Delete"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-surface card p-6 w-full max-w-md animate-fadeIn">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold text-white">
                                {isEditing ? 'Edit Table' : 'Add New Table'}
                            </h2>
                            <button onClick={closeModal} className="text-text-muted hover:text-white">
                                <X size={24} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-text-secondary mb-1">Table Number</label>
                                <input
                                    {...register('number')}
                                    className="input text-white"
                                    placeholder="e.g. 05"
                                />
                                {errors.number && <p className="text-status-error text-sm mt-1">{errors.number.message}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-text-secondary mb-1">Capacity</label>
                                <input
                                    type="number"
                                    {...register('capacity')}
                                    className="input text-white"
                                />
                                {errors.capacity && <p className="text-status-error text-sm mt-1">{errors.capacity.message}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-text-secondary mb-1">Status</label>
                                <select {...register('status')} className="input text-white">
                                    <option value="available">Available</option>
                                    <option value="occupied">Occupied</option>
                                    <option value="maintenance">Maintenance</option>
                                </select>
                            </div>

                            <div className="flex justify-end gap-3 mt-6">
                                <button
                                    type="button"
                                    onClick={closeModal}
                                    className="btn btn-secondary"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="btn btn-primary-admin flex items-center gap-2"
                                >
                                    <Save size={18} /> Save
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TableManagementPage;
