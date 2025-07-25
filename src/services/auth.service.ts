import axios from '../config/axios.config';
import { API_CONFIG } from '../config/api.config';

axios.defaults.baseURL = API_CONFIG.BASE_URL;
axios.defaults.headers.common['Content-Type'] = 'application/json';


export interface LoginCredentials {
  id: number;
  password: string;
}

export interface LoginResponse {
  token: string;
  brandDetails: {
    brandName: string;
    brandLogo: string;
  };
}

export interface BrandDetails {
  brandName: string;
  brandLogo: string;
}

export const authService = {
  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    const response = await axios.post<LoginResponse>(API_CONFIG.ENDPOINTS.AUTH.LOGIN, credentials);
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
    }
    localStorage.setItem('brandDetails', JSON.stringify(response.data.brandDetails));
    return response.data;
  },

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('brandDetails');
  },

  getToken(): string | null {
    return localStorage.getItem('token');
  },

  getBrandDetails(): BrandDetails | null {
    const brandDetails = localStorage.getItem('brandDetails');
    if (!brandDetails) {
      return null;
    }
    return JSON.parse(brandDetails);
  }
};

axios.interceptors.request.use(
  (config) => {
    const token = authService.getToken();
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: unknown) => {
    return Promise.reject(error);
  }
); 