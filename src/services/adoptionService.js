import axios from "axios";

const API_URL = "http://localhost:8080/api/adoptions";

export const createAdoption = async (adoptionData) => {
  const response = await axios.post(API_URL, adoptionData);
  return response.data;
};

export const getAdoptions = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

export const getAdoptionById = async (id) => {
  const response = await axios.get(`${API_URL}/${id}`);
  return response.data;
};

export const updateAdoptionStatus = async (id, status) => {
  const response = await axios.put(`${API_URL}/${id}`, { status });
  return response.data;
};