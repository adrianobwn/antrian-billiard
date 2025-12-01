@extends('layouts.app')

@section('title', 'Create Table - Admin')

@section('content')
<div class="max-w-2xl mx-auto">
    <div class="bg-white shadow rounded-lg">
        <div class="px-6 py-4 border-b border-gray-200">
            <h1 class="text-xl font-bold text-gray-900">Create New Table</h1>
        </div>

        <form action="{{ route('admin.tables.store') }}" method="POST" class="p-6">
            @csrf

            <div class="space-y-6">
                <!-- Table Number -->
                <div>
                    <label for="table_number" class="block text-sm font-medium text-gray-700">
                        Table Number
                    </label>
                    <input type="text" id="table_number" name="table_number" required
                           value="{{ old('table_number') }}"
                           class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
                    @error('table_number')
                        <p class="mt-1 text-sm text-red-600">{{ $message }}</p>
                    @enderror
                </div>

                <!-- Table Type -->
                <div>
                    <label for="table_type_id" class="block text-sm font-medium text-gray-700">
                        Table Type
                    </label>
                    <select id="table_type_id" name="table_type_id" required
                            class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
                        <option value="">Select a table type</option>
                        @foreach($tableTypes as $tableType)
                            <option value="{{ $tableType->id }}" {{ old('table_type_id') == $tableType->id ? 'selected' : '' }}>
                                {{ $tableType->name }} ({{ $tableType->category }}) - ${{ number_format($tableType->hourly_rate, 2) }}/hour
                            </option>
                        @endforeach
                    </select>
                    @error('table_type_id')
                        <p class="mt-1 text-sm text-red-600">{{ $message }}</p>
                    @enderror
                </div>

                <!-- Status -->
                <div>
                    <label for="status" class="block text-sm font-medium text-gray-700">
                        Status
                    </label>
                    <select id="status" name="status" required
                            class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
                        <option value="available" {{ old('status') === 'available' ? 'selected' : '' }}>Available</option>
                        <option value="maintenance" {{ old('status') === 'maintenance' ? 'selected' : '' }}>Maintenance</option>
                        <option value="reserved" {{ old('status') === 'reserved' ? 'selected' : '' }}>Reserved</option>
                    </select>
                    @error('status')
                        <p class="mt-1 text-sm text-red-600">{{ $message }}</p>
                    @enderror
                </div>

                <!-- Location -->
                <div>
                    <label for="location" class="block text-sm font-medium text-gray-700">
                        Location
                    </label>
                    <input type="text" id="location" name="location" required
                           value="{{ old('location') }}"
                           placeholder="e.g., Ground Floor, VIP Room"
                           class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
                    @error('location')
                        <p class="mt-1 text-sm text-red-600">{{ $message }}</p>
                    @enderror
                </div>
            </div>

            <!-- Action Buttons -->
            <div class="mt-8 flex justify-end space-x-3">
                <a href="{{ route('admin.tables.index') }}"
                   class="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                    Cancel
                </a>
                <button type="submit"
                        class="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                    Create Table
                </button>
            </div>
        </form>
    </div>
</div>
@endsection