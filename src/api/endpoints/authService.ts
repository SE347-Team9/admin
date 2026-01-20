import axiosClient from '../axiosClient';

interface LoginResponse {
  success: boolean;
  data: {
    id: string;
    username: string;
    fullName: string;
    role: string;
    token: string;
  };
  message: string;
}

export interface DecodedToken {
  userId: string;
  role: string;
  agencyId?: number;
  iat: number;
  exp: number;
}

// Decode JWT token
const decodeToken = (token: string): DecodedToken | null => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(c => {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload);
  } catch (error) {
    return null;
  }
};

export const authService = {
  // Login
  login: async (username: string, password: string): Promise<LoginResponse> => {
    const response: LoginResponse = await axiosClient.post('/auth/login', { username, password });
    
    // Lưu token và user info vào localStorage
    if (response.success && response.data.token) {
      localStorage.setItem('token', response.data.token);
      
      // Decode token to get agencyId if exists
      const decoded = decodeToken(response.data.token);
      const userWithAgency = {
        ...response.data,
        agencyId: decoded?.agencyId
      };
      
      localStorage.setItem('user', JSON.stringify(userWithAgency));
    }
    
    return response;
  },

  // Logout
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  // Get current user from localStorage
  getCurrentUser: () => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  // Check if user is authenticated
  isAuthenticated: (): boolean => {
    return !!localStorage.getItem('token');
  }
};

// Default export for compatibility
export default authService;
