'use client';

import { motion } from 'framer-motion';

export default function AdminDashboard() {
  const stats = [
    { title: 'Total Users', value: '150+', icon: '👥' },
    { title: 'Active Orders', value: '25', icon: '📦' },
    { title: 'Total Revenue', value: '$2,500', icon: '💰' },
    { title: 'Employee Count', value: '8', icon: '👨‍💼' },
  ];

  const recentOrders = [
    { id: '1', customer: 'John Doe', service: 'Wash & Fold', status: 'In Progress', amount: '$25' },
    { id: '2', customer: 'Jane Smith', service: 'Dry Cleaning', status: 'Completed', amount: '$45' },
    { id: '3', customer: 'Mike Johnson', service: 'Iron Only', status: 'Pending', amount: '$15' },
  ];

  return (
    <div className="p-6">
      <motion.h1 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-3xl font-bold text-primary-800 mb-8"
      >
        Admin Dashboard
      </motion.h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-lg shadow-md p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">{stat.title}</p>
                <p className="text-2xl font-bold text-primary-800 mt-1">{stat.value}</p>
              </div>
              <span className="text-3xl">{stat.icon}</span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Recent Orders */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white rounded-lg shadow-md p-6"
      >
        <h2 className="text-xl font-semibold text-primary-800 mb-4">Recent Orders</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left border-b border-gray-200">
                <th className="pb-3 text-gray-600">Order ID</th>
                <th className="pb-3 text-gray-600">Customer</th>
                <th className="pb-3 text-gray-600">Service</th>
                <th className="pb-3 text-gray-600">Status</th>
                <th className="pb-3 text-gray-600">Amount</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((order) => (
                <tr key={order.id} className="border-b border-gray-100">
                  <td className="py-3">#{order.id}</td>
                  <td className="py-3">{order.customer}</td>
                  <td className="py-3">{order.service}</td>
                  <td className="py-3">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      order.status === 'Completed' ? 'bg-green-100 text-green-800' :
                      order.status === 'In Progress' ? 'bg-blue-100 text-blue-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="py-3">{order.amount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8"
      >
        <button className="bg-primary-600 text-white p-4 rounded-lg hover:bg-primary-700 transition-colors">
          Manage Users
        </button>
        <button className="bg-primary-600 text-white p-4 rounded-lg hover:bg-primary-700 transition-colors">
          View Reports
        </button>
        <button className="bg-primary-600 text-white p-4 rounded-lg hover:bg-primary-700 transition-colors">
          System Settings
        </button>
      </motion.div>
    </div>
  );
} 