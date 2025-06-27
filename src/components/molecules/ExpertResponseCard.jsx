import React from 'react';
import { motion } from 'framer-motion';
import Button from '@/components/atoms/Button';
import ApperIcon from '@/components/ApperIcon';
import { formatDistance } from 'date-fns';

const ExpertResponseCard = ({ 
  response, 
  onSelect, 
  isSelected = false,
  className = '' 
}) => {
  return (
    <motion.div
      whileHover={{ scale: 1.01 }}
      className={`
        card border-2 transition-all duration-200
        ${isSelected ? 'border-accent-500 bg-accent-50' : 'border-gray-100 hover:border-gray-200'}
        ${className}
      `}
    >
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-secondary-500 to-secondary-600 rounded-full flex items-center justify-center">
            <ApperIcon name="User" className="w-5 h-5 text-white" />
          </div>
          <div>
            <h4 className="font-display font-semibold text-gray-900">
              {response.expertName}
            </h4>
            <p className="text-sm text-gray-500 font-body">
              {formatDistance(new Date(response.submittedAt), new Date(), { addSuffix: true })}
            </p>
          </div>
        </div>
        
        <div className="text-right">
          <div className="text-2xl font-display font-bold text-primary-600">
            ${response.fee}
          </div>
          <div className="text-sm text-gray-500 font-body">validation fee</div>
        </div>
      </div>
      
      <div className="space-y-4">
        <div>
          <h5 className="font-medium text-gray-900 mb-2 font-body">Feedback:</h5>
          <p className="text-gray-700 font-body">{response.feedback}</p>
        </div>
        
        {response.corrections && (
          <div>
            <h5 className="font-medium text-gray-900 mb-2 font-body">Suggested Corrections:</h5>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
              <p className="text-gray-700 font-body">{response.corrections}</p>
            </div>
          </div>
        )}
      </div>
      
      <div className="mt-6 flex justify-end">
        <Button
          variant={isSelected ? "accent" : "primary"}
          onClick={() => onSelect(response)}
          icon={isSelected ? "Check" : "CreditCard"}
        >
          {isSelected ? "Selected" : `Select Expert - $${response.fee}`}
        </Button>
      </div>
    </motion.div>
  );
};

export default ExpertResponseCard;