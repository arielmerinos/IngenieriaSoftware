from django.db import models
from .user import User

class administrator(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)