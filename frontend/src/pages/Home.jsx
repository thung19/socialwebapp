// Import React hooks for state and side effects
import { useState, useEffect } from "react";

// Import Link for client-side navigation without page reloads
import { Link } from "react-router-dom";

// Import preconfigured axios instance for API requests
import api from "../api";

// Import the Note component to display each note in the feed
import Note from "../components/Note";

// Import the DailyPrompt component to show a daily question
import DailyPrompt from "../components/DailyPrompt";

// Import page-specific styles
import "../styles/Home.css";

// -------------------------
// Home Component
// -------------------------
function Home() {
    // State to hold the list of notes fetched from the backend
    const [notes, setNotes] = useState([]);

    // Fetch notes when the component first mounts
    useEffect(() => {
        getNotes();
    }, []);

    // -------------------------
    // Fetch notes from backend
    // -------------------------
    const getNotes = () => {
        api
            .get("/api/notes/all/")          // GET request to retrieve all notes
            .then((res) => res.data)         // Extract data from the response
            .then((data) => {
                setNotes(data);              // Store notes in state
                console.log(data);           // Optional: log notes for debugging
            })
            .catch((err) => alert(err));     // Show an alert if the request fails
    };

    // -------------------------
    // Toggle like/unlike for a note
    // -------------------------
    const handleLike = async (noteId) => {
        try {
            const res = await api.post(`/api/notes/${noteId}/like/`);

            // Update only the liked note's state without refetching all notes
            setNotes(prevNotes =>
                prevNotes.map(note =>
                    note.id === noteId
                        ? {
                            ...note,
                            is_liked: res.data.is_liked,
                            total_likes: res.data.total_likes
                          }
                        : note
                )
            );
        } catch (err) {
            alert("Failed to toggle like");
        }
    };

    // -------------------------
    // Render UI
    // -------------------------
    return (
        <div className="feed-container">
            {/* Page header with title and logout link */}
            <div className="page-header">
                <h2>Your Feed</h2>
                <Link to="/logout" className="logout-btn">
                    Logout
                </Link>
            </div>

            {/* Display the daily prompt at the top of the feed */}
            <DailyPrompt />

            {/* Display all notes or a placeholder if none exist */}
            <div className="notes-list">
                {notes.length === 0 ? (
                    <p>No notes yet. Be the first to post!</p>
                ) : (
                    notes.map((note) => (
                        <Note
                            key={note.id}
                            note={note}
                            onLike={handleLike}
                        />
                    ))
                )}
            </div>

            {/* Floating button to navigate to the AddNote page */}
            <Link to="/add" className="add-button">
                +
            </Link>
        </div>
    );
}

// Export component for use in App.js routing
export default Home;
