# Import the built-in User model for authentication
from django.contrib.auth.models import User

# Import Django REST Framework serializers
from rest_framework import serializers

# Import my app’s models
from .models import Note, Comment


# ----------------------------
# Serializer for user creation / authentication
# ----------------------------
class UserSerializer(serializers.ModelSerializer):
    # Password should only be accepted on input; never sent back in responses
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        # Expose only these fields through the API
        fields = ["id", "username", "password"]

    # Override create to use Django's create_user helper (handles password hashing)
    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user


# ----------------------------
# Serializer for individual comments on notes
# ----------------------------
class CommentSerializer(serializers.ModelSerializer):
    # Display the author's username instead of their ID, and keep it read-only
    author = serializers.CharField(source="author.username", read_only=True)

    class Meta:
        model = Comment
        # Fields to return in API responses
        fields = ["id", "content", "created_at", "author"]
        # Make sure clients can’t manually set the author field
        extra_kwargs = {"author": {"read_only": True}}


# ----------------------------
# Serializer for notes, with likes and nested comments
# ----------------------------
class NoteSerializer(serializers.ModelSerializer):
    # Show the author's username instead of their ID, and keep it read-only
    author = serializers.CharField(source="author.username", read_only=True)
    # Computed field for total like count
    total_likes = serializers.ReadOnlyField()
    # Computed boolean: whether the current user liked this note
    is_liked = serializers.SerializerMethodField()
    # Include a list of related comments, using the CommentSerializer
    comments = CommentSerializer(many=True, read_only=True)

    class Meta:
        model = Note
        # Full list of fields exposed in the API
        fields = [
            "id",
            "title",
            "content",
            "created_at",
            "author",
            "total_likes",
            "is_liked",
            "total_comments",
            "comments",
        ]
        # Author is always set server-side; users can’t override it
        extra_kwargs = {"author": {"read_only": True}}

    # Compute whether the logged-in user has liked this note
    def get_is_liked(self, obj):
        user = self.context["request"].user
        return obj.likes.filter(id=user.id).exists()
