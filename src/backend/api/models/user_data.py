from django.db import models
from django.contrib.auth.models import User
from .history_search import HistorySearch
from .organization import Membership

"""
Aquí guardamos datos adicionales del usuario
history_search: several words that de scribe the student's search history
interests: a list of categories that the student is interested in
phone_number: the student's phone number
birthday: the student's birthday
user: the user that this student is associated with
id: the primary key for this student
"""
class UserData(models.Model):
    id = models.AutoField(primary_key=True)
    interests = models.CharField(max_length=255)
    phone_number = models.CharField(max_length=15, blank=True, unique=True)
    birthday = models.DateField(blank=True, null=True)
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='student', null=True)
    memberships = models.OneToOneField(Membership, on_delete=models.CASCADE, related_name='student', null=True)
    history_search = models.OneToOneField(HistorySearch, on_delete=models.CASCADE, related_name='student', null=True)