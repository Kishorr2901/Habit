const API_BASE_URL = 'http://localhost:5000/api';

const getAuthHeaders = () => {
  const token = localStorage.getItem('habitgarden_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  };
};

export const apiCall = async (endpoint, method = 'GET', data = null) => {
  const options = {
    method,
    headers: getAuthHeaders()
  };

  if (data) {
    options.body = JSON.stringify(data);
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, options);
    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || 'Something went wrong. Please try again.');
    }

    return result;
  } catch (error) {
    throw error;
  }
};
