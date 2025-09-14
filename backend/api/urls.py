# Import path to define URL patterns
from django.urls import path

# Import my views (class-based and function-based) for handling requests
from . import views

# URL patterns that map endpoints to views in the notes API
urlpatterns = [
    # List all notes for the current user (GET) or create a new one (POST)
    path("notes/", views.NoteListCreate.as_view(), name="note-list"),

    # List all notes globally (GET) — includes notes from all users
    path("notes/all/", views.AllNotesView.as_view(), name="all-notes"),

    # Delete a specific note by its primary key (DELETE)
    path("notes/delete/<int:pk>/", views.NoteDelete.as_view(), name="delete-note"),

    # Toggle like/unlike on a note (POST)
    path("notes/<int:pk>/like/", views.toggle_like, name="toggle-like"),

    # Add a new comment to a specific note (POST)
    path("notes/<int:pk>/comments/", views.add_comment, name="add-comment"),

    # Delete a comment by its primary key (DELETE)
    path("comments/delete/<int:pk>/", views.delete_comment, name="delete-comment"),
]
