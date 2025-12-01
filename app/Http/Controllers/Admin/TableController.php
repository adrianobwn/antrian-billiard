<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Table;
use App\Models\TableType;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;

class TableController extends Controller
{
    public function index()
    {
        $tables = Table::with(['tableType', 'managedBy'])->get();
        return view('admin.tables.index', compact('tables'));
    }

    public function create()
    {
        $tableTypes = TableType::all();
        return view('admin.tables.create', compact('tableTypes'));
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'table_number' => ['required', 'string', 'max:50', 'unique:tables'],
            'table_type_id' => ['required', 'exists:table_types,id'],
            'status' => ['required', 'string', 'in:available,maintenance,reserved'],
            'location' => ['required', 'string', 'max:100'],
        ]);

        if ($validator->fails()) {
            return back()
                ->withErrors($validator)
                ->withInput();
        }

        Table::create([
            'id' => (string) Str::uuid(),
            'table_number' => $request->table_number,
            'table_type_id' => $request->table_type_id,
            'status' => $request->status,
            'location' => $request->location,
            'managed_by_admin_id' => Auth::guard('admin')->id(),
        ]);

        return redirect()->route('admin.tables.index')
            ->with('success', 'Table created successfully!');
    }

    public function edit($id)
    {
        $table = Table::findOrFail($id);
        $tableTypes = TableType::all();
        return view('admin.tables.edit', compact('table', 'tableTypes'));
    }

    public function update(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'table_number' => ['required', 'string', 'max:50', 'unique:tables,table_number,' . $id],
            'table_type_id' => ['required', 'exists:table_types,id'],
            'status' => ['required', 'string', 'in:available,maintenance,reserved'],
            'location' => ['required', 'string', 'max:100'],
        ]);

        if ($validator->fails()) {
            return back()
                ->withErrors($validator)
                ->withInput();
        }

        $table = Table::findOrFail($id);
        $table->update($request->all());

        return redirect()->route('admin.tables.index')
            ->with('success', 'Table updated successfully!');
    }

    public function destroy($id)
    {
        $table = Table::findOrFail($id);

        // Check if table has active reservations
        if ($table->reservations()->where('status', '!=', 'cancelled')->exists()) {
            return back()->with('error', 'Cannot delete table with active reservations');
        }

        $table->delete();

        return redirect()->route('admin.tables.index')
            ->with('success', 'Table deleted successfully!');
    }
}