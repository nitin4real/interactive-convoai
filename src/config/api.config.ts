export const API_CONFIG = {
  BASE_URL: 'https://convo.agoraaidemo.in:8000',
  // SOCKET_URL: 'https://convo.agoraaidemo.in:8000',
  // BASE_URL: 'http://localhost:8000',
  // SOCKET_URL: 'http://localhost:8000',

  ENDPOINTS: {
    AUTH: {
      LOGIN: '/api/auth/login'
    },
    AGENT: {
      START: '/api/agent/start',
      STOP: '/api/agent/stop',
    }
  }
} as const; 