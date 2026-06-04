const API_URL = '/api';

// Retrieve stored token
export const getToken = (): string | null => {
  return localStorage.getItem('admin_token') || sessionStorage.getItem('admin_token') || localStorage.getItem('adminToken') || sessionStorage.getItem('adminToken');
};

// Check if authenticated
export const isAuthenticated = (): boolean => {
  return !!getToken();
};

// General API request wrapper
export const makeApiRequest = async (
  endpoint: string,
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' = 'GET',
  body?: any
) => {
  const token = getToken();
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    'X-User': 'visitor',
    'X-Timestamp': new Date().toISOString()
  };

  if (token) {
    headers['X-Session-Token'] = token;
    headers['Authorization'] = `Bearer ${token}`;
  }

  const config: RequestInit = {
    method,
    headers
  };

  if (body) {
    config.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(`${API_URL}${endpoint}`, config);
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || data.message || `Request failed with status ${response.status}`);
    }
    
    return data;
  } catch (error: any) {
    console.error(`API Call failed to ${endpoint}:`, error);
    throw error;
  }
};
