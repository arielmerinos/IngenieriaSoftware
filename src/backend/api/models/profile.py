from django.db import models
from .category import Category
from django.contrib.auth.models import User

class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, help_text="User associated with this profile")
    scholarships = models.CharField(max_length=255, help_text="Scholarships awarded to the user")
    certifications = models.TextField(blank=True, help_text="Certifications obtained by the user")
    activities = models.TextField(blank=True, help_text="Activities the user is involved in")
    cv = models.TextField(blank=True, help_text="User's curriculum vitae")
    projects = models.TextField(blank=True, help_text="Projects the user has worked on")
    interests = models.TextField(blank=True, help_text="User's interests")
    categories = models.ManyToManyField(Category, blank=True, help_text="Categories related to the user")

    created_at = models.DateTimeField(auto_now_add=True, help_text="Profile creation date")
    updated_at = models.DateTimeField(auto_now=True, help_text="Profile last updated date")

    def __str__(self):
        return self.user.username

    class Meta:
        verbose_name = "Profile"
        verbose_name_plural = "Profiles"