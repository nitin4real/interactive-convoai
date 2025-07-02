export const API_CONFIG = {
  // BASE_URL: 'https://convo.agoraaidemo.in:8000',
  // SOCKET_URL: 'https://convo.agoraaidemo.in:8000',
  BASE_URL: 'http://localhost:3006/',
  // SOCKET_URL: 'http://localhost:8000',

  ENDPOINTS: {
    AUTH: {
      LOGIN: '/api/v1/auth/login'
    },
    AGENT: {
      START: '/api/v1/agent/start',
      STOP: '/api/v1/agent/stop',
    }
  }
} as const; 