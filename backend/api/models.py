from django.db import models
from django.contrib.auth.models import User

# A note posted by a user
class Note(models.Model):
     # Note title (max 100 chars)
    title = models.CharField(max_length=100)
    # Body text of the note                    
    content = models.TextField()
    # Created timestamp                                 
    created_at = models.DateTimeField(auto_now_add=True)         

    # Author of the note. If the user is deleted, their notes are deleted too.
    author = models.ForeignKey(User, on_delete=models.CASCADE, related_name="notes")

    # Users who liked this note (many-to-many relationship).
    likes = models.ManyToManyField(User, blank=True, related_name="liked_notes")

    def __str__(self):
        return self.title

    def total_likes(self):
        return self.likes.count()

    def total_comments(self):
        return self.comments.count()


# A comment left by a user on a note
class Comment(models.Model):
    # Comment text
    content = models.TextField(max_length=500)
    # Created timestamp                   
    created_at = models.DateTimeField(auto_now_add=True)         

    # User who wrote the comment. Deletes cascade if user is deleted.
    author = models.ForeignKey(User, on_delete=models.CASCADE, related_name="comments")

    # The note this comment belongs to. Deletes cascade if note is deleted.
    note = models.ForeignKey(Note, on_delete=models.CASCADE, related_name="comments")

    class Meta:
        # Newest comments first
        ordering = ['-created_at']                               
    def __str__(self):
        return f"Comment by {self.author.username} on {self.note.title}"
