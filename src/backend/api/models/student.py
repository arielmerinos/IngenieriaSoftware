from django.db import models
from .organization import Organization
from django.contrib.auth.models import AbstractUser


class Student(AbstractUser):
    search = models.CharField(max_length=255)
    intereses = models.CharField(max_length=255)
    phone_number = models.CharField(max_length=15, null= True, unique=True)
    birthday = models.DateField(blank=True, null=True)
    email = models.EmailField(max_length=100, unique=True)
    organization = models.ForeignKey(Organization, on_delete=models.CASCADE,related_name='scholarships')

    