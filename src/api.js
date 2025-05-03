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
    const response = await axios.get(`${API_URL}/events/user/${userId}`);
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
