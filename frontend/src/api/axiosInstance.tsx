import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:3000', // Backend portu
});

axiosInstance.interceptors.request.use((config: any) => { // <--- any kullan
  const token = localStorage.getItem('token');

  // headers varsa kullan, yoksa boş obje oluştur
  config.headers = config.headers || {};

  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
});

export default axiosInstance;
