// src/lib/utils.js

// Function to format dates to a readable format
export function formatDate(date) {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(date).toLocaleDateString('en-US', options);
}

// Function to validate email format
export function validateEmail(email) {
  const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailPattern.test(email);
}

// Function to generate a random string (for token generation, etc.)
export function generateRandomString(length = 32) {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

// Function to check if a string is empty
export function isEmpty(str) {
  return !str || str.trim().length === 0;
}

// Function to sanitize inputs (example for preventing XSS)
export function sanitizeInput(input) {
  return input.replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/&/g, '&amp;');
}

