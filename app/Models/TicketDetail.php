<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TicketDetail extends Model
{
    protected $fillable = [
        'ticket_id',
        'subject',
        'department',
        'priority',
        'status',
        'date',
    ];
}