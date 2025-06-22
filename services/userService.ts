import { User } from '../types/api';
const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL || 'http://localhost:4000';

export interface AuthResponse {
  token: string;
  user: User;
}

export async function loginUser({ email, password }: { email: string; password: string }): Promise<AuthResponse> {
  const response = await fetch(`${API_BASE_URL}/api/users/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  if (!response.ok) {
    throw new Error('Login failed');
  }
  return response.json();
}

export async function registerUser({ name, email, password }: { name: string; email: string; password: string }): Promise<User> {
  const response = await fetch(`${API_BASE_URL}/api/users/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password }),
  });
  if (!response.ok) {
    throw new Error('Registration failed');
  }
  return response.json();
}

export async function getProfile(token?: string): Promise<User> {
  const response = await fetch(`${API_BASE_URL}/api/users/me`, {
    headers: {
      'Authorization': `Bearer ${token || ''}`,
    },
  });
  if (!response.ok) {
    throw new Error('Failed to fetch profile');
  }
  return response.json();
}

export function logoutUser() {
  // Remove token from storage if needed
}
