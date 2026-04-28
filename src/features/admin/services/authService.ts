// Mock data para el servicio de autenticación

export interface LoginPayload {
  email: string;
  password: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
    avatar?: string;
  };
}

export const authService = {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  login: async (_payload: LoginPayload): Promise<AuthResponse> => {
    // Simulación de login
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return {
      accessToken: 'mock-access-token-xyz',
      refreshToken: 'mock-refresh-token-xyz',
      user: {
        id: '1',
        name: 'Admin GCPE',
        email: 'admin@universitas.edu',
        role: 'admin',
        avatar: undefined,
      },
    };
  },

  logout: async (): Promise<void> => {
    await new Promise((resolve) => setTimeout(resolve, 500));
  },

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  refreshToken: async (_token: string): Promise<{ accessToken: string }> => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    return { accessToken: 'mock-new-access-token-xyz' };
  },
};
