// src/utils/validation.js
import { emailRegex, passwordConstraints, errorMessages } from './constraints';

/**
 * Validates email format using regex
 * @param {string} email - The email address to validate
 * @returns {boolean} - True if valid, false otherwise
 */
export const validateEmail = (email) => {
  if (!emailRegex.test(email)) {
    throw new Error(errorMessages.INVALID_EMAIL);
  }
  return true;
};

/**
 * Validates password strength based on the defined constraints
 * @param {string} password - The password to validate
 * @returns {boolean} - True if valid, false otherwise
 */
export const validatePassword = (password) => {
  if (password.length < passwordConstraints.minLength) {
    throw new Error(errorMessages.PASSWORD_TOO_SHORT);
  }
  if (password.length > passwordConstraints.maxLength) {
    throw new Error(errorMessages.PASSWORD_TOO_LONG);
  }
  if (passwordConstraints.requireUppercase && !/[A-Z]/.test(password)) {
    throw new Error(errorMessages.PASSWORD_REQUIREMENTS);
  }
  if (passwordConstraints.requireNumber && !/\d/.test(password)) {
    throw new Error(errorMessages.PASSWORD_REQUIREMENTS);
  }
  if (passwordConstraints.requireSpecialChar && !/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    throw new Error(errorMessages.PASSWORD_REQUIREMENTS);
  }
  return true;
};

/**
 * Validates that a booking time is in the future
 * @param {Date} bookingTime - The booking time to validate
 * @returns {boolean} - True if the booking time is valid (in the future), false otherwise
 */
export const validateBookingTime = (bookingTime) => {
  const now = new Date();
  if (bookingTime <= now) {
    throw new Error('Booking time must be in the future.');
  }
  return true;
};

/**
 * Validates that the machine status is valid
 * @param {string} status - The status to validate
 * @returns {boolean} - True if the status is valid, false otherwise
 */
export const validateMachineStatus = (status) => {
  const validStatuses = Object.values(machineStatuses);
  if (!validStatuses.includes(status)) {
    throw new Error('Invalid machine status.');
  }
  return true;
};

/**
 * Validates that feedback content is not empty
 * @param {string} content - The feedback content to validate
 * @returns {boolean} - True if valid, false otherwise
 */
export const validateFeedbackContent = (content) => {
  if (!content || content.trim().length === 0) {
    throw new Error('Feedback content cannot be empty.');
  }
  return true;
};
