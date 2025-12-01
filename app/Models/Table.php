<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Table extends Model
{
    use HasFactory;

    protected $keyType = 'string';
    public $incrementing = false;

    protected $fillable = [
        'id',
        'table_number',
        'table_type_id',
        'status',
        'location',
        'managed_by_admin_id',
    ];

    public function tableType()
    {
        return $this->belongsTo(TableType::class, 'table_type_id');
    }

    public function managedBy()
    {
        return $this->belongsTo(Admin::class, 'managed_by_admin_id');
    }

    public function reservations()
    {
        return $this->hasMany(Reservation::class, 'table_id');
    }
}