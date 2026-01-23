const TOKEN_KEY = 'Authorization';

export const tokenService = {
  saveToken: (token: string): void => {
    sessionStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem('token', token); // Também salva no localStorage para o interceptor
  },

  getToken: (): string | null => {
    return sessionStorage.getItem(TOKEN_KEY) || localStorage.getItem('token');
  },

  removeToken: (): void => {
    sessionStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem('token');
  },
};

export const authService = {
  logout: (): void => {
    tokenService.removeToken();
    window.location.href = '/login';
  },

  isLoggedIn: (): boolean => {
    return tokenService.getToken() !== null;
  },
};
