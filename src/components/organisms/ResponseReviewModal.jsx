import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import Button from '@/components/atoms/Button';
import ExpertResponseCard from '@/components/molecules/ExpertResponseCard';
import ApperIcon from '@/components/ApperIcon';
import { validationResponseService } from '@/services/api/validationResponseService';
import { contentService } from '@/services/api/contentService';
import { libraryService } from '@/services/api/libraryService';

const ResponseReviewModal = ({ isOpen, onClose, content, responses, onContentUpdated }) => {
  const [selectedResponse, setSelectedResponse] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSelectExpert = async () => {
    if (!selectedResponse) return;

    setIsProcessing(true);
    try {
      // Update the selected response
      await validationResponseService.update(selectedResponse.Id, {
        ...selectedResponse,
        selected: true
      });

      // Update content status to validated
      await contentService.update(content.Id, {
        ...content,
        status: 'validated',
        validatedAt: new Date().toISOString()
      });

      // Add to library
      await libraryService.create({
        contentId: content.Id,
        validatedContent: selectedResponse.corrections || content.content,
        expertName: selectedResponse.expertName,
        validatedAt: new Date().toISOString(),
        tags: [content.type, content.source]
      });

      toast.success(`Expert ${selectedResponse.expertName} selected! Content added to your library.`);
      
      if (onContentUpdated) {
        onContentUpdated();
      }
      
      onClose();
    } catch (error) {
      toast.error('Failed to select expert. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
        >
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-display font-bold text-gray-900">
                  Expert Responses
                </h2>
                <p className="text-gray-600 font-body mt-1">
                  Review and select the best validation for "{content.title}"
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                icon="X"
                onClick={onClose}
              />
            </div>
          </div>

          <div className="p-6 max-h-[60vh] overflow-y-auto custom-scrollbar">
            <div className="space-y-6">
              {responses.map((response) => (
                <ExpertResponseCard
                  key={response.Id}
                  response={response}
                  isSelected={selectedResponse?.Id === response.Id}
                  onSelect={setSelectedResponse}
                />
              ))}
            </div>
          </div>

          <div className="p-6 border-t border-gray-200 bg-gray-50">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600 font-body">
                {selectedResponse ? (
                  <span className="flex items-center gap-2">
                    <ApperIcon name="CreditCard" className="w-4 h-4" />
                    You'll be charged ${selectedResponse.fee} for this validation
                  </span>
                ) : (
                  'Select an expert response to proceed'
                )}
              </div>
              
              <div className="flex items-center gap-3">
                <Button
                  variant="ghost"
                  onClick={onClose}
                >
                  Cancel
                </Button>
                <Button
                  variant="accent"
                  onClick={handleSelectExpert}
                  disabled={!selectedResponse}
                  loading={isProcessing}
                  icon="Check"
                >
                  Confirm Selection
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ResponseReviewModal;