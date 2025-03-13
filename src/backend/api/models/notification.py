from django.db import models
from .student import Student

class Notification(models.Model):
    user = models.ForeignKey(Student, on_delete=models.CASCADE)
    message = models.CharField(max_length=255)
    date = models.DateTimeField(auto_now_add=True)
    notify = models.ManyToManyField(Student, related_name='notify')