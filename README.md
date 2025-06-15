# Momentum App

A modern web application built with React, TypeScript, and Firebase, featuring a clean Material-UI interface.

## Tech Stack

- **Frontend Framework**: React with TypeScript
- **Build Tool**: Vite
- **UI Framework**: Material-UI (MUI)
- **Backend Services**: Firebase
  - Authentication
  - Firestore Database
  - Hosting
  - Analytics

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
