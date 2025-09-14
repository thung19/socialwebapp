// Import axios to make HTTP requests (GET, POST, PUT, DELETE, etc.)
import axios from "axios"

// Bring in my ACCESS_TOKEN constant so I can grab the token from localStorage
import { ACCESS_TOKEN } from "./constants"

// Create an axios instance with a default base URL
// Uses the VITE_API_URL from my .env file if it exists, otherwise defaults to localhost
const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || "http://localhost:8000"
})

// Add a request interceptor so I can attach the access token to every outgoing request
api.interceptors.request.use(
    (config) => {
        // Pull the token from localStorage
        const token = localStorage.getItem(ACCESS_TOKEN)

        // If there's a token, add it to the Authorization header
        if (token) {
            config.headers.Authorization = `Bearer ${token}`
        }

        // Return the config so the request can continue
        return config
    },
    (error) => {
        // If something goes wrong while setting up the request, just reject the promise
        return Promise.reject(error)
    }
)

// Export the configured axios instance so I can import it anywhere in the app
export default api
