// src/components/Auth/SignUpForm.js

import React, { useState } from 'react';

const SignUpForm = ({ onSubmit }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('USER'); // Default role is USER
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    // Basic validation for empty fields
    if (!name || !email || !password) {
      setError('Please fill in all fields');
      return;
    }

    // Trigger the onSubmit function passed as a prop
    onSubmit({ name, email, password, role });
  };

  return (
    <form onSubmit={handleSubmit} className="signup-form">
      <h2>Sign Up</h2>

      {/* Name Field */}
      <div className="input-group">
        <label htmlFor="name">Name</label>
        <input
          type="text"
          id="name"
          name="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="input-field"
        />
      </div>

      {/* Email Field */}
      <div className="input-group">
        <label htmlFor="email">Email</label>
        <input
          type="email"
          id="email"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="input-field"
        />
      </div>

      {/* Password Field */}
      <div className="input-group">
        <label htmlFor="password">Password</label>
        <input
          type="password"
          id="password"
          name="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="input-field"
        />
      </div>

      {/* Role Selection Field */}
      <div className="input-group">
        <label htmlFor="role">Role</label>
        <select
          id="role"
          name="role"
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="input-field"
        >
          <option value="USER">User</option>
          <option value="EMPLOYEE">Employee</option>
          <option value="ADMIN">Admin</option>
        </select>
      </div>

      {/* Error Message */}
      {error && <p className="error">{error}</p>}

      {/* Submit Button */}
      <button type="submit" className="submit-btn">
        Sign Up
      </button>

      <style jsx>{`
        .signup-form {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 2rem;
          max-width: 400px;
          margin: 0 auto;
          background-color: #f9f9f9;
          border-radius: 8px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }

        h2 {
          font-size: 2rem;
          color: #2c3e50;
          margin-bottom: 1.5rem;
        }

        .input-group {
          width: 100%;
          margin-bottom: 1rem;
        }

        .input-group label {
          font-size: 1rem;
          color: #2c3e50;
          margin-bottom: 0.5rem;
        }

        .input-field {
          width: 100%;
          padding: 10px;
          font-size: 1rem;
          border: 1px solid #ddd;
          border-radius: 5px;
          outline: none;
          transition: border-color 0.3s ease;
        }

        .input-field:focus {
          border-color: #3498db;
        }

        .error {
          color: #e74c3c;
          font-size: 0.9rem;
          margin-bottom: 1rem;
        }

        .submit-btn {
          padding: 12px 25px;
          background-color: #3498db;
          color: white;
          border: none;
          border-radius: 5px;
          font-size: 1.1rem;
          cursor: pointer;
          transition: background-color 0.3s ease;
        }

        .submit-btn:hover {
          background-color: #2980b9;
        }
      `}</style>
    </form>
  );
};

export default SignUpForm;
