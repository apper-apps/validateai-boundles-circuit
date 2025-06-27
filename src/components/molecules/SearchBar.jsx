import React from 'react';
import Input from '@/components/atoms/Input';
import Button from '@/components/atoms/Button';

const SearchBar = ({ 
  value, 
  onChange, 
  placeholder = "Search...", 
  onFilter,
  showFilters = false,
  className = '' 
}) => {
  return (
    <div className={`flex flex-col sm:flex-row gap-4 ${className}`}>
      <div className="flex-1">
        <Input
          icon="Search"
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className="w-full"
        />
      </div>
      
      {showFilters && (
        <Button
          variant="outline"
          icon="Filter"
          onClick={onFilter}
          className="sm:w-auto"
        >
          Filters
        </Button>
      )}
    </div>
  );
};

export default SearchBar;