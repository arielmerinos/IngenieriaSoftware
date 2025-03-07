from django.db import models
from .user import User

class Student(User):
    search = models.CharField(max_length=255)
    intereses = models.CharField(max_length=255)

    