// src/utils/constraints.js

// Regular expressions for validating input data
export const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

// Password strength constraints
export const passwordConstraints = {
  minLength: 8, // Minimum length of 8 characters
  maxLength: 20, // Maximum length of 20 characters
  requireUppercase: true, // Requires at least one uppercase letter
  requireNumber: true, // Requires at least one number
  requireSpecialChar: true, // Requires at least one special character (e.g., !@#$%^&*)
};

// Booking status constants
export const bookingStatuses = {
  PENDING: 'PENDING',
  CONFIRMED: 'CONFIRMED',
  COMPLETED: 'COMPLETED',
  CANCELLED: 'CANCELLED',
};

// Machine status constants
export const machineStatuses = {
  AVAILABLE: 'AVAILABLE',
  IN_USE: 'IN_USE',
  UNDER_MAINTENANCE: 'UNDER_MAINTENANCE',
};

// Role constants for authorization
export const roles = {
  USER: 'USER',
  EMPLOYEE: 'EMPLOYEE',
  ADMIN: 'ADMIN',
};

// Error messages
export const errorMessages = {
  INVALID_EMAIL: 'Invalid email address format.',
  PASSWORD_TOO_SHORT: `Password must be at least ${passwordConstraints.minLength} characters long.`,
  PASSWORD_TOO_LONG: `Password must be no more than ${passwordConstraints.maxLength} characters long.`,
  PASSWORD_REQUIREMENTS: 'Password must contain at least one uppercase letter, one number, and one special character.',
  USER_ALREADY_EXISTS: 'User already exists with this email.',
  INVALID_CREDENTIALS: 'Invalid email or password.',
  UNAUTHORIZED: 'Unauthorized access.',
  NOT_FOUND: 'Resource not found.',
  INTERNAL_ERROR: 'Internal server error.',
};

// Success messages
export const successMessages = {
  USER_CREATED: 'User successfully created.',
  BOOKING_CREATED: 'Booking successfully created.',
  FEEDBACK_SUBMITTED: 'Feedback successfully submitted.',
  PROFILE_UPDATED: 'Profile successfully updated.',
};

