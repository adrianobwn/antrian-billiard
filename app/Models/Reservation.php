<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Reservation extends Model
{
    use HasFactory;

    protected $keyType = 'string';
    public $incrementing = false;

    protected $fillable = [
        'id',
        'customer_id',
        'table_id',
        'reservation_time',
        'duration_hours',
        'status',
        'promo_id',
    ];

    protected $casts = [
        'reservation_time' => 'datetime',
        'duration_hours' => 'integer',
    ];

    public function customer()
    {
        return $this->belongsTo(Customer::class, 'customer_id');
    }

    public function table()
    {
        return $this->belongsTo(Table::class, 'table_id');
    }

    public function promo()
    {
        return $this->belongsTo(Promo::class, 'promo_id');
    }

    public function payment()
    {
        return $this->hasOne(Payment::class, 'reservation_id');
    }

    public function calculateCost()
    {
        // Load relations if not already loaded
        if (!$this->relationLoaded('table')) {
            $this->load('table.tableType');
        } elseif ($this->table && !$this->table->relationLoaded('tableType')) {
            $this->table->load('tableType');
        }

        // Check if table and tableType exist
        if (!$this->table || !$this->table->tableType) {
            return 0;
        }

        $baseCost = $this->table->tableType->hourly_rate * $this->duration_hours;

        if ($this->promo_id) {
            if (!$this->relationLoaded('promo')) {
                $this->load('promo');
            }
            
            if ($this->promo && $this->promo->isValid()) {
                $discount = $baseCost * ($this->promo->discount_percent / 100);
                return $baseCost - $discount;
            }
        }

        return $baseCost;
    }

    public function checkOverlap($startTime, $durationHours)
    {
        $endTime = $startTime->copy()->addHours($durationHours);
        $reservationEndTime = $this->reservation_time->copy()->addHours($this->duration_hours);

        return $startTime < $reservationEndTime && $this->reservation_time < $endTime;
    }
}