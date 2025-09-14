# 404 helper
from django.shortcuts import get_object_or_404

# Built-in user model
from django.contrib.auth.models import User

# DRF generics and status codes
from rest_framework import generics, status

# DRF decorators for function-based views
from rest_framework.decorators import api_view, permission_classes

# DRF Response object
from rest_framework.response import Response

# DRF permission classes
from rest_framework.permissions import IsAuthenticated, AllowAny

# App serializers
from .serializers import UserSerializer, NoteSerializer, CommentSerializer

# App models
from .models import Note, Comment


# List all notes (global/public feed)
class AllNotesView(generics.ListAPIView):
    # Serializer used to render Note objects
    serializer_class = NoteSerializer

    # Require authentication to access this view
    permission_classes = [IsAuthenticated]

    # Return all notes ordered by newest first
    def get_queryset(self):
        return Note.objects.all().order_by("-created_at")


# List the current user's notes (GET) and create a new note (POST)
class NoteListCreate(generics.ListCreateAPIView):
    # Serializer used to validate and render notes
    serializer_class = NoteSerializer

    # Require authentication to list or create notes
    permission_classes = [IsAuthenticated]

    # Limit the queryset to notes authored by the current user
    def get_queryset(self):
        return Note.objects.filter(author=self.request.user)

    # Assign the current user as the author when creating a note
    def perform_create(self, serializer):
        # DRF already validated the serializer; this check is redundant but harmless
        if serializer.is_valid():
            serializer.save(author=self.request.user)
        else:
            # Basic logging of validation errors
            print(serializer.errors)


# Delete a single note that belongs to the current user
class NoteDelete(generics.DestroyAPIView):
    # Serializer reference (useful for extensions)
    serializer_class = NoteSerializer

    # Require authentication to delete
    permission_classes = [IsAuthenticated]

    # Only allow deletion of the requesting user's own notes
    def get_queryset(self):
        return Note.objects.filter(author=self.request.user)


# Create a new user account (public signup endpoint)
class CreateUserView(generics.CreateAPIView):
    # Base queryset (common to include for generic views)
    queryset = User.objects.all()

    # Serializer that handles creation and password hashing
    serializer_class = UserSerializer

    # Allow unauthenticated access to sign up
    permission_classes = [AllowAny]


# Toggle like/unlike for a note (POST-only)
@api_view(["POST"])
@permission_classes([IsAuthenticated])
def toggle_like(request, pk):
    # Fetch the target note or return 404 if not found
    note = get_object_or_404(Note, pk=pk)

    # The authenticated user performing the action
    user = request.user

    # If the user already liked the note, remove the like (unlike)
    if note.likes.filter(id=user.id).exists():
        note.likes.remove(user)
        is_liked = False
    # Otherwise add the like
    else:
        note.likes.add(user)
        is_liked = True

    # Return the new like state and current like count
    return Response({
        "is_liked": is_liked,
        "total_likes": note.total_likes(),
    })


# Add a comment to a note (POST-only)
@api_view(["POST"])
@permission_classes([IsAuthenticated])
def add_comment(request, pk):
    # Fetch the target note or return 404
    note = get_object_or_404(Note, pk=pk)

    # Build the serializer with incoming data and request context
    serializer = CommentSerializer(data=request.data, context={"request": request})

    # If the payload is valid, save with author and note set
    if serializer.is_valid():
        serializer.save(author=request.user, note=note)
        # Return the created comment with 201 Created
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    # On validation errors, return 400 with details
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# Delete a comment (DELETE-only); only the author may delete
@api_view(["DELETE"])
@permission_classes([IsAuthenticated])
def delete_comment(request, pk):
    # Fetch the target comment or return 404
    comment = get_object_or_404(Comment, pk=pk)

    # Forbid deletion if the requester is not the author
    if comment.author != request.user:
        return Response({"error": "Permission denied"}, status=status.HTTP_403_FORBIDDEN)

    # Delete the comment
    comment.delete()

    # Return 204 No Content to indicate success without a body
    return Response(status=status.HTTP_204_NO_CONTENT)
