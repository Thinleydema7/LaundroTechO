// src/models/Feedback.js

import { getDbClient } from '../lib/db'; // Import the Prisma client

const prisma = getDbClient(); // Initialize the Prisma client

// Create a new feedback entry
export async function createFeedback({ userId, content }) {
  try {
    const feedback = await prisma.feedback.create({
      data: {
        userId,
        content,
      },
    });
    return feedback;
  } catch (error) {
    throw new Error('Error creating feedback: ' + error.message);
  }
}

// Get feedback by its ID
export async function getFeedbackById(feedbackId) {
  try {
    const feedback = await prisma.feedback.findUnique({
      where: {
        id: feedbackId,
      },
    });
    return feedback;
  } catch (error) {
    throw new Error('Error fetching feedback: ' + error.message);
  }
}

// Get all feedback for a specific user
export async function getFeedbackByUserId(userId) {
  try {
    const feedbacks = await prisma.feedback.findMany({
      where: {
        userId,
      },
    });
    return feedbacks;
  } catch (error) {
    throw new Error('Error fetching user feedback: ' + error.message);
  }
}

// Get all feedback
export async function getAllFeedback() {
  try {
    const feedbacks = await prisma.feedback.findMany();
    return feedbacks;
  } catch (error) {
    throw new Error('Error fetching feedback: ' + error.message);
  }
}

// Delete feedback by its ID
export async function deleteFeedback(feedbackId) {
  try {
    const deletedFeedback = await prisma.feedback.delete({
      where: {
        id: feedbackId,
      },
    });
    return deletedFeedback;
  } catch (error) {
    throw new Error('Error deleting feedback: ' + error.message);
  }
}
