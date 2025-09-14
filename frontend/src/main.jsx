// Import StrictMode from React
// StrictMode is a helper wrapper that highlights potential problems in development
import { StrictMode } from 'react'

// Import createRoot from ReactDOM (React 18+ way to render apps into the DOM)
import { createRoot } from 'react-dom/client'

// Import global CSS styles for the app
import './index.css'

// Import the root component of your app (App.jsx)
import App from './App.jsx'

// Find the <div id="root"> in index.html and create a React root there
createRoot(document.getElementById('root')).render(
  // Wrap the App component in StrictMode
  // This helps catch errors and warnings in development
  <StrictMode>
    {/* Render the App component as the starting point of the app */}
    <App />
  </StrictMode>,
)
