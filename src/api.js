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

export const sendConfirmationEmail = async (
  email,
  eventName,
  eventImage,
  tasks
) => {
  const tasksHtml = tasks
    .map(
      (task) => `<li key=${task.task_id}>
  <img src="${task.task_image}" alt="Task Image" />
  <p>${task.task_name}</p>
  <p>${task.task_start_time}</p>
  <p>${task.task_end_time}</p>
  <p>${task.task_description}</p>
  </li>`
    )
    .join("");
  try {
    const response = await axios.post(`${API_URL}/send-email`, {
      to: email,
      subject: "Congratulation",
      text: "You have been added to a new event",
      html: `<p>You have been added to a new event: ${eventName}</p>
      <img src="${eventImage}" alt="Event Image" />
      <ul>
        ${tasksHtml}
      </ul>`,
    });
    return response.data;
  } catch (error) {
    console.error("Error sending confirmation email:", error);
    throw error;
  }
};

export const sendRemovalEmail = async (email, eventName) => {
  try {
    const response = await axios.post(`${API_URL}/send-email`, {
      to: email,
      subject: "Removal",
      text: "You have been removed from an event",
      html: `<p>You have been removed from an event: ${eventName}</p>`,
    });
    return response.data;
  } catch (error) {
    console.error("Error sending removal email:", error);
    throw error;
  }
};
