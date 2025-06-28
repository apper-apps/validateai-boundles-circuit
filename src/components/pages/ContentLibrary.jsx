import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import SearchBar from '@/components/molecules/SearchBar';
import Button from '@/components/atoms/Button';
import StatusBadge from '@/components/atoms/StatusBadge';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';
import Empty from '@/components/ui/Empty';
import ApperIcon from '@/components/ApperIcon';
import { libraryService } from '@/services/api/libraryService';
import { formatDistance } from 'date-fns';

const ContentLibrary = () => {
  const [libraryItems, setLibraryItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');

  const loadLibrary = async () => {
    try {
      setError('');
      setLoading(true);
      
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const data = await libraryService.getAll();
      setLibraryItems(data);
      setFilteredItems(data);
    } catch (err) {
      setError('Failed to load library content. Please try again.');
      toast.error('Failed to load library');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLibrary();
  }, []);

  useEffect(() => {
    let filtered = libraryItems;

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(item =>
        item.validatedContent.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.expertName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Apply type filter
    if (selectedFilter !== 'all') {
      filtered = filtered.filter(item =>
        item.tags.includes(selectedFilter)
      );
    }

    setFilteredItems(filtered);
  }, [libraryItems, searchTerm, selectedFilter]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleViewContent = (item) => {
    // Navigate to AI chat with this content pre-loaded
    toast.info(`Opening "${item.validatedContent.substring(0, 50)}..." in AI Chat`);
  };

  const handleCopyContent = (content) => {
    navigator.clipboard.writeText(content);
    toast.success('Content copied to clipboard!');
  };

const getUniqueTypes = () => {
    const types = new Set();
    // Add null checking to prevent TypeError
    if (libraryItems && Array.isArray(libraryItems)) {
      libraryItems.forEach(item => {
        // Also check if item and item.tags exist
        if (item && item.tags && Array.isArray(item.tags)) {
          item.tags.forEach(tag => types.add(tag));
        }
      });
    }
    return Array.from(types).filter(type => 
      !['ChatGPT', 'Claude', 'Gemini'].includes(type)
    );
  };

  if (loading) return <Loading type="library" />;
  if (error) return <Error message={error} onRetry={loadLibrary} />;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-gray-900">
            Content Library
          </h1>
          <p className="text-gray-600 font-body mt-2">
            Your collection of expertly validated AI-generated content
          </p>
        </div>
        <Button
          variant="primary"
          icon="MessageCircle"
          onClick={() => window.location.href = '/chat'}
        >
          Open AI Chat
        </Button>
      </div>

      <div className="card">
        <div className="flex flex-col lg:flex-row gap-4 mb-6">
          <div className="flex-1">
            <SearchBar
              value={searchTerm}
              onChange={handleSearch}
              placeholder="Search validated content, experts, or tags..."
            />
          </div>
          
          <div className="flex gap-2">
            <select
              value={selectedFilter}
              onChange={(e) => setSelectedFilter(e.target.value)}
              className="input-field min-w-[120px]"
            >
              <option value="all">All Types</option>
              {getUniqueTypes().map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>
        </div>

        {filteredItems.length === 0 ? (
          libraryItems.length === 0 ? (
            <Empty
              title="No validated content yet"
              description="Submit content for validation to start building your trusted knowledge library."
              actionText="Submit Content"
              onAction={() => window.location.href = '/submit'}
              icon="BookOpen"
            />
          ) : (
            <Empty
              title="No matching content"
              description="Try adjusting your search terms or filters to find what you're looking for."
              icon="Search"
            />
          )
        ) : (
          <div className="space-y-4">
            {filteredItems.map((item) => (
              <motion.div
                key={item.Id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ y: -2 }}
                className="border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-all duration-200"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-accent-500 to-accent-600 rounded-full flex items-center justify-center">
                      <ApperIcon name="CheckCircle" className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 font-body">
                        Validated by {item.expertName}
                      </p>
                      <p className="text-sm text-gray-500 font-body">
                        {formatDistance(new Date(item.validatedAt), new Date(), { addSuffix: true })}
                      </p>
                    </div>
                  </div>
                  <StatusBadge status="validated" />
                </div>

                <div className="mb-4">
                  <p className="text-gray-700 font-body line-clamp-3">
                    {item.validatedContent}
                  </p>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {item.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      icon="Copy"
                      onClick={() => handleCopyContent(item.validatedContent)}
                    >
                      Copy
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      icon="MessageCircle"
                      onClick={() => handleViewContent(item)}
                    >
                      Chat
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default ContentLibrary;