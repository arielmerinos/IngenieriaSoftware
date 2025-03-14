from django.db import models
from django.contrib.auth.models import User

class HistorySearch(models.Model):
    key_words = models.CharField(max_length=255)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='history_searches')
    created_at = models.DateTimeField(auto_now_add=True)
    id = models.AutoField(primary_key=True)

    def __str__(self):
        return f"{self.user.username} - {self.key_words}"