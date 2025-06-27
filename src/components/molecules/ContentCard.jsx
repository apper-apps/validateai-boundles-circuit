import React from 'react';
import { motion } from 'framer-motion';
import StatusBadge from '@/components/atoms/StatusBadge';
import Button from '@/components/atoms/Button';
import ApperIcon from '@/components/ApperIcon';
import { formatDistance } from 'date-fns';

const ContentCard = ({ 
  content, 
  onView, 
  onSelect,
  showResponses = false,
  responseCount = 0,
  className = '' 
}) => {
  return (
    <motion.div
      whileHover={{ y: -2 }}
      className={`card ${className}`}
    >
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-display font-semibold text-gray-900 truncate">
            {content.title}
          </h3>
          <p className="text-sm text-gray-500 font-body mt-1">
            {content.source} • {content.type}
          </p>
        </div>
        <StatusBadge status={content.status} />
      </div>
      
      <p className="text-gray-600 font-body mb-4 line-clamp-3">
        {content.content.substring(0, 150)}...
      </p>
      
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-500 font-body">
            {formatDistance(new Date(content.submittedAt), new Date(), { addSuffix: true })}
          </span>
          
          {showResponses && responseCount > 0 && (
            <div className="flex items-center gap-1 text-sm text-secondary-600 font-medium">
              <ApperIcon name="MessageSquare" className="w-4 h-4" />
              {responseCount} response{responseCount !== 1 ? 's' : ''}
            </div>
          )}
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            icon="Eye"
            onClick={() => onView(content)}
          >
            View
          </Button>
          
          {content.status === 'pending' && responseCount > 0 && onSelect && (
            <Button
              variant="primary"
              size="sm"
              onClick={() => onSelect(content)}
            >
              Review Responses
            </Button>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default ContentCard;