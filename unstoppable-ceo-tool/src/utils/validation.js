// Email validation regex
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const validateEmail = (email) => {
  if (!email || email.trim() === '') {
    return { valid: false, error: 'Email is required' };
  }
  if (!EMAIL_REGEX.test(email)) {
    return { valid: false, error: 'Please enter a valid email address' };
  }
  return { valid: true, error: null };
};

export const validateRequired = (value, fieldName) => {
  if (!value || value.trim() === '') {
    return { valid: false, error: `${fieldName} is required` };
  }
  return { valid: true, error: null };
};

export const validateNumber = (value, fieldName, min = 0) => {
  if (value === '' || value === null || value === undefined) {
    return { valid: false, error: `${fieldName} is required` };
  }
  const num = parseFloat(value);
  if (isNaN(num)) {
    return { valid: false, error: `${fieldName} must be a number` };
  }
  if (num < min) {
    return { valid: false, error: `${fieldName} must be at least ${min}` };
  }
  return { valid: true, error: null };
};

export const validateAccessGate = (data) => {
  const errors = {};
  
  const firstNameValidation = validateRequired(data.firstName, 'First name');
  if (!firstNameValidation.valid) errors.firstName = firstNameValidation.error;
  
  const lastNameValidation = validateRequired(data.lastName, 'Last name');
  if (!lastNameValidation.valid) errors.lastName = lastNameValidation.error;
  
  const emailValidation = validateEmail(data.email);
  if (!emailValidation.valid) errors.email = emailValidation.error;
  
  return {
    valid: Object.keys(errors).length === 0,
    errors
  };
};

export const validateROIInputs = (data) => {
  const errors = {};
  
  const fields = [
    { key: 'offerPrice', name: 'Offer Price' },
    { key: 'clientsPerMonth', name: 'Clients Per Month' },
    { key: 'closeRate', name: 'Close Rate' },
    { key: 'revenueGoal', name: 'Revenue Goal' },
    { key: 'monthsToGoal', name: 'Months to Goal' }
  ];
  
  fields.forEach(({ key, name }) => {
    const validation = validateNumber(data[key], name, 0);
    if (!validation.valid) errors[key] = validation.error;
  });
  
  return {
    valid: Object.keys(errors).length === 0,
    errors
  };
};
