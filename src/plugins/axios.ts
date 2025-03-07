import axios from 'axios';

export const BASE_URL = 'https://ec-course-api.hexschool.io/v2';
export const PATH = 'andy_react';

// 創建基本 API 實例
export const api = axios.create({
  baseURL: BASE_URL
});

// 創建需要驗證的 API 實例
export const apiAuth = axios.create({
  baseURL: BASE_URL
});

// 為需要驗證的請求添加攔截器
apiAuth.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = token;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);