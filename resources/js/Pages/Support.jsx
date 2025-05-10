import React, { useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Search, Filter } from 'lucide-react';
import { Link } from '@inertiajs/react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import Navbar from '@/Components/Navbar';

function Support({ tickets: initialTickets = [] }) {
  const [statusFilter, setStatusFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [tickets] = useState(initialTickets);
  const [messageDialog, setMessageDialog] = useState({
    open: false,
    ticketId: null,
    message: '',
  });

  // Map backend status values to display values
  const statusMap = {
    pending: 'Open',
    canceled: 'In Progress',
    complete: 'Closed',
  };
  const statusOptions = ['All', 'Open', 'In Progress', 'Closed'];

  // Filter tickets based on status and search query
  const filteredTickets = tickets.filter((ticket) => {
    try {
      const ticketId = ticket?.id?.toString() || '';
      const subject = ticket?.subject?.toString() || '';
      const department = ticket?.department?.toString() || '';
      const status = statusMap[ticket?.status?.toString()] || ticket?.status?.toString() || '';

      const matchesStatus = statusFilter === 'All' || status === statusFilter;
      const matchesSearch =
        ticketId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
        department.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesStatus && matchesSearch;
    } catch (error) {
      console.error('Error filtering ticket:', ticket, error);
      return false;
    }
  });

  const handleViewMessage = (ticketId, message) => {
    setMessageDialog({
      open: true,
      ticketId,
      message: message || 'No message',
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100">
      <Navbar />
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
      <main className="max-w-6xl mx-auto px-6 py-12">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Tickets</h1>
          <Link
            href="/TicketForm"
            className="bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-600 transition duration-200"
          >
            + New Ticket
          </Link>
        </div>

        {/* Filters and Search */}
        <div className="bg-white shadow-lg rounded-xl p-6 mb-6 border border-gray-100">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="relative flex-grow">
              <Search
                size={20}
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                placeholder="Search by ticket ID, subject, or department..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
              />
            </div>
            <div className="relative w-full sm:w-48">
              <select
                id="status"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full bg-white border border-gray-200 rounded-lg shadow-sm px-4 py-3 text-left focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 appearance-none"
              >
                {statusOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
              <Filter
                size={20}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none"
              />
            </div>
          </div>
        </div>

        {/* Tickets Table */}
        <div className="bg-white shadow-lg rounded-xl border border-gray-100 overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ticket ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Subject
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Department
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Priority
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Message
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Chat
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredTickets.length > 0 ? (
                filteredTickets.map((ticket) => (
                  <tr key={ticket.id} className="hover:bg-gray-50 transition duration-200">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">
                      <Link href={`/ticket/${ticket.id}`}>{ticket.id}</Link>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {ticket.subject || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {ticket.department || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span
                        className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          ticket.priority === 'High'
                            ? 'bg-red-100 text-red-800'
                            : ticket.priority === 'Medium'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-green-100 text-green-800'
                        }`}
                      >
                        {ticket.priority || 'N/A'}
                      </span>
                    </td>
                    <td className= {(ticket.status === 'pending' || ticket.status === 'canceled') ? "px-6 py-4 whitespace-nowrap text-sm text-red-500" : "px-6 py-4 whitespace-nowrap text-sm text-green-500"}>
                      {ticket.status}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <Button
                        variant="link"
                        className="text-blue-600 hover:text-blue-800"
                        onClick={() => handleViewMessage(ticket.id, ticket.message)}
                      >
                        View
                      </Button>
                    </td>
                    <td className="py-3 px-6 border-b text-gray-700"><a href={`/messages`}>Chat</a></td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {ticket.date ? new Date(ticket.date).toLocaleString() : 'N/A'}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-6 py-4 text-center text-sm text-gray-500">
                    No tickets found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Message View Dialog */}
        <Dialog
          open={messageDialog.open}
          onOpenChange={(open) =>
            setMessageDialog({ ...messageDialog, open, message: open ? messageDialog.message : '' })
          }
        >
          <DialogContent className="sm:max-w-[500px] rounded-lg">
            <DialogHeader>
              <DialogTitle className="text-xl font-semibold text-gray-800">
                Ticket Message
              </DialogTitle>
            </DialogHeader>
            <div className="py-4">
              <p className="text-sm text-gray-600">{messageDialog.message}</p>
            </div>
            <DialogFooter className="sm:justify-end">
              <Button
                variant="secondary"
                className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-300 transition"
                onClick={() =>
                  setMessageDialog({ open: false, ticketId: null, message: '' })
                }
              >
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
}

export default Support;