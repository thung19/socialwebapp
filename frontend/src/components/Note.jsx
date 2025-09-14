// Import React (needed to define React components)
import React, { useState } from "react";  // Add useState here

// Import CSS for styling the Note component
import "../styles/Note.css"

import api from "../api";  // Add this import


// -------------------------
// Note Component
// -------------------------
// Props:
// - note:        an object containing the note's data (id, title, content, created_at)
// - onDelete:    a callback function that deletes a note when triggered
// - condensed:   an optional boolean that changes styling (default = false)
function Note({ note, onDelete, onLike, condensed = false }) {

    // Track whether the comment section is currently visible (true) or hidden (false).
    // Starts hidden by default.
    const [showComments, setShowComments] = useState(false);

    // Track the text of a new comment that the user is typing in an input box.
    // Starts as an empty string.
    const [newComment, setNewComment] = useState("");

    // Store the array of existing comments for this note.
    // Initialize with the comments from the note prop if available; otherwise start with an empty array.
    const [comments, setComments] = useState(note.comments || []);

    // Keep a count of how many total comments this note has.
    // Initialize with the note's total_comments value if present; otherwise start at 0.
    const [totalComments, setTotalComments] = useState(note.total_comments || 0);


    // Convert the note's created_at timestamp into a readable date string
    // Example: "2025-09-08T12:34:56Z" → "9/8/2025"
    const formattedDate = new Date(note.created_at).toLocaleDateString("en-US")

    // Determine which CSS class to use for the container
    // If condensed = true → use "note-container condensed"
    // Else → use just "note-container"
    const cardClass = condensed ? "note-container condensed" : "note-container";



    // Handle clicking the "like" button for this note.
const handleLike = () => {
    // Check if an onLike callback prop was passed down from the parent component.
    if (onLike) {
        // Call the parent’s onLike function, passing the current note’s ID
        // so the parent can update likes on the backend or in global state.
        onLike(note.id);
    }
};


// Handle submitting a new comment on this note.
const handleAddComment = async (e) => {
    // Prevent the default form submission (which would refresh the page).
    e.preventDefault();

    // If the new comment is empty or just whitespace, do nothing.
    if (!newComment.trim()) return;

    try {
        // Send a POST request to the backend API to create the comment.
        // Endpoint: /api/notes/<note.id>/comments/
        // Payload: { content: newComment }
        const res = await api.post(`/api/notes/${note.id}/comments/`, {
            content: newComment
        });
        
        // On success, update local state so the UI shows the new comment immediately:
        //   • Prepend the newly created comment (res.data) to the existing comments array.
        setComments([res.data, ...comments]);

        // Increment the total comment count by 1 to reflect the new comment.
        setTotalComments(totalComments + 1);

        // Clear the input box by resetting newComment to an empty string.
        setNewComment("");
    } catch (err) {
        // If the request fails (e.g., network error or backend error), alert the user.
        alert("Failed to add comment");
    }
};


// Handle deleting an existing comment on this note.
const handleDeleteComment = async (commentId) => {
    try {
        // Send a DELETE request to the backend API to remove the comment.
        // Endpoint: /api/comments/delete/<commentId>/
        await api.delete(`/api/comments/delete/${commentId}/`);

        // Update local state by filtering out the deleted comment from the comments array.
        setComments(comments.filter(comment => comment.id !== commentId));

        // Decrement the total comment count to reflect the deletion.
        setTotalComments(totalComments - 1);
    } catch (err) {
        // If the request fails, alert the user so they know the deletion didn’t work.
        alert("Failed to delete comment");
    }
};


    // -------------------------
    // Render JSX
    // -------------------------
    return (
        <div className="note-card">
            <h3 className="note-title">{note.title}</h3>
            <p className="note-content">{note.content}</p>
            
            <div className="note-meta">
                <span>By: {note.author}</span>
                <span>{formattedDate}</span>
            </div>
    
            <div className="note-actions">
                {onLike && (
                    <button 
                        className={`like-btn ${note.is_liked ? 'liked' : ''}`}
                        onClick={handleLike}
                    >
                        {note.is_liked ? '❤️' : '🤍'} {note.total_likes}
                    </button>
                )}
                
                <button onClick={() => setShowComments(!showComments)}>
                    💬 {totalComments}
                </button>
    
                {onDelete && (
                    <button className="delete-btn" onClick={() => onDelete(note.id)}>
                        Delete
                    </button>
                )}
            </div>

            {showComments && (
            <div className="comments-section">
                {/* Add Comment Form */}
                <form onSubmit={handleAddComment} className="comment-form">
                    <input
                        type="text"
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="Add a comment..."
                        className="comment-input"
                        maxLength={500}
                    />
                    <button type="submit" className="comment-submit">Post</button>
                </form>

                {/* Comments List */}
                <div className="comments-list">
                    {comments.length === 0 ? (
                        <p className="no-comments">No comments yet. Be the first!</p>
                    ) : (
                        comments.map((comment) => (
                            <div key={comment.id} className="comment-item">
                                <div className="comment-header">
                                    <span className="comment-author">{comment.author}</span>
                                    <span className="comment-date">
                                        {new Date(comment.created_at).toLocaleDateString()}
                                    </span>
                                    <button 
                                        className="delete-comment-btn"
                                        onClick={() => handleDeleteComment(comment.id)}
                                        title="Delete comment"
                                    >
                                        ×
                                    </button>
                                </div>
                                <p className="comment-content">{comment.content}</p>
                            </div>
                        ))
                    )}
                </div>
            </div>
        )}
    </div>
    );
}

export default Note;