// Bring in React
import react from "react"

// Pull in the pieces I need from React Router to handle navigation and routes
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"

// Import my page components (each one is a different screen)
import Login from "./pages/Login"
import Register from "./pages/Register"
import Home from "./pages/Home"
import NotFound from "./pages/NotFound"
import AddNote from "./pages/AddNote"

// Import the ProtectedRoute wrapper so only logged-in users can access certain pages
import ProtectedRoute from "./components/ProtectedRoute"

// ---------------- Utility Components ----------------

// Simple logout component: clears everything in localStorage and sends the user back to login
function Logout() {
  localStorage.clear()
  return <Navigate to="/login" />
}

// Register page that also clears localStorage first, so no old login data hangs around
function RegisterAndLogout() {
  localStorage.clear()
  return <Register />
}

// ---------------- Main App Component ----------------

function App() {
  return (
    // BrowserRouter keeps the UI in sync with the URL (client-side routing)
    <BrowserRouter>
      {/* Routes is the container for all my individual Route definitions */}
      <Routes>
        {/* Root ("/") goes to Home page, but only if the user is logged in */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />

        {/* "/add" → page to create a new note; also protected */}
        <Route
          path="/add"
          element={
            <ProtectedRoute>
              <AddNote />
            </ProtectedRoute>
          }
        />

        {/* "/login" → plain login page, open to everyone */}
        <Route path="/login" element={<Login />} />

        {/* "/logout" → clears tokens and redirects back to login */}
        <Route path="/logout" element={<Logout />} />

        {/* "/register" → sign-up page that first clears any stored session data */}
        <Route path="/register" element={<RegisterAndLogout />} />

        {/* "*" → catch-all for unknown routes, shows a 404 page */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  )
}

// Export the App so index.js can render it
export default App
