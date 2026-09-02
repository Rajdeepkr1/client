import { api } from './client';
import type { AuthUser } from '../types';

export function register(name: string, email: string, password: string) {
  return api<{ token: string; user: AuthUser }>('/auth/register', {
    method: 'POST',
    body: { name, email, password },
  });
}

export function login(email: string, password: string) {
  return api<{ token: string; user: AuthUser }>('/auth/login', {
    method: 'POST',
    body: { email, password },
  });
}
