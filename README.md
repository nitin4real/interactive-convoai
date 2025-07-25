# Conversational AI Demo

A modern React-based web application that demonstrates real-time conversational AI capabilities using Agora's voice communication platform. This project showcases an interactive classroom environment where users can engage with AI agents through voice conversations.

## 🚀 Features

- **Real-time Voice Communication**: Powered by Agora RTC SDK for high-quality audio streaming
- **AI Agent Integration**: Interactive AI agents that respond to voice conversations
- **Live Transcriptions**: Real-time speech-to-text conversion and display
- **Interactive Q&A**: Dynamic question-answer system with AI responses
- **Modern UI/UX**: Beautiful, responsive interface built with Tailwind CSS and Radix UI
- **Authentication System**: Secure login with JWT token-based authentication
- **Content Pad**: Visual content display area for educational materials
- **Theme Support**: Dark/light mode with customizable theming

## 🛠️ Tech Stack

### Frontend
- **React 19** - Modern React with latest features
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool and development server
- **Tailwind CSS 4** - Utility-first CSS framework
- **Radix UI** - Accessible component primitives
- **Lucide React** - Beautiful icon library

### Communication & AI
- **Agora RTC SDK** - Real-time voice communication
- **Agora RTM SDK** - Real-time messaging
- **Socket.IO** - WebSocket communication
- **Axios** - HTTP client for API requests

### State Management & Utilities
- **Zustand** - Lightweight state management
- **React Router DOM** - Client-side routing
- **Class Variance Authority** - Component variant management
- **CLSX** - Conditional className utility

## 📁 Project Structure

```
src/
├── components/          # React components
│   ├── ui/             # Reusable UI components
│   ├── pages/          # Page components
│   ├── sections/       # Main application sections
│   └── layout/         # Layout components
├── services/           # API and external services
├── store/              # Zustand state management
├── hooks/              # Custom React hooks
├── context/            # React context providers
├── config/             # Configuration files
├── types/              # TypeScript type definitions
├── utils/              # Utility functions
├── lib/                # Third-party library configurations
└── assets/             # Static assets
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd interactive-convoai
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   
   Create a `.env` file in the root directory with the following variables:
   ```env
   VITE_API_BASE_URL=your_backend_service_base_url
   VITE_AGORA_APP_ID=your_agora_app_id
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   
   Navigate to `http://localhost:5173` to view the application.

## 📖 Usage

### Authentication

1. **Login**: Use your credentials to access the platform
   - Enter your User ID (numeric)
   - Enter your password
   - Click "Sign In" to authenticate

2. **Session Management**: 
   - JWT tokens are automatically stored in localStorage
   - Automatic token refresh and API authentication
   - Secure logout functionality

### Classroom Experience

1. **Start Class**: 
   - Click "Start Class" to initialize the AI agent
   - Grant microphone permissions when prompted

2. **Voice Interaction**:
   - Speak naturally to interact with the AI agent
   - Real-time transcription appears in the transcriptions panel
   - AI responses are processed and displayed

3. **Q&A System**:
   - View current questions in the Questions section
   - Submit answers through the interface
   - Receive AI-generated feedback

4. **Content Display**:
   - View educational content in the Content Pad
   - Dynamic content updates based on conversation context

5. **Leave Class**:
   - Click "Leave Classroom" to end the session
   - All connections are properly closed

## 🔧 Configuration

### API Configuration

The application uses a centralized API configuration in `src/config/api.config.ts`:

```typescript
export const API_CONFIG = {
  BASE_URL: 'https://convo.agoraaidemo.in:8000',
  ENDPOINTS: {
    AUTH: {
      LOGIN: '/api/auth/login'
    },
    AGENT: {
      START: '/api/agent/start',
      STOP: '/api/agent/stop',
    }
  }
}
```

## 🏗️ Build & Deployment

### Development Build
```bash
npm run dev
```

### Production Build
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

### Deployment

The project is configured for deployment on Vercel with the following settings:

- **Framework Preset**: Vite
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`

## 🔍 Code Quality

### Linting
```bash
npm run lint
```

The project uses ESLint with TypeScript support and React-specific rules.

### TypeScript
```bash
npm run type-check
```

Full TypeScript compilation check for type safety.

## 📱 Responsive Design

The application is fully responsive and optimized for:
- Desktop computers
- Tablets
- Mobile devices

Key responsive features:
- Grid layouts that adapt to screen size
- Touch-friendly interface elements
- Optimized audio controls for mobile

## 🔐 Security Features

- JWT token-based authentication
- Secure API communication with HTTPS
- Automatic token refresh
- Input validation and sanitization
- CORS protection

## 🌐 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 🆘 Support

For technical support or questions:
- Check the documentation
- Review the code comments
- Contact the development team

## 🔄 Version History

- **v0.0.0** - Initial release with core functionality
  - Real-time voice communication
  - AI agent integration
  - Authentication system
  - Modern UI/UX

---

**Note**: This is a demo application showcasing conversational AI capabilities. For production use, additional security measures and error handling should be implemented.
