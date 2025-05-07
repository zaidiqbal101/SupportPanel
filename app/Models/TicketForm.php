<?php
// app/Models/TicketForm.php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TicketForm extends Model
{
    protected $table = 'ticket_forms';
    protected $fillable = [
        'ticket_id', 
        'subject', 
        'department', 
        'priority', 
        'service',
        'body',      // Added body field
        'attachment', // Added attachment field
        'status', 
        'date'
    ];
    
    protected $casts = [
        'date' => 'date',
    ];
}