<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class VReservationFull extends Model
{
    protected $table = 'v_reservation_full';

    protected $keyType = 'string';
    public $incrementing = false;

    public $timestamps = false;

    protected $fillable = [
        'reservation_id',
        'customer_id',
        'customer_name',
        'customer_email',
        'customer_phone',
        'table_id',
        'table_number',
        'table_type_name',
        'table_category',
        'table_hourly_rate',
        'reservation_time',
        'duration_hours',
        'reservation_status',
        'promo_id',
        'promo_code',
        'promo_description',
        'promo_discount_percent',
        'valid_from',
        'valid_until',
        'created_at',
        'updated_at',
    ];

    protected $casts = [
        'table_hourly_rate' => 'decimal:2',
        'reservation_time' => 'datetime',
        'valid_from' => 'datetime',
        'valid_until' => 'datetime',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];
}