import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import DashboardStats from '@/components/organisms/DashboardStats';
import ContentCard from '@/components/molecules/ContentCard';
import ResponseReviewModal from '@/components/organisms/ResponseReviewModal';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';
import Empty from '@/components/ui/Empty';
import Button from '@/components/atoms/Button';
import { contentService } from '@/services/api/contentService';
import { validationResponseService } from '@/services/api/validationResponseService';

const Dashboard = () => {
  const [content, setContent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedContent, setSelectedContent] = useState(null);
  const [responses, setResponses] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const loadContent = async () => {
    try {
      setError('');
      setLoading(true);
      
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const data = await contentService.getAll();
      setContent(data);
    } catch (err) {
      setError('Failed to load content. Please try again.');
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadContent();
  }, []);

  const handleViewContent = (contentItem) => {
    toast.info(`Viewing: ${contentItem.title}`);
  };

  const handleSelectContent = async (contentItem) => {
    try {
      const contentResponses = await validationResponseService.getByContentId(contentItem.Id);
      setSelectedContent(contentItem);
      setResponses(contentResponses);
      setIsModalOpen(true);
    } catch (err) {
      toast.error('Failed to load expert responses');
    }
  };

  const getResponseCount = (contentId) => {
    // This would normally come from the API, simulating for now
    return Math.floor(Math.random() * 5) + 1;
  };

  const stats = {
    pending: content.filter(c => c.status === 'pending').length,
    validated: content.filter(c => c.status === 'validated').length,
    total: content.length
  };

  if (loading) return <Loading type="dashboard" />;
  if (error) return <Error message={error} onRetry={loadContent} />;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-8"
    >
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display font-bold text-gray-900">
            Dashboard
          </h1>
          <p className="text-gray-600 font-body mt-2">
            Monitor your content validation progress and expert responses
          </p>
        </div>
        <Button
          variant="primary"
          icon="Plus"
          onClick={() => window.location.href = '/submit'}
        >
          Submit New Content
        </Button>
      </div>

      <DashboardStats stats={stats} />

      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-display font-semibold text-gray-900">
            Recent Submissions
          </h2>
          <Button
            variant="ghost"
            icon="ArrowRight"
            onClick={() => window.location.href = '/library'}
          >
            View All
          </Button>
        </div>

        {content.length === 0 ? (
          <Empty
            title="No content submitted yet"
            description="Start by submitting your first AI-generated content for expert validation."
            actionText="Submit Content"
            onAction={() => window.location.href = '/submit'}
            icon="Upload"
          />
        ) : (
          <div className="space-y-4">
            {content.slice(0, 5).map((item) => (
              <ContentCard
                key={item.Id}
                content={item}
                onView={handleViewContent}
                onSelect={handleSelectContent}
                showResponses={item.status === 'pending'}
                responseCount={item.status === 'pending' ? getResponseCount(item.Id) : 0}
              />
            ))}
          </div>
        )}
      </div>

      <ResponseReviewModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        content={selectedContent}
        responses={responses}
        onContentUpdated={loadContent}
      />
    </motion.div>
  );
};

export default Dashboard;