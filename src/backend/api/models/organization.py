from django.db import models
from .user import User

class Organization(User):   
    name = models.CharField(max_length=255)