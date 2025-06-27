import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import ContentSubmissionForm from '@/components/organisms/ContentSubmissionForm';
import ApperIcon from '@/components/ApperIcon';

const SubmitContent = () => {
  const navigate = useNavigate();

  const handleSuccess = () => {
    navigate('/dashboard');
  };

  const features = [
    {
      icon: 'Shield',
      title: 'Expert Validation',
      description: 'Get your AI content reviewed by subject matter experts'
    },
    {
      icon: 'Clock',
      title: 'Quick Turnaround',
      description: 'Receive expert feedback within 24-48 hours'
    },
    {
      icon: 'Star',
      title: 'Quality Assurance',
      description: 'Ensure accuracy, tone, and professional standards'
    },
    {
      icon: 'BookOpen',
      title: 'Personal Library',
      description: 'Validated content is automatically added to your library'
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-4xl mx-auto"
    >
      <div className="text-center mb-8">
        <h1 className="text-4xl font-display font-bold text-gray-900">
          Submit Content for Validation
        </h1>
        <p className="text-xl text-gray-600 font-body mt-4 max-w-2xl mx-auto">
          Get your AI-generated content professionally validated by industry experts. 
          Choose from multiple expert responses and build your trusted knowledge library.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {features.map((feature, index) => (
          <motion.div
            key={feature.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="card text-center"
          >
            <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center mx-auto mb-4">
              <ApperIcon name={feature.icon} className="w-6 h-6 text-white" />
            </div>
            <h3 className="font-display font-semibold text-gray-900 mb-2">
              {feature.title}
            </h3>
            <p className="text-sm text-gray-600 font-body">
              {feature.description}
            </p>
          </motion.div>
        ))}
      </div>

      <ContentSubmissionForm onSuccess={handleSuccess} />
    </motion.div>
  );
};

export default SubmitContent;