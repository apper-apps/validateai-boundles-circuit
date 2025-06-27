import React from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';

const DashboardStats = ({ stats }) => {
  const statCards = [
    {
      title: 'Pending Validations',
      value: stats.pending || 0,
      icon: 'Clock',
      gradient: 'from-yellow-400 to-orange-500',
      bgGradient: 'from-yellow-50 to-orange-50'
    },
    {
      title: 'Validated Content',
      value: stats.validated || 0,
      icon: 'CheckCircle',
      gradient: 'from-green-400 to-emerald-500',
      bgGradient: 'from-green-50 to-emerald-50'
    },
    {
      title: 'Total Submissions',
      value: stats.total || 0,
      icon: 'FileText',
      gradient: 'from-blue-400 to-indigo-500',
      bgGradient: 'from-blue-50 to-indigo-50'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      {statCards.map((stat, index) => (
        <motion.div
          key={stat.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          whileHover={{ y: -4 }}
          className={`card bg-gradient-to-br ${stat.bgGradient} border-0`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 font-body">
                {stat.title}
              </p>
              <p className="text-3xl font-display font-bold text-gray-900 mt-1">
                {stat.value}
              </p>
            </div>
            <div className={`w-12 h-12 bg-gradient-to-br ${stat.gradient} rounded-lg flex items-center justify-center shadow-lg`}>
              <ApperIcon name={stat.icon} className="w-6 h-6 text-white" />
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default DashboardStats;