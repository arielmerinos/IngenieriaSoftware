from django.db import models
from .user import User

class Notification(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    mesaage = models.CharField(max_length=255)
    date = models.DateTimeField(auto_now_add=True)
    notify = models.ManyToManyField(User, related_name='notify')