from django.db import models
from .category import Category

"""
Each country will have a name and an emoji to represent it. Extends from Category
to be able to filter scholarships by country.
"""
class Country(Category):
    name = models.CharField(max_length=50)
    emoji = models.CharField(max_length=8) #this will be used to represent country flags
    
    