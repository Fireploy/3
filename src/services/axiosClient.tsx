import axios from 'axios';
const URL_BACKEND = 'http://149.56.23.5:3010';

const axiosClient = axios.create({
  baseURL: URL_BACKEND,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosClient.interceptors.request.use(
  (config) => {
    const apiKey = '%Vc4*dL3Nygw';
    if (apiKey) {
      config.headers['x-api-key'] = apiKey;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosClient;