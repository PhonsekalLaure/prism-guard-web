const mockUser = {
  profile: { role: 'client' },
  redirect: '/cms/dashboard',
};

export default {
  getMe: async () => mockUser,
  login: async () => mockUser,
  logout: async () => {},
  getToken: () => 'mock-token',
  getProfile: () => mockUser.profile,
  clearTokens: () => {},
};