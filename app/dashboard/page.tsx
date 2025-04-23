import Link from 'next/link'
import React from 'react'

const DashboardPage = () => {
  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar Navigation */}
      <div className="w-64 bg-white shadow-md">
        <div className="p-4 border-b">
          <h1 className="text-xl font-bold text-gray-800">Admin Dashboard</h1>
        </div>
        <nav className="p-4">
          <ul className="space-y-2">
            <li>
              <Link href="/dashboard" className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded transition">
                Overview
              </Link>
            </li>
            <li>
              <Link href="/dashboard/products" className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded transition">
                Products
              </Link>
            </li>
            <li>
              <Link href="/dashboard/add-product" className="block px-4 py-2 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded transition">
                Add Product
              </Link>
            </li>
            <li>
              <Link href="/dashboard/orders" className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded transition">
                Orders
              </Link>
            </li>
          </ul>
        </nav>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 p-8">
        <h1 className="text-2xl font-bold mb-8">Dashboard Overview</h1>
        
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-gray-500 text-sm">Total Products</h3>
            <p className="text-2xl font-bold">142</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-gray-500 text-sm">Today's Orders</h3>
            <p className="text-2xl font-bold">18</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-gray-500 text-sm">Revenue</h3>
            <p className="text-2xl font-bold">$2,850</p>
          </div>
        </div>

        {/* Recent Activity Section */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
          <div className="space-y-4">
            <div className="border-b pb-3">
              <p className="text-gray-600">New order #1234 received</p>
              <p className="text-sm text-gray-400">2 hours ago</p>
            </div>
            <div className="border-b pb-3">
              <p className="text-gray-600">Product "Wireless Headphones" was updated</p>
              <p className="text-sm text-gray-400">5 hours ago</p>
            </div>
          </div>
        </div>

        {/* Quick Actions (including your Add Product link) */}
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
          <div className="flex space-x-4">
            <Link href="/dashboard/add-product" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition">
              Add Product
            </Link>
            <button className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition">
              Process Orders
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DashboardPage