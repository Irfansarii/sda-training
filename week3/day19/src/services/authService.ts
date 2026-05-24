import { apiService } from './apiService';

class AuthService {
  async login(credentials: { email: string; password: string }) {
    return apiService.login(credentials);
  }

  async logout() {
    return apiService.logout();
  }

  async getCurrentUser() {
    return apiService.getCurrentUser();
  }
}

export const authService = new AuthService();
