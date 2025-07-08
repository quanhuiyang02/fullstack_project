// API 基本配置
const API_BASE_URL = 'http://localhost:8000/api';

/**
 * 一個通用的 API 調用函數
 * @param {string} endpoint - API 的路徑，例如 '/pet/get_pet.php'
 * @param {object} options - fetch 函數的額外配置，例如 method, body
 * @returns {Promise<any>} - 解析後的 JSON 數據
 * @throws {Error} - 當網絡響應不為 ok 時拋出錯誤
 */

import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:88/api.php';

export const fetchPetData = async (userId) => {
  const response = await axios.get(`${API_URL}?action=getPet&user=${userId}`);
  return response.data;
};

export const updatePetData = async (userId, petData) => {
  await axios.post(`${API_URL}?action=updatePet`, { user: userId, pet: petData });
};

export const loginUser = async (username, password) => {
  const response = await axios.post(`${API_URL}?action=login`, { username, password });
  return response.data;
};