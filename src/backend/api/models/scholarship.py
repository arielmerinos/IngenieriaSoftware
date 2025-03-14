from django.db import models
from .student import Student
from .category import Category
from .organization import Organization

'''
Modelo para guardar todas las convocatorias
'''
class Scholarship(models.Model):
    id = models.AutoField(primary_key=True)
    organization = models.ForeignKey(Organization, on_delete=models.CASCADE,related_name='scholarships') 
    name = models.CharField(max_length=250)  
    publication_date = models.DateField(auto_now_add=True)    
    start_date = models.DateField()
    end_date = models.DateField()
    type = models.CharField(max_length=50)
    image = models.ImageField(upload_to='scholarships', null=True)
    content = models.TextField()
    categories = models.ManyToManyField(Category)
    created_by = models.ForeignKey(Student, on_delete=models.CASCADE, related_name='scholarships')
    country = models.CharField(max_length=50)
    country_emoji = models.CharField(max_length=50)
    
    def __str__(self):
        return self.name