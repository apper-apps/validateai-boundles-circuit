import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import FormField from '@/components/molecules/FormField';
import Button from '@/components/atoms/Button';
import { contentService } from '@/services/api/contentService';

const ContentSubmissionForm = ({ onSuccess }) => {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    source: '',
    type: 'article',
    requirements: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const contentTypes = [
    { value: 'article', label: 'Article' },
    { value: 'blog-post', label: 'Blog Post' },
    { value: 'research-paper', label: 'Research Paper' },
    { value: 'marketing-copy', label: 'Marketing Copy' },
    { value: 'technical-documentation', label: 'Technical Documentation' },
    { value: 'other', label: 'Other' }
  ];

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await contentService.create({
        ...formData,
        status: 'pending',
        submittedAt: new Date().toISOString()
      });

      toast.success('Content submitted successfully! Experts will review it soon.');
      
      // Reset form
      setFormData({
        title: '',
        content: '',
        source: '',
        type: 'article',
        requirements: ''
      });

      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      toast.error('Failed to submit content. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      onSubmit={handleSubmit}
      className="space-y-6"
    >
      <div className="card">
        <h2 className="text-2xl font-display font-bold text-gray-900 mb-6">
          Submit Content for Validation
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <FormField
            label="Content Title"
            value={formData.title}
            onChange={(e) => handleChange('title', e.target.value)}
            placeholder="Enter a descriptive title for your content"
            required
          />

          <FormField
            type="select"
            label="Content Type"
            value={formData.type}
            onChange={(e) => handleChange('type', e.target.value)}
            options={contentTypes}
            required
          />
        </div>

        <FormField
          label="Original Source"
          value={formData.source}
          onChange={(e) => handleChange('source', e.target.value)}
          placeholder="e.g., ChatGPT, Claude, Gemini, Custom AI Tool"
          required
        />

        <FormField
          type="textarea"
          label="Content to Validate"
          value={formData.content}
          onChange={(e) => handleChange('content', e.target.value)}
          placeholder="Paste your AI-generated content here..."
          rows={8}
          required
        />

        <FormField
          type="textarea"
          label="Validation Requirements"
          value={formData.requirements}
          onChange={(e) => handleChange('requirements', e.target.value)}
          placeholder="Specify what aspects you'd like experts to focus on (accuracy, tone, structure, etc.)"
          rows={3}
        />

        <div className="flex justify-end pt-4">
          <Button
            type="submit"
            loading={isSubmitting}
            icon="Upload"
            size="lg"
          >
            Submit for Validation
          </Button>
        </div>
      </div>
    </motion.form>
  );
};

export default ContentSubmissionForm;