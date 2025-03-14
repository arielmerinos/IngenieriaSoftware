from django.db import models

"""
This model is used to represent a category of scholarships.
This server as hashtags that are going to be used to filter scholarships.
And add custom scholarships to the feed 
"""
class Category(models.Model):
    name = models.CharField(max_length=50)
    color = models.CharField(max_length=8)