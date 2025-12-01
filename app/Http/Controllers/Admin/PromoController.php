<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Promo;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;

class PromoController extends Controller
{
    public function index()
    {
        $promos = Promo::with('managedBy')->get();
        return view('admin.promos.index', compact('promos'));
    }

    public function create()
    {
        return view('admin.promos.create');
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'code' => ['required', 'string', 'max:20', 'unique:promos'],
            'description' => ['nullable', 'string', 'max:255'],
            'discount_percent' => ['required', 'integer', 'between:1,100'],
            'valid_from' => ['required', 'date', 'after_or_equal:today'],
            'valid_until' => ['required', 'date', 'after:valid_from'],
        ]);

        if ($validator->fails()) {
            return back()
                ->withErrors($validator)
                ->withInput();
        }

        Promo::create([
            'id' => (string) Str::uuid(),
            'code' => strtoupper($request->code),
            'description' => $request->description,
            'discount_percent' => $request->discount_percent,
            'valid_from' => $request->valid_from,
            'valid_until' => $request->valid_until,
            'managed_by_admin_id' => Auth::guard('admin')->id(),
        ]);

        return redirect()->route('admin.promos.index')
            ->with('success', 'Promo created successfully!');
    }

    public function edit($id)
    {
        $promo = Promo::findOrFail($id);
        return view('admin.promos.edit', compact('promo'));
    }

    public function update(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'code' => ['required', 'string', 'max:20', 'unique:promos,code,' . $id],
            'description' => ['nullable', 'string', 'max:255'],
            'discount_percent' => ['required', 'integer', 'between:1,100'],
            'valid_from' => ['required', 'date'],
            'valid_until' => ['required', 'date', 'after:valid_from'],
        ]);

        if ($validator->fails()) {
            return back()
                ->withErrors($validator)
                ->withInput();
        }

        $promo = Promo::findOrFail($id);
        $promo->update([
            'code' => strtoupper($request->code),
            'description' => $request->description,
            'discount_percent' => $request->discount_percent,
            'valid_from' => $request->valid_from,
            'valid_until' => $request->valid_until,
        ]);

        return redirect()->route('admin.promos.index')
            ->with('success', 'Promo updated successfully!');
    }

    public function destroy($id)
    {
        $promo = Promo::findOrFail($id);

        // Check if promo is used in active reservations
        if ($promo->reservations()->where('status', '!=', 'cancelled')->exists()) {
            return back()->with('error', 'Cannot delete promo with active reservations');
        }

        $promo->delete();

        return redirect()->route('admin.promos.index')
            ->with('success', 'Promo deleted successfully!');
    }
}