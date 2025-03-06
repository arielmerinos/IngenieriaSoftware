from django.db import models
from .category import Category

class Country(Category):
    emoji = models.CharField(max_length=10)