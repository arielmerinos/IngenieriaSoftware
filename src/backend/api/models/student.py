from django.db import models
from django.contrib.auth.models import AbstractUser
from django.contrib.auth.models import User

class Student(models.Model):
    search = models.CharField(max_length=255)
    interests = models.CharField(max_length=255)
    phone_number = models.CharField(max_length=15, blank=True, unique=True)
    birthday = models.DateField(blank=True, null=True)
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='student')