import React from 'react';
import { motion } from 'framer-motion';

const Loading = ({ type = 'default', className = '' }) => {
  const renderSkeletonByType = () => {
    switch (type) {
      case 'dashboard':
        return (
          <div className={`space-y-6 ${className}`}>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="card animate-pulse">
                  <div className="shimmer h-4 w-24 rounded mb-2"></div>
                  <div className="shimmer h-8 w-16 rounded mb-4"></div>
                  <div className="shimmer h-3 w-32 rounded"></div>
                </div>
              ))}
            </div>
            
            {/* Content List */}
            <div className="card animate-pulse">
              <div className="shimmer h-6 w-48 rounded mb-6"></div>
              <div className="space-y-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="flex items-center justify-between p-4 border border-gray-100 rounded-lg">
                    <div className="flex-1">
                      <div className="shimmer h-5 w-64 rounded mb-2"></div>
                      <div className="shimmer h-4 w-32 rounded"></div>
                    </div>
                    <div className="shimmer h-6 w-20 rounded-full"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
        
      case 'library':
        return (
          <div className={`space-y-4 ${className}`}>
            {/* Search Bar */}
            <div className="card animate-pulse">
              <div className="shimmer h-12 w-full rounded-lg"></div>
            </div>
            
            {/* Content Items */}
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="card animate-pulse">
                <div className="flex justify-between items-start mb-4">
                  <div className="shimmer h-6 w-64 rounded"></div>
                  <div className="shimmer h-6 w-24 rounded-full"></div>
                </div>
                <div className="space-y-2 mb-4">
                  <div className="shimmer h-4 w-full rounded"></div>
                  <div className="shimmer h-4 w-3/4 rounded"></div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="shimmer h-4 w-32 rounded"></div>
                  <div className="shimmer h-8 w-20 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        );
        
      case 'chat':
        return (
          <div className={`space-y-4 ${className}`}>
            {[1, 2, 3].map((i) => (
              <div key={i} className={`flex ${i % 2 === 0 ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-xs lg:max-w-md px-4 py-3 rounded-lg animate-pulse ${
                  i % 2 === 0 ? 'bg-primary-100' : 'bg-gray-100'
                }`}>
                  <div className="shimmer h-4 w-48 rounded mb-1"></div>
                  <div className="shimmer h-4 w-32 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        );
        
      default:
        return (
          <div className={`space-y-4 ${className}`}>
            {[1, 2, 3].map((i) => (
              <div key={i} className="card animate-pulse">
                <div className="shimmer h-6 w-48 rounded mb-4"></div>
                <div className="space-y-2">
                  <div className="shimmer h-4 w-full rounded"></div>
                  <div className="shimmer h-4 w-3/4 rounded"></div>
                  <div className="shimmer h-4 w-1/2 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        );
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-4"
    >
      {renderSkeletonByType()}
    </motion.div>
  );
};

export default Loading;