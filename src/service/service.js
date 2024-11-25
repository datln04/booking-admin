/* eslint-disable prettier/prettier */
import axios from 'axios';
const API_URL = 'https://travelbookingsystemapi20241109163138.azurewebsites.net/api';

export const fetchData = async (param) => {
  const { data } = await axios.get(API_URL + param);
  return data;
}

export const createData = async (prefix, newData) => {
  const { data } = await axios.post(API_URL + prefix, newData);
  return data;
}

export const updateData = async (id, updatedData) => {
  const { data } = await axios.put(`${API_URL}${id}`, updatedData);
  return data;
}

export const deleteData = async (id) => {
  const { data } = await axios.delete(`${API_URL}${id}`);
  return data;
}

export const fetchFilteredData = async (prefix, filter) => {
  const { data } = await axios.post(`${API_URL}${prefix}/filter`, filter, {
    headers: {
      'Content-Type': 'application/json',
      'accept': '*/*'
    }
  });
  return data;
}