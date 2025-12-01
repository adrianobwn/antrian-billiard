<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Promo extends Model
{
    use HasFactory;

    protected $keyType = 'string';
    public $incrementing = false;

    protected $fillable = [
        'id',
        'code',
        'description',
        'discount_percent',
        'valid_from',
        'valid_until',
        'managed_by_admin_id',
    ];

    protected $casts = [
        'valid_from' => 'datetime',
        'valid_until' => 'datetime',
    ];

    public function managedBy()
    {
        return $this->belongsTo(Admin::class, 'managed_by_admin_id');
    }

    public function reservations()
    {
        return $this->hasMany(Reservation::class, 'promo_id');
    }

    public function isValid()
    {
        return now()->between($this->valid_from, $this->valid_until);
    }
}