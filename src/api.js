import axios from "axios";

const API_URL = "https://lokit.onrender.com/api";

export const getEvents = async () => {
  try {
    const response = await axios.get(`${API_URL}/events`);
    return response.data;
  } catch (error) {
    console.error("Error fetching events:", error);
    throw error;
  }
};

export const getEventById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/events/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching event by ID:", error);
    throw error;
  }
};

export const getEventsByUserId = async (userId) => {
  try {
    const response = await axios.get(`${API_URL}/users/${userId}/events`);
    return response.data;
  } catch (error) {
    console.error("Error fetching events by user ID:", error);
    throw error;
  }
};

export const createUser = async (user) => {
  try {
    const response = await axios.post(`${API_URL}/users`, user);
    return response.data;
  } catch (error) {
    console.error("Error creating user:", error);
    throw error;
  }
};

export const getUser = async (userId) => {
  try {
    const response = await axios.get(`${API_URL}/users/${userId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching user:", error);
    throw error;
  }
};

export const updateUser = async (userId, user) => {
  try {
    const response = await axios.patch(`${API_URL}/users/${userId}`, user);
    return response.data;
  } catch (error) {
    console.error("Error updating user:", error);
    throw error;
  }
};

export const getUserIdByEmail = async (email) => {
  try {
    const response = await axios.get(`${API_URL}/users/email/${email}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching user ID by email:", error);
    throw error;
  }
};

export const getTasksByEventId = async (eventId) => {
  try {
    const response = await axios.get(`${API_URL}/events/${eventId}/tasks`);
    return response.data;
  } catch (error) {
    console.error("Error fetching trip by ID:", error);
    throw error;
  }
};

export const getTaskById = async (eventId, taskId) => {
  try {
    const response = await axios.get(
      `${API_URL}/events/${eventId}/tasks/${taskId}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching task by ID:", error);
    throw error;
  }
};

export const addMemberToEvent = async (eventId, memberId) => {
  try {
    const response = await axios.post(
      `${API_URL}/events/${eventId}/members`,
      memberId
    );
    return response.data;
  } catch (error) {
    console.error("Error adding member to event:", error);
    throw error;
  }
};

export const removeMemberFromEvent = async (eventId, memberId) => {
  try {
    const response = await axios.delete(
      `${API_URL}/events/${eventId}/members`,
      { data: memberId }
    );
    return response.data;
  } catch (error) {
    console.error("Error removing member from event:", error);
    throw error;
  }
};

export const getEventMemberById = async (eventId, userId) => {
  try {
    const response = await axios.get(
      `${API_URL}/events/${eventId}/members/${userId}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching event member by ID:", error);
    throw error;
  }
};

export const joinEventConfirmation = async (email, eventName) => {
  try {
    const response = await axios.post(`${API_URL}/send-email`, {
      to: email,
      subject: "Lokit - Join Event Confirmation",
      text: `Congratulations! You have been added to an event. ${eventName}`,
    });
    return response.data;
  } catch (error) {
    console.error("Error joining event by email:", error);
    throw error;
  }
};
export const leaveEventConfirmation = async (email, eventName) => {
  try {
    const response = await axios.post(`${API_URL}/send-email`, {
      to: email,
      subject: "Lokit - Leave Event Confirmation",
      text: `You have been removed from an event. ${eventName}`,
    });
    return response.data;
  } catch (error) {
    console.error("Error leaving event by email:", error);
    throw error;
  }
};

export const createEvent = async (event) => {
  try {
    const response = await axios.post(`${API_URL}/events`, event);
    return response.data;
  } catch (error) {
    console.error("Error creating event:", error);
    throw error;
  }
};

export const updateEvent = async (eventId, event) => {
  try {
    const response = await axios.patch(`${API_URL}/events/${eventId}`, event);
    return response.data;
  } catch (error) {
    console.error("Error updating event:", error);
    throw error;
  }
};

export const deleteEvent = async (eventId) => {
  try {
    const response = await axios.delete(`${API_URL}/events/${eventId}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting event:", error);
    throw error;
  }
};

export const createTask = async (eventId, task) => {
  try {
    const response = await axios.post(
      `${API_URL}/events/${eventId}/tasks`,
      task
    );
    return response.data;
  } catch (error) {
    console.error("Error creating task:", error);
    throw error;
  }
};

export const updateTask = async (eventId, taskId, task) => {
  try {
    const response = await axios.patch(
      `${API_URL}/events/${eventId}/tasks/${taskId}`,
      task
    );
    return response.data;
  } catch (error) {
    console.error("Error updating task:", error);
    throw error;
  }
};

export const deleteTask = async (eventId, taskId) => {
  try {
    const response = await axios.delete(
      `${API_URL}/events/${eventId}/tasks/${taskId}`
    );
    return response.data;
  } catch (error) {
    console.error("Error deleting task:", error);
    throw error;
  }
};

export const getEventMembers = async (eventId) => {
  try {
    const response = await axios.get(`${API_URL}/events/${eventId}/members`);
    return response.data;
  } catch (error) {
    console.error("Error fetching event members:", error);
    throw error;
  }
};
