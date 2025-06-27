import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import Button from '@/components/atoms/Button';
import SearchBar from '@/components/molecules/SearchBar';
import FormField from '@/components/molecules/FormField';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';
import Empty from '@/components/ui/Empty';
import ApperIcon from '@/components/ApperIcon';
import { expertService } from '@/services/api/expertService';
import { domainExpertiseService } from '@/services/api/domainExpertiseService';

const ExpertManagement = () => {
  const [experts, setExperts] = useState([]);
  const [domains, setDomains] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingExpert, setEditingExpert] = useState(null);
  const [formData, setFormData] = useState({
    Name: '',
    contactInformation: '',
    domainExpertiseId: '',
    Tags: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loadData = async () => {
    try {
      setError('');
      setLoading(true);
      
      const [expertsData, domainsData] = await Promise.all([
        expertService.getAll(),
        domainExpertiseService.getAll()
      ]);
      
      setExperts(expertsData);
      setDomains(domainsData);
    } catch (err) {
      setError('Failed to load expert data. Please try again.');
      toast.error('Failed to load expert data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const filteredExperts = experts.filter(expert =>
    expert.Name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    expert.contactInformation?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    expert.domainExpertiseId?.Name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddExpert = () => {
    setEditingExpert(null);
    setFormData({
      Name: '',
      contactInformation: '',
      domainExpertiseId: '',
      Tags: ''
    });
    setIsModalOpen(true);
  };

  const handleEditExpert = (expert) => {
    setEditingExpert(expert);
    setFormData({
      Name: expert.Name || '',
      contactInformation: expert.contactInformation || '',
      domainExpertiseId: expert.domainExpertiseId?.Id || '',
      Tags: Array.isArray(expert.Tags) ? expert.Tags.join(', ') : expert.Tags || ''
    });
    setIsModalOpen(true);
  };

  const handleDeleteExpert = async (expert) => {
    if (!window.confirm(`Are you sure you want to delete expert "${expert.Name}"?`)) {
      return;
    }

    try {
      await expertService.delete(expert.Id);
      toast.success('Expert deleted successfully');
      loadData();
    } catch (error) {
      toast.error('Failed to delete expert');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const submitData = {
        ...formData,
        domainExpertiseId: formData.domainExpertiseId ? parseInt(formData.domainExpertiseId) : null
      };

      if (editingExpert) {
        await expertService.update(editingExpert.Id, submitData);
        toast.success('Expert updated successfully');
      } else {
        await expertService.create(submitData);
        toast.success('Expert created successfully');
      }

      setIsModalOpen(false);
      loadData();
    } catch (error) {
      toast.error(editingExpert ? 'Failed to update expert' : 'Failed to create expert');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const getDomainBadgeColor = (domainName) => {
    const colors = [
      'bg-blue-100 text-blue-800',
      'bg-green-100 text-green-800',
      'bg-purple-100 text-purple-800',
      'bg-orange-100 text-orange-800',
      'bg-pink-100 text-pink-800',
      'bg-indigo-100 text-indigo-800'
    ];
    const hash = domainName?.split('').reduce((a, b) => a + b.charCodeAt(0), 0) || 0;
    return colors[hash % colors.length];
  };

  if (loading) return <Loading type="page" />;
  if (error) return <Error message={error} onRetry={loadData} />;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-8"
    >
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display font-bold text-gray-900">
            Expert Management
          </h1>
          <p className="text-gray-600 font-body mt-2">
            Manage expert profiles and domain expertise assignments
          </p>
        </div>
        <Button
          variant="primary"
          icon="UserPlus"
          onClick={handleAddExpert}
        >
          Add Expert
        </Button>
      </div>

      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-display font-semibold text-gray-900">
            Verified Experts
          </h2>
          <div className="w-96">
            <SearchBar
              value={searchTerm}
              onChange={setSearchTerm}
              placeholder="Search experts..."
            />
          </div>
        </div>

        {filteredExperts.length === 0 ? (
          <Empty
            title="No experts found"
            description={searchTerm ? "No experts match your search criteria." : "Start by adding your first expert to the platform."}
            actionText="Add Expert"
            onAction={handleAddExpert}
            icon="UserCheck"
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredExperts.map((expert) => (
              <motion.div
                key={expert.Id}
                whileHover={{ y: -2 }}
                className="card border border-gray-200 hover:border-gray-300 transition-all duration-200"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-secondary-500 to-secondary-600 rounded-full flex items-center justify-center">
                      <ApperIcon name="UserCheck" className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-display font-semibold text-gray-900">
                        {expert.Name}
                      </h3>
                      <p className="text-sm text-gray-500 font-body">
                        {expert.contactInformation}
                      </p>
                    </div>
                  </div>
                </div>

                {expert.domainExpertiseId && (
                  <div className="mb-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getDomainBadgeColor(expert.domainExpertiseId.Name)}`}>
                      {expert.domainExpertiseId.Name}
                    </span>
                  </div>
                )}

                {expert.Tags && (
                  <div className="mb-4">
                    <div className="flex flex-wrap gap-1">
                      {(Array.isArray(expert.Tags) ? expert.Tags : expert.Tags.split(',')).map((tag, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-700"
                        >
                          {tag.trim()}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-end gap-2 pt-4 border-t border-gray-100">
                  <Button
                    variant="ghost"
                    size="sm"
                    icon="Edit"
                    onClick={() => handleEditExpert(expert)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    icon="Trash2"
                    onClick={() => handleDeleteExpert(expert)}
                    className="text-red-600 hover:text-red-700"
                  >
                    Delete
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Expert Form Modal */}
      {isModalOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={() => setIsModalOpen(false)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-hidden"
          >
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-display font-semibold text-gray-900">
                  {editingExpert ? 'Edit Expert' : 'Add Expert'}
                </h3>
                <Button
                  variant="ghost"
                  size="sm"
                  icon="X"
                  onClick={() => setIsModalOpen(false)}
                />
              </div>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <FormField
                label="Expert Name"
                value={formData.Name}
                onChange={(e) => handleChange('Name', e.target.value)}
                placeholder="Enter expert's full name"
                required
              />

              <FormField
                label="Contact Information"
                value={formData.contactInformation}
                onChange={(e) => handleChange('contactInformation', e.target.value)}
                placeholder="Email, phone, or other contact details"
                required
              />

              <FormField
                type="select"
                label="Domain Expertise"
                value={formData.domainExpertiseId}
                onChange={(e) => handleChange('domainExpertiseId', e.target.value)}
                options={[
                  { value: '', label: 'Select domain...' },
                  ...domains.map(domain => ({
                    value: domain.Id.toString(),
                    label: domain.Name
                  }))
                ]}
                required
              />

              <FormField
                label="Tags"
                value={formData.Tags}
                onChange={(e) => handleChange('Tags', e.target.value)}
                placeholder="Comma-separated tags (e.g., certified, experienced)"
              />

              <div className="flex justify-end gap-3 pt-4">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  loading={isSubmitting}
                  icon={editingExpert ? "Save" : "Plus"}
                >
                  {editingExpert ? 'Update Expert' : 'Add Expert'}
                </Button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default ExpertManagement;