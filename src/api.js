import axios from "axios";

const API_URL = "https://lokit.onrender.com/api";

export const getEvents = async () => {
  const response = await axios.get(`${API_URL}/events`);
  return response.data;
};

export const getEventById = async (id) => {
  const response = await axios.get(`${API_URL}/events/${id}`);
  return response.data;
};

export const getEventsByUserId = async (userId) => {
  const response = await axios.get(`${API_URL}/events/user/${userId}`);
  return response.data;
};

export const createUser = async (user) => {
  const response = await axios.post(`${API_URL}/users`, user);
  return response.data;
};
