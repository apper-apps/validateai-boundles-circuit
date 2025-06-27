import React from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';

const Empty = ({ 
  title = "No items found",
  description = "Get started by adding your first item.",
  actionText,
  onAction,
  icon = "FileText",
  className = ''
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`text-center py-16 ${className}`}
    >
      <div className="max-w-md mx-auto">
        <div className="mx-auto w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mb-6">
          <ApperIcon name={icon} className="w-10 h-10 text-gray-400" />
        </div>
        
        <h3 className="text-2xl font-display font-semibold text-gray-900 mb-2">
          {title}
        </h3>
        
        <p className="text-gray-500 mb-8 font-body">
          {description}
        </p>
        
        {actionText && onAction && (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onAction}
            className="btn-primary inline-flex items-center gap-2"
          >
            <ApperIcon name="Plus" className="w-4 h-4" />
            {actionText}
          </motion.button>
        )}
      </div>
    </motion.div>
  );
};

export default Empty;