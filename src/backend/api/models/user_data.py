from django.db import models
from django.contrib.auth.models import User
from .organization import Membership
from .interests import Interest

class UserData(models.Model):
    id = models.AutoField(primary_key=True)
    interests = models.ManyToManyField(Interest, related_name='student_interests', related_query_name='student_interest')
    phone_number = models.CharField(max_length=15, blank=True, unique=True)
    birthday = models.DateField(blank=True, null=True)
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='student', null=True)
    memberships = models.ManyToManyField(Membership, related_name='students', related_query_name='student')
    # history search has a foreign key to user
    def __str__(self):
        return self.user.username