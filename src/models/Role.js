// src/models/Role.js

import { getDbClient } from '../lib/db'; // Import the Prisma client

const prisma = getDbClient(); // Initialize the Prisma client

// Create a new user with a specific role
export async function createUserWithRole({ name, email, password, role }) {
  try {
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password,
        role,
      },
    });
    return user;
  } catch (error) {
    throw new Error('Error creating user with role: ' + error.message);
  }
}

// Get users by role (e.g., get all employees)
export async function getUsersByRole(role) {
  try {
    const users = await prisma.user.findMany({
      where: {
        role,
      },
    });
    return users;
  } catch (error) {
    throw new Error('Error fetching users by role: ' + error.message);
  }
}

// Update a user's role
export async function updateUserRole(userId, newRole) {
  try {
    const updatedUser = await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        role: newRole,
      },
    });
    return updatedUser;
  } catch (error) {
    throw new Error('Error updating user role: ' + error.message);
  }
}

// Get all roles (from enum, this is just for reference)
export function getAllRoles() {
  return ['USER', 'EMPLOYEE', 'ADMIN']; // Enum values, can be extended if needed
}

// Check if a user has a specific role
export async function hasRole(userId, role) {
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });
    return user.role === role;
  } catch (error) {
    throw new Error('Error checking user role: ' + error.message);
  }
}
