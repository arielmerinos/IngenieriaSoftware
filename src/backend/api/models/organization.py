from django.db import models
from .student import Student

class Organization(models.Model):
    name = models.CharField(max_length=255)
    id = models.AutoField(primary_key=True)
    email = models.EmailField(max_length=100, unique=True)
    phone_number = models.CharField(max_length=15, null=True, unique=True)
    website = models.URLField(max_length=200, null=True)
    logo = models.ImageField(upload_to='logos/', null=True)
    members = models.ManyToManyField(Student, through='Membership', related_name='members')

class Membership(models.Model):
    student = models.ForeignKey(Student, on_delete=models.CASCADE)
    organization = models.ForeignKey(Organization, on_delete=models.CASCADE)
    is_admin = models.BooleanField(default=False)