from django.db import models
from .student import Student
from .category import Category

class Profile(Student):
    student = models.OneToOneField(Student, on_delete=models.CASCADE)
    scholarship = models.CharField(max_length=255)
    certifications = models.TextField(blank=True)
    acticvities = models.TextField(blank=True)
    cv = models.TextField(blank=True)
    proyects = models.TextField(blank=True)
    interests = models.TextField(blank=True)
    categories = models.ManyToManyField(Category, blank=True)