import React from 'react';
import { motion } from 'framer-motion';

const Card = ({ 
  children, 
  className = '',
  hover = false,
  delay = 0
}) => {
  return (
    <motion.div 
      className={`bg-white rounded-2xl border border-cream-300 shadow-soft ${hover ? 'hover:shadow-medium hover:border-cream-400 hover:-translate-y-1' : ''} transition-all duration-300 ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
    >
      {children}
    </motion.div>
  );
};

export default Card;
