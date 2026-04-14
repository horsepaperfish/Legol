# Legol

An AI-powered immigration assistant built with React, Vite, and Claude AI.

## Getting Started (Local Development)

1. Clone the repository
2. Install dependencies: `npm install`
3. Set up Firebase Authentication (for Google Sign-In):
   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Create a new project or select an existing one
   - Enable Google Authentication:
     - Go to Authentication > Sign-in method
     - Enable Google provider
   - Get your Firebase configuration:
     - Go to Project Settings > General
     - Scroll down to "Your apps" and click on the web app (or create one)
     - Copy the Firebase configuration values
   - Create a `.env` file in the root directory (copy from `.env.example`)
   - Add your Firebase configuration values to the `.env` file
4. Set up the Python backend:
   - Navigate to backend directory: `cd backend`
   - Create virtual environment: `python3 -m venv venv`
   - Activate virtual environment: `source venv/bin/activate`
   - Install dependencies: `pip install -r requirements.txt`
   - Create `.env` file in backend directory with your `ANTHROPIC_API_KEY`
   - Run the backend: `python3 app.py`
5. Run the frontend dev server: `npm run dev`
6. Open your browser to the URL shown in terminal (usually http://localhost:5173)

Note: You need both the frontend and backend servers running for the chatbot to work.

## Deploying to Vercel

This project is configured for easy deployment to Vercel with both frontend and backend (serverless functions).

### Prerequisites
- A Vercel account ([Sign up here](https://vercel.com/signup))
- Your project pushed to GitHub, GitLab, or Bitbucket
- Anthropic API key ([Get one here](https://console.anthropic.com/))

### Deployment Steps

1. **Import your project to Vercel:**
   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Click "Add New..." → "Project"
   - Import your Git repository

2. **Configure Environment Variables:**
   In your Vercel project settings, add these environment variables:

   **For the Python backend (API functions):**
   - `ANTHROPIC_API_KEY`: Your Claude API key

   **For the React frontend:**
   - `VITE_FIREBASE_API_KEY`: Your Firebase API key
   - `VITE_FIREBASE_AUTH_DOMAIN`: Your Firebase auth domain
   - `VITE_FIREBASE_PROJECT_ID`: Your Firebase project ID
   - `VITE_FIREBASE_STORAGE_BUCKET`: Your Firebase storage bucket
   - `VITE_FIREBASE_MESSAGING_SENDER_ID`: Your Firebase messaging sender ID
   - `VITE_FIREBASE_APP_ID`: Your Firebase app ID
   - `VITE_FIREBASE_MEASUREMENT_ID`: Your Firebase measurement ID (optional)

3. **Deploy:**
   - Click "Deploy"
   - Vercel will automatically:
     - Build your frontend with Vite
     - Deploy your Python API functions to `/api/*` endpoints
     - Configure routing automatically

4. **Post-Deployment:**
   - Your app will be live at `https://your-project.vercel.app`
   - The API endpoints will be available at `https://your-project.vercel.app/api/*`
   - Update Firebase Console to allow your Vercel domain for authentication

### How It Works

The project uses Vercel's serverless architecture:
- **Frontend**: Built with Vite and deployed as static files
- **Backend**: Python Flask routes converted to serverless functions in `/api` directory
- Each API endpoint (`/api/chat.py`, `/api/graph.py`, etc.) runs as a separate serverless function
- Environment variables are automatically injected into both frontend and backend

### Redeployment

Vercel automatically redeploys when you push to your main branch. You can also:
- Manually redeploy from the Vercel dashboard
- Deploy specific branches for previews
- Use the Vercel CLI: `vercel --prod` 

# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
