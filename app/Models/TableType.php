<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TableType extends Model
{
    use HasFactory;

    protected $keyType = 'string';
    public $incrementing = false;

    protected $fillable = [
        'id',
        'name',
        'category',
        'hourly_rate',
        'description',
    ];

    protected $casts = [
        'hourly_rate' => 'decimal:2',
    ];

    public function tables()
    {
        return $this->hasMany(Table::class, 'table_type_id');
    }
}