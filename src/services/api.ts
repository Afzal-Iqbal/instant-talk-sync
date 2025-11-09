import { API_URL } from '@/config/api';

export interface User {
  _id: string;
  email: string;
  displayName: string;
  token: string;
}

export interface LoginResponse {
  user: User;
  token: string;
}

export interface SignupData {
  email: string;
  password: string;
  displayName: string;
}

export interface LoginData {
  email: string;
  password: string;
}

// Signup API call
export const signup = async (data: SignupData): Promise<LoginResponse> => {
  const response = await fetch(`${API_URL}/api/auth/signup`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Signup failed');
  }

  return response.json();
};

// Login API call
export const login = async (data: LoginData): Promise<LoginResponse> => {
  const response = await fetch(`${API_URL}/api/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Login failed');
  }

  return response.json();
};

// Get messages API call
export const getMessages = async (token: string) => {
  const response = await fetch(`${API_URL}/api/messages`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch messages');
  }

  return response.json();
};
