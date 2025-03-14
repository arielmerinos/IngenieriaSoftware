from django.db import models
from django.contrib.auth.models import User

class Organization(models.Model):
    name = models.CharField(max_length=255)
    id = models.AutoField(primary_key=True)
    email = models.EmailField(max_length=100, unique=True)
    phone_number = models.CharField(max_length=15, blank=True, unique=True)
    website = models.URLField(max_length=200, null=True)
    logo = models.ImageField(upload_to='logos/', null=True)
    members = models.ManyToManyField(User, through='Membership', related_name='members')

class Membership(models.Model):
    id = models.AutoField(primary_key=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    organization = models.ForeignKey(Organization, on_delete=models.CASCADE)
    is_admin = models.BooleanField(default=False)