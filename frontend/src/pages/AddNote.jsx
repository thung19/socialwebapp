// Import React hooks
import { useEffect, useState } from "react"

// Import the pre-configured axios instance for backend requests
import api from "../api"

// Import the Note component to display individual notes
import Note from "../components/Note"

// Import page-specific styles
import "../styles/Home.css"

// Import Link to navigate back to the feed page
import { Link } from "react-router-dom"

// -------------------------
// AddNote Component
// -------------------------
function AddNote() {
  // Local state for form inputs and notes list
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [notes, setNotes] = useState([])

  // Fetch all notes from the backend and save to state
  const loadNotes = async () => {
    try {
      const res = await api.get("/api/notes/")
      setNotes(res.data)
    } catch (e) {
      alert(e)
    }
  }

  // Load notes when component mounts
  useEffect(() => {
    loadNotes()
  }, [])

  // Handle creating a new note
  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const res = await api.post("/api/notes/", { title, content })
      if (res.status === 201) {
        setTitle("")
        setContent("")
        await loadNotes()
      } else {
        alert("Failed to create note.")
      }
    } catch (e) {
      alert(e)
    }
  }

  // Handle deleting a note by ID
  const deleteNote = async (id) => {
    try {
      const res = await api.delete(`/api/notes/delete/${id}/`)
      if (res.status === 204) {
        await loadNotes()
      } else {
        alert("Failed to delete note.")
      }
    } catch (e) {
      alert(e)
    }
  }

  // Toggle like/unlike for a note
  const handleLike = async (noteId) => {
    try {
      const res = await api.post(`/api/notes/${noteId}/like/`)
      setNotes((prevNotes) =>
        prevNotes.map((note) =>
          note.id === noteId
            ? {
                ...note,
                is_liked: res.data.is_liked,
                total_likes: res.data.total_likes,
              }
            : note
        )
      )
    } catch (err) {
      alert("Failed to toggle like")
    }
  }

  // -------------------------
  // Render UI
  // -------------------------
  return (
    <div className="feed-container">
      {/* Header with page title and link back to feed */}
      <div className="page-header">
        <h2>Add a Note</h2>
        <Link to="/" className="logout-btn">
          Back to Feed
        </Link>
      </div>

      {/* Form to create a new note */}
      <div className="note-form">
        <h3>Create New Post</h3>
        <form onSubmit={handleSubmit}>
          {/* Title input */}
          <input
            className="form-input"
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          {/* Content textarea */}
          <textarea
            className="form-textarea"
            placeholder="What's on your mind?"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          />
          {/* Submit button */}
          <button className="submit-btn" type="submit">
            Share
          </button>
        </form>
      </div>

      {/* Display all user notes */}
      <div>
        <h3>Your Notes</h3>
        {notes.length === 0 ? (
          <p>No notes yet. Create your first post above!</p>
        ) : (
          notes.map((note) => (
            <Note
              key={note.id}
              note={note}
              onDelete={deleteNote}
              onLike={handleLike}
            />
          ))
        )}
      </div>
    </div>
  )
}

export default AddNote
