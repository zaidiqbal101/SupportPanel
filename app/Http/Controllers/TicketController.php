<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\TicketForm;
use App\Models\DynamicOption;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\DB;

class TicketController extends Controller
{
    // Render the Support.jsx page
    public function support()
    {
        $tickets = TicketForm::all()->map(function ($ticket) {
            return [
                'id' => $ticket->ticket_id,
                'subject' => $ticket->subject,
                'department' => $ticket->department,
                'priority' => $ticket->priority,
                'status' => $ticket->status,
                'date' => $ticket->created_at ? $ticket->created_at->format('Y-m-d') : null,
            ];
        });
        
        // Render the Support component and pass the tickets data
        return Inertia::render('Support', [
            'tickets' => $tickets,
        ]);
    }
    
    public function TicketForm(Request $request)
{
    if ($request->isMethod('post')) {
        // Handle file upload if an attachment is provided
        $attachmentPath = null;
        if ($request->hasFile('attachments')) {
            $attachmentPath = $request->file('attachments')->store('attachments', 'public');
        }

        // Create a new ticket form record
        TicketForm::create([
            'subject' => $request->input('subject'),
            'department' => $request->input('department'),
            'priority' => $request->input('priority'),
            'service' => $request->input('service'),
            'body' => $request->input('ticketBody'),
            'attachment' => $attachmentPath,
        ]);

        // Return a response with a success message
        return redirect()->route('ticket.create')->with('success', 'Ticket created successfully!');
    }

    // Fetch all unique departments, priorities, and services from the dynamicoptions table
    $departments = DynamicOption::select('department')->distinct()->pluck('department')->filter()->toArray();
    $priorities = DynamicOption::select('priority')->distinct()->pluck('priority')->filter()->toArray();
    $services = DynamicOption::select('services')->distinct()->pluck('services')->filter()->toArray();

    // Prepare dynamic options array for the form
    $dynamicOptions = [
        'departments' => !empty($departments) ? $departments : ['IT', 'Product', 'LOAN', 'AI/ML'],
        'priorities' => !empty($priorities) ? $priorities : ['Low', 'Medium', 'High'],
        'services' => !empty($services) ? $services : ['Payment', 'Login', 'BUS', 'loan'],
    ];

    // For GET request, render the ticket form with dynamic options
    return Inertia::render('TicketForm', [
        'dynamicOptions' => $dynamicOptions,
    ]);
}

}