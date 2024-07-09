import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from "expo-router";


// Change the baseURL to your ngrok URL
const api = axios.create({
  baseURL: '{your-ngrok-url}/api/',
});



// Function to clear authentication token
export const clearAuthToken = async () => {
  try {
    await AsyncStorage.removeItem('access_token');
    await AsyncStorage.removeItem('refresh_token');
    await AsyncStorage.removeItem('authToken');

    delete api.defaults.headers.common['Authorization'];
    // Redirect to the login screen after logout
    // const router = useRouter();
    // router.replace("/(authenticate)/login");
  } catch (error) {
    console.error('Error clearing authentication token:', error);
  }
};

api.interceptors.request.use(
  async (config) => {
    const access_token = await AsyncStorage.getItem('access_token');
    if (access_token) {
      config.headers.Authorization = `Bearer ${access_token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response.status === 401 &&
      !originalRequest._retry &&
      error.config.url !== 'auth/token/refresh/'
    ) {
      originalRequest._retry = true;

      try {
        const refresh_token = await AsyncStorage.getItem('refresh_token');
        const response = await api.post('auth/token/refresh/', {
          refresh: refresh_token,
        });

        const new_access_token = response.data.access;
        await AsyncStorage.setItem('access_token', new_access_token);

        originalRequest.headers.Authorization = `Bearer ${new_access_token}`;

        return axios(originalRequest);
      } catch (error) {
        console.error('Failed to refresh token:', error);
        // Redirect to login screen to handle reauthentication
        const router = useRouter();
        router.replace("/(authenticate)/login");
      }
    }
    return Promise.reject(error);
  }
);

export default api;
