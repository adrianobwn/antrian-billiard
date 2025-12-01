<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\TableType;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;

class TableTypeController extends Controller
{
    public function index()
    {
        $tableTypes = TableType::withCount('tables')->get();
        return view('admin.table-types.index', compact('tableTypes'));
    }

    public function create()
    {
        return view('admin.table-types.create');
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => ['required', 'string', 'max:100'],
            'category' => ['required', 'string', 'max:50'],
            'hourly_rate' => ['required', 'numeric', 'min:0', 'max:999999.99'],
            'description' => ['nullable', 'string', 'max:255'],
        ]);

        if ($validator->fails()) {
            return back()
                ->withErrors($validator)
                ->withInput();
        }

        TableType::create([
            'id' => (string) Str::uuid(),
            'name' => $request->name,
            'category' => $request->category,
            'hourly_rate' => $request->hourly_rate,
            'description' => $request->description,
        ]);

        return redirect()->route('admin.table-types.index')
            ->with('success', 'Table type created successfully!');
    }

    public function edit($id)
    {
        $tableType = TableType::findOrFail($id);
        return view('admin.table-types.edit', compact('tableType'));
    }

    public function update(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'name' => ['required', 'string', 'max:100'],
            'category' => ['required', 'string', 'max:50'],
            'hourly_rate' => ['required', 'numeric', 'min:0', 'max:999999.99'],
            'description' => ['nullable', 'string', 'max:255'],
        ]);

        if ($validator->fails()) {
            return back()
                ->withErrors($validator)
                ->withInput();
        }

        $tableType = TableType::findOrFail($id);
        $tableType->update($request->all());

        return redirect()->route('admin.table-types.index')
            ->with('success', 'Table type updated successfully!');
    }

    public function destroy($id)
    {
        $tableType = TableType::findOrFail($id);

        // Check if table type has tables
        if ($tableType->tables()->exists()) {
            return back()->with('error', 'Cannot delete table type that has tables assigned');
        }

        $tableType->delete();

        return redirect()->route('admin.table-types.index')
            ->with('success', 'Table type deleted successfully!');
    }
}