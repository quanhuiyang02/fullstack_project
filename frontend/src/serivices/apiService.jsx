// API 基本配置
const API_BASE_URL = 'http://localhost:8000/api';

/**
 * 一個通用的 API 調用函數
 * @param {string} endpoint - API 的路徑，例如 '/pet/get_pet.php'
 * @param {object} options - fetch 函數的額外配置，例如 method, body
 * @returns {Promise<any>} - 解析後的 JSON 數據
 * @throws {Error} - 當網絡響應不為 ok 時拋出錯誤
 */
export const apiCall = async (endpoint, options = {}) => {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    // 預設配置
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  });

  if (!response.ok) {
    // 讓調用者去處理 HTTP 錯誤
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json(); // 回傳解析後的 JSON promise
};