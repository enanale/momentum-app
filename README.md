# Momentum App

A modern web application built with React, TypeScript, and Firebase, featuring a clean Material-UI interface with Google authentication and a responsive, calming design.

## Features

- 🎨 Modern, responsive UI with a calming gradient theme
- 🔐 Google Authentication integration
- 📱 Full-screen layout with fixed navigation
- 🎯 Personalized greeting based on user login state
- 💅 CSS Modules for component-scoped styling
- 🚀 Fast development with Vite
- 🔥 Seamless Firebase integration

## Tech Stack

- **Frontend Framework**: React with TypeScript
- **Build Tool**: Vite
- **UI Framework**: Material-UI (MUI)
  - Custom theme with gradient styles
  - Responsive AppBar
  - Material Icons
- **Styling**: CSS Modules with TypeScript support
- **Backend Services**: Firebase
  - Authentication (Google Sign-in)
  - Firestore Database
  - Hosting
  - Analytics
- **Development Tools**:
  - TypeScript for type safety
  - Environment variables for configuration
  - Hot Module Replacement (HMR)

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm (v8 or higher)
- Firebase CLI (`npm install -g firebase-tools`)

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the root directory with your Firebase configuration:
   ```env
   VITE_FIREBASE_API_KEY=your_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id
   ```

### Development

Start the development server:
```bash
npm run dev
```

### Building for Production

Build the app:
```bash
npm run build
```

### Deployment

Deploy to Firebase Hosting:
```bash
firebase deploy --only hosting
```

## Live Demo

Visit the live application at: https://momentum-app-65c5d.web.app

## Project Structure

```
momentum/
├── src/
│   ├── hooks/
│   │   └── useAuth.ts       # Firebase authentication hook
│   ├── styles/
│   │   ├── App.module.css   # Component styles
│   │   └── *.d.ts          # TypeScript declarations
│   ├── App.tsx             # Main application component
│   ├── main.tsx            # Application entry point
│   └── firebase.ts         # Firebase configuration
├── public/                 # Static assets
├── .env                    # Environment variables
└── firebase.json          # Firebase configuration
```

## Styling

The application uses a combination of Material-UI's theming system and CSS Modules:

- Custom gradients for visual appeal
- Responsive layout with proper spacing
- Component-scoped styles using CSS Modules
- TypeScript integration for style safety

## Authentication

User authentication is handled through Firebase Authentication:

- Google Sign-in integration
- Persistent user sessions
- Secure authentication state management
- Personalized user experience

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
