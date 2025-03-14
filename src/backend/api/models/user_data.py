from django.db import models
from django.contrib.auth.models import User

"""

history_search: several words that describe the student's search history
interests: a list of categories that the student is interested in
phone_number: the student's phone number
birthday: the student's birthday
user: the user that this student is associated with
id: the primary key for this student

user data
"""
class UserData(models.Model):
    history_search = models.CharField(max_length=255)
    interests = models.CharField(max_length=255)
    phone_number = models.CharField(max_length=15, blank=True, unique=True)
    birthday = models.DateField(blank=True, null=True)
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='student')
    id = models.AutoField(primary_key=True)