from django.db import models
from .category import Category
"""
This model is used to represent a category of scholarships.
This server as hashtags that are going to be used to filter scholarships.
And add custom scholarships to the feed 

Los intereses son palabras clave que se utilizan para filtrar las becas y agregar becas personalizadas al feed
Por ejemplo: IA, Cybersecurity, Data Science, Law, etc.
"""
class Interest(Category):
    color = models.CharField(max_length=8) #hexadecimal color to represent the interest