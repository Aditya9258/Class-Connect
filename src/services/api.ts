import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  withCredentials: true // Important for sending/receiving HTTP-only cookies
});

// Intercept requests to add the Authorization header if we have an access token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken') || localStorage.getItem('educator_token') || localStorage.getItem('student_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => Promise.reject(error));

// Intercept responses to handle 401 Unauthorized errors (refresh token logic)
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If error is 401 and we haven't retried yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Try to refresh the token
        const response = await axios.post(
          'http://localhost:5000/api/auth/refresh',
          {},
          { withCredentials: true }
        );

        const { accessToken } = response.data;
        localStorage.setItem('accessToken', accessToken);

        // Update the authorization header and retry the original request
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        // If refresh fails, the user needs to log in again
        localStorage.removeItem('accessToken');
        
        // Prevent redirecting if we are using custom tokens that might still be valid
        // or just let it fail so the component can handle it
        if (!localStorage.getItem('educator_token') && !localStorage.getItem('student_token')) {
          window.location.href = '/login';
        }
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
