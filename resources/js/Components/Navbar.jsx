import React from 'react';
import { Link, usePage, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';

const Navbar = () => {
  const { auth } = usePage().props;

  const handleLogout = () => {
    router.post('/logout');
  };

  return (
    <nav className="bg-white shadow-sm border-b border-gray-100">
      <div className="max-w-6xl mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <Link href="/TicketForm" className="text-xl font-bold text-gray-900">
              Raise Ticket
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            {auth?.user ? (
              <>
                <span className="text-gray-600 text-sm">
                  Welcome, {auth.user.name || 'User'}
                </span>
                <Button
                  variant="outline"
                  className="text-gray-700 border-gray-300 hover:bg-gray-100"
                  onClick={handleLogout}
                >
                  Logout
                </Button>
              </>
            ) : (
              <Link
                href="/login"
                className="text-gray-600 hover:text-gray-900 text-sm font-medium"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;