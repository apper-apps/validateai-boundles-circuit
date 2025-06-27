import React from 'react';
import Input from '@/components/atoms/Input';

const FormField = ({ 
  type = 'input',
  label,
  value,
  onChange,
  options = [],
  rows = 4,
  ...props 
}) => {
  if (type === 'textarea') {
    return (
      <div className="space-y-2">
        {label && (
          <label className="block text-sm font-medium text-gray-700 font-body">
            {label}
            {props.required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        <textarea
          value={value}
          onChange={onChange}
          rows={rows}
          className={`
            input-field resize-none
            ${props.error ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''}
          `}
          {...props}
        />
        {props.error && (
          <p className="text-sm text-red-600 font-body">{props.error}</p>
        )}
      </div>
    );
  }
  
  if (type === 'select') {
    return (
      <div className="space-y-2">
        {label && (
          <label className="block text-sm font-medium text-gray-700 font-body">
            {label}
            {props.required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        <select
          value={value}
          onChange={onChange}
          className={`
            input-field
            ${props.error ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''}
          `}
          {...props}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {props.error && (
          <p className="text-sm text-red-600 font-body">{props.error}</p>
        )}
      </div>
    );
  }
  
  return (
    <Input
      label={label}
      value={value}
      onChange={onChange}
      {...props}
    />
  );
};

export default FormField;