import Cookies from 'js-cookie';

const BASE_URL = 'http://localhost:8000'; // 

export const apiRequest = async (endpoint, method = 'GET', body = null) => {
  const token = Cookies.get('token');

  if (!token) {
    throw new Error('No authentication token found');
  }

  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  };

  const config = {
    method,
    headers,
  };

  if (body) {
    config.body = JSON.stringify(body);
  }

  const response = await fetch(`${BASE_URL}${endpoint}`, config);

  if (response.status === 401) {
    Cookies.remove('token');
    window.location.href = '/login';
    throw new Error('Authentication failed');
  }

  return response;
};