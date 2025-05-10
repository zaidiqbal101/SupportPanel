import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import axios from 'axios';

function TicketForm({ dynamicOptions }) {
  const [priority, setPriority] = useState(dynamicOptions.priorities[0] || 'Medium');
  const [department, setDepartment] = useState('');
  const [service, setService] = useState('');
  const [formData, setFormData] = useState({
    subject: '',
    ticketBody: '',
    attachments: null,
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Create FormData object for file upload
    const data = new FormData();
    data.append('subject', formData.subject);
    data.append('department', department);
    data.append('priority', priority);
    data.append('service', service);
    data.append('ticketBody', formData.ticketBody);
    
    if (formData.attachments) {
      data.append('attachments', formData.attachments);
    }
    
    try {
      // Send the form data directly without wrapping it in another object
      const response = await axios.post('/TicketForm', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content'),
        },
      });
      
      console.log('Submission successful:', response.data);
      // Redirect or show success message
      window.location.href = '/support';
    } catch (error) {
      console.error('Submission error:', error);
      if (error.response && error.response.data && error.response.data.errors) {
        setErrors(error.response.data.errors);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, attachments: e.target.files[0] });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100">
      <main className="max-w-3xl mx-auto px-6 py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Open Ticket</h1>
        
        <div className="bg-white shadow-lg rounded-xl p-8 border border-gray-100">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Subject */}
            <div>
              <label htmlFor="subject" className="block text-sm font-semibold text-gray-700 mb-2">
                Subject
              </label>
              <input
                type="text"
                id="subject"
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                className={`w-full px-4 py-3 border ${errors.subject ? 'border-red-500' : 'border-gray-200'} rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200`}
              />
              {errors.subject && (
                <p className="text-red-500 text-sm mt-1">{errors.subject[0]}</p>
              )}
            </div>

            {/* Department and Priority */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label htmlFor="department" className="block text-sm font-semibold text-gray-700 mb-2">
                  Department
                </label>
                <div className="relative">
                  <select
                    id="department"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className={`w-full bg-white border ${errors.department ? 'border-red-500' : 'border-gray-200'} rounded-lg shadow-sm px-4 py-3 text-left focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 appearance-none`}
                  >
                    <option value="">Select Department</option>
                    {dynamicOptions.departments.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                  <ChevronDown size={20} className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
                  {errors.department && (
                    <p className="text-red-500 text-sm mt-1">{errors.department[0]}</p>
                  )}
                </div>
              </div>

              <div>
                <label htmlFor="priority" className="block text-sm font-semibold text-gray-700 mb-2">
                  Priority
                </label>
                <div className="relative">
                  <select
                    id="priority"
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                    className={`w-full bg-white border ${errors.priority ? 'border-red-500' : 'border-gray-200'} rounded-lg shadow-sm px-4 py-3 text-left focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 appearance-none`}
                  >
                    {dynamicOptions.priorities.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                  <ChevronDown size={20} className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
                  {errors.priority && (
                    <p className="text-red-500 text-sm mt-1">{errors.priority[0]}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Service */}
            <div>
              <label htmlFor="service" className="block text-sm font-semibold text-gray-700 mb-2">
                Service
              </label>
              <div className="relative">
                <select
                  id="service"
                  value={service}
                  onChange={(e) => setService(e.target.value)}
                  className="w-full bg-white border border-gray-200 rounded-lg shadow-sm px-4 py-3 text-left focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200 appearance-none"
                >
                  <option value="">Select Service</option>
                  {dynamicOptions.services.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
                <ChevronDown size={20} className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
                {errors.service && (
                  <p className="text-red-500 text-sm mt-1">{errors.service[0]}</p>
                )}
              </div>
            </div>

            {/* Ticket Body */}
            <div>
              <label htmlFor="ticketBody" className="block text-sm font-semibold text-gray-700 mb-2">
                Ticket Body
              </label>
              <textarea
                id="ticketBody"
                placeholder="Describe your issue..."
                rows={6}
                value={formData.ticketBody}
                onChange={(e) => setFormData({ ...formData, ticketBody: e.target.value })}
                className={`w-full px-4 py-3 border ${errors.ticketBody ? 'border-red-500' : 'border-gray-200'} rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200`}
              />
              {errors.ticketBody && (
                <p className="text-red-500 text-sm mt-1">{errors.ticketBody[0]}</p>
              )}
            </div>

            {/* Attachments */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Attachments
              </label>
              <div className="flex items-center">
                <label
                  htmlFor="file-upload"
                  className="cursor-pointer bg-blue-500 text-white rounded-l-lg px-4 py-2 text-sm font-medium hover:bg-blue-600 transition duration-200"
                >
                  Choose file
                </label>
                <span className="flex-grow border-t border-r border-b border-gray-200 px-4 py-2 text-sm text-gray-500 rounded-r-lg bg-gray-50">
                  {formData.attachments ? formData.attachments.name : 'No file chosen'}
                </span>
                <input
                  id="file-upload"
                  type="file"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </div>
              {errors.attachments && (
                <p className="text-red-500 text-sm mt-1">{errors.attachments[0]}</p>
              )}
            </div>

            {/* Submit Button */}
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-blue-500 text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-blue-600 transition duration-200 disabled:opacity-50"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Ticket'}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}

export default TicketForm;