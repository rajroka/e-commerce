import Link from 'next/link';
import React from 'react';

const DashboardPage = () => {
  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar Navigation */}
      <div className="w-64 bg-white shadow-md">
        <div className="p-4 border-b">
          <h1 className="text-xl font-bold text-gray-800">Admin Panel</h1>
        </div>
        <nav className="p-4">
          <ul className="space-y-2">

             <li>
              <Link href="/dashboard/all-products" className="block px-4 py-2 text-green-600 bg-green-50 hover:bg-green-100 rounded transition">
                View Products
              </Link>
            </li>
            <li>
              <Link href="/dashboard/add-product" className="block px-4 py-2 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded transition">
                Add Product
              </Link>
            </li>
         
            
          </ul>
        </nav>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 p-8">
        <h1 className="text-2xl font-bold mb-6">Welcome to the Admin Panel</h1>

        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
          <Link href="/dashboard/add-product" className="bg-blue-600 text-white px-4 py-6 rounded-lg shadow text-center font-medium hover:bg-blue-700 transition">
            Add Product
          </Link>
        
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
