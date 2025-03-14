from django.db import models
from .category import Category
from django.contrib.auth.models import User


class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    scholarship = models.CharField(max_length=255)
    certifications = models.TextField(blank=True)
    activities = models.TextField(blank=True)
    cv = models.TextField(blank=True)
    projects = models.TextField(blank=True)
    interests = models.TextField(blank=True)
    categories = models.ManyToManyField(Category, blank=True)