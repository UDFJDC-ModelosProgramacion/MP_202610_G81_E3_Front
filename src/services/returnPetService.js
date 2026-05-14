import axios from "axios";

const API_URL = "http://localhost:8999/api/returnpets";

export const createReturn = async (returnData) => {
  const response = await axios.post(API_URL, returnData);
  return response.data;
};

export const getReturns = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};