# Momentum App

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Firebase Hosting](https://img.shields.io/badge/deploy-Firebase-orange)](https://momentum-app-65c5d.web.app)

A modern web application built with React, TypeScript, and Firebase, featuring a clean Material-UI interface with Google authentication and a responsive, calming design.

## Screenshots

| Landing Page | Daily Operating Doc |
| :---: | :---: |
| *Screenshot of the main landing page* | *Screenshot of the daily actions list* |

| Focus Timer | I'm Stuck Form |
| :---: | :---: |
| *Screenshot of the focus timer in action* | *Screenshot of the 'I'm Stuck' input form* |

## Features

- 🎨 Modern, responsive UI with a calming gradient theme
- 🔐 Google Authentication integration
- 📱 Full-screen layout with fixed navigation
- 🎯 Personalized greeting based on user login state
- ✨ AI-powered suggestions for next actions (using Google's Gemini model)
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
  - Cloud Functions for serverless logic
  - Vertex AI for machine learning models
- **Development Tools**:
  - TypeScript for type safety
  - Environment variables for configuration
  - Hot Module Replacement (HMR)

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm (v8 or higher)
- Firebase CLI (`npm install -g firebase-tools`)

### Firebase Project Setup

Before you can run the application, you need to set up a Firebase project.

1. **Create a Firebase Project**:
    - Go to the [Firebase Console](https://console.firebase.google.com/).
    - Click "Add project" and follow the on-screen instructions.

2. **Enable Firebase Services**:
    In the Firebase console for your new project, navigate to the "Build" section in the left-hand menu and enable the following services:
    - **Authentication**: Go to the "Authentication" section, click "Get started", and enable the **Google** sign-in provider.
    - **Firestore Database**: Go to the "Firestore Database" section, click "Create database", and start in **production mode**. Choose a location close to your users.
    - **Hosting**: Go to the "Hosting" section and click "Get started".

3. **Enable Google Cloud Services for AI Features**:
    This project uses Firebase Cloud Functions and Vertex AI for the suggestion feature.
    - **Upgrade Your Project**: In the Firebase console, click the gear icon next to "Project Overview" and go to "Usage and billing". Select the **Blaze (Pay-as-you-go)** plan. This is required to use Cloud Functions and Vertex AI.
    - **Enable APIs**:
        - Visit the [Google Cloud Console API Library](https://console.cloud.google.com/apis/library) for your project.
        - Search for and enable the **Vertex AI API**.
        - The Cloud Functions API and others will be enabled automatically during deployment.

4. **Register Your Web App**:
    - In the Firebase console, go to "Project Settings" (gear icon).
    - Under the "General" tab, scroll down to "Your apps".
    - Click the web icon (`</>`) to register a new web app.
    - Give it a nickname (e.g., "Momentum Web") and click "Register app".
    - Firebase will provide you with a configuration object. You will use these values in the next step.

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

Visit the live application at: [https://momentum-app-65c5d.web.app](https://momentum-app-65c5d.web.app)

## Project Structure

```text
momentum/
├── functions/              # Firebase Cloud Functions
│   └── src/
│       └── index.ts        # Main Cloud Function logic
├── src/
│   ├── components/
│   │   ├── DailyOperatingDoc.tsx
│   │   ├── FocusTimer.tsx
│   │   ├── StuckButton.tsx
│   │   └── VoidForm.tsx
│   ├── hooks/
│   │   └── useAuth.ts       # Firebase authentication hook
│   ├── services/
│   │   └── voidService.ts   # Firestore interaction logic
│   ├── types/
│   │   └── void.ts          # Data type definitions
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
