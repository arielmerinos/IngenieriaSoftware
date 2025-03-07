from django.db import models
from .user import User
from .category import Category


class Call(models.Model):
    organization = models.ForeignKey(User, on_delete=models.CASCADE)
    name = models.CharField(max_length=250)
    publication_date = models.DateField()
    start_date = models.DateField()
    end_date = models.DateField()
    type = models.CharField(max_length=50)
    image = models.ImageField(upload_to='calls', null=True)
    content = models.TextField()
    categories = models.ManyToManyField(Category)
    