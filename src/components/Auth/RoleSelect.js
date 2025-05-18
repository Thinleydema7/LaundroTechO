// src/components/Auth/RoleSelect.js

import React from 'react';

const RoleSelect = ({ role, onChange }) => {
  return (
    <div className="role-select">
      <label htmlFor="role" className="label">
        Select Role
      </label>
      <select
        id="role"
        name="role"
        value={role}
        onChange={(e) => onChange(e.target.value)}
        className="select"
      >
        <option value="USER">User</option>
        <option value="EMPLOYEE">Employee</option>
        <option value="ADMIN">Admin</option>
      </select>

      <style jsx>{`
        .role-select {
          margin-top: 1rem;
          display: flex;
          flex-direction: column;
        }

        .label {
          font-size: 1rem;
          font-weight: bold;
          color: #2c3e50;
        }

        .select {
          padding: 10px;
          margin-top: 0.5rem;
          font-size: 1rem;
          border: 1px solid #ddd;
          border-radius: 5px;
          outline: none;
          transition: border-color 0.3s ease;
        }

        .select:focus {
          border-color: #4CAF50;
        }
      `}</style>
    </div>
  );
};

export default RoleSelect;
