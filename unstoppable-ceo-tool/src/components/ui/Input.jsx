import React from 'react';
import { motion } from 'framer-motion';

const Input = ({
  label,
  type = 'text',
  value,
  onChange,
  placeholder,
  error,
  required = false,
  name,
  className = '',
  prefix,
  suffix
}) => {
  return (
    <motion.div 
      className={`space-y-2 ${className}`}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {label && (
        <label className="block text-sm font-semibold text-navy/70 uppercase tracking-wide" htmlFor={name}>
          {label}
          {required && <span className="text-score-red ml-1">*</span>}
        </label>
      )}
      <div className="relative">
        {prefix && (
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-cream-600 font-semibold">
            {prefix}
          </span>
        )}
        <input
          id={name}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={`
            w-full px-4 py-3.5 bg-white border-2 rounded-xl text-navy font-medium
            placeholder:text-cream-500 transition-all duration-200
            focus:outline-none focus:border-navy focus:ring-4 focus:ring-navy/10
            ${prefix ? 'pl-10' : ''}
            ${suffix ? 'pr-12' : ''}
            ${error ? 'border-score-red focus:border-score-red focus:ring-score-red/10' : 'border-cream-300'}
          `}
          required={required}
        />
        {suffix && (
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-cream-600 font-semibold">
            {suffix}
          </span>
        )}
      </div>
      {error && (
        <motion.span 
          className="text-sm text-score-red font-medium"
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {error}
        </motion.span>
      )}
    </motion.div>
  );
};

export default Input;
