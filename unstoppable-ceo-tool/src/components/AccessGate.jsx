import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useSession } from '../context/SessionContext';
import { validateAccessGate } from '../utils/validation';
import Button from './ui/Button';
import Input from './ui/Input';

const AccessGate = () => {
  const { startSession, isLoading } = useSession();
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: ''
  });
  
  const [errors, setErrors] = useState({});
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    const validation = validateAccessGate(formData);
    
    if (!validation.valid) {
      setErrors(validation.errors);
      return;
    }
    
    await startSession(formData);
  };
  
  return (
    <motion.div 
      className="min-h-screen flex items-center justify-center px-4 py-12 relative overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div 
          className="absolute -right-40 top-1/4 w-96 h-96 rounded-full border-2 border-cream-300 opacity-30"
          animate={{ rotate: 360 }}
          transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
        />
        <motion.div 
          className="absolute -right-20 top-1/4 w-72 h-72 rounded-full border-2 border-cream-400 opacity-20"
          animate={{ rotate: -360 }}
          transition={{ duration: 45, repeat: Infinity, ease: "linear" }}
        />
        <motion.div 
          className="absolute -left-32 bottom-1/4 w-80 h-80 rounded-full border-2 border-cream-300 opacity-20"
          animate={{ rotate: 360 }}
          transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
        />
      </div>
      
      <div className="w-full max-w-md z-10">
        {/* Header */}
        <motion.div 
          className="text-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <motion.div 
            className="inline-block px-4 py-2 bg-navy/5 border border-navy/20 rounded-full mb-6"
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3 }}
          >
            <span className="text-xs font-bold tracking-[0.2em] text-navy uppercase">
              The Unstoppable CEO
            </span>
          </motion.div>
          
          <h1 className="text-4xl md:text-5xl font-display font-bold text-navy mb-4">
            Framework Diagnostic
          </h1>
          <p className="text-lg text-navy/60">
            Discover your CEO framework score and unlock your growth potential
          </p>
        </motion.div>
        
        {/* Form Card */}
        <motion.form 
          className="bg-white rounded-3xl border border-cream-300 shadow-strong p-8 md:p-10"
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="grid grid-cols-2 gap-4 mb-4">
            <Input
              label="First Name"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              placeholder="John"
              error={errors.firstName}
              required
            />
            <Input
              label="Last Name"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              placeholder="Doe"
              error={errors.lastName}
              required
            />
          </div>
          
          <Input
            label="Email Address"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="john@example.com"
            error={errors.email}
            required
            className="mb-6"
          />
          
          <Button 
            type="submit" 
            variant="primary" 
            size="large"
            loading={isLoading}
            className="w-full"
          >
            Start Diagnostic
          </Button>
        </motion.form>
        
        {/* Footer */}
        <motion.p 
          className="text-center mt-6 text-sm text-navy/40"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          🔒 Your information is secure and will never be shared
        </motion.p>
      </div>
    </motion.div>
  );
};

export default AccessGate;
