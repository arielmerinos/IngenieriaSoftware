from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    telefono = models.CharField(max_length=15, null= True, unique=True)
    fecha_nacimiento = models.DateField(blank=True, null=True)

    def __str__(self):
        return super().__str__()