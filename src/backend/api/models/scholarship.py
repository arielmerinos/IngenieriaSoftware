from django.db import models
from .category import Category
from .type import Type
from .country import Country
from .organization import Organization
from django.contrib.auth.models import User

'''
Modelo para guardar todas las convocatorias
id: llave primaria
organization: llave foránea puede ser nulo, valor por defecto null
type: tipo de convocatoria eg. beca, premio, concurso, hackathon (categoría)
content: descripción de la convocatoria
categories: etiquetas que describen la convocatoria eg. ayuda económica, online, presencial, nacional, internacional
created_by: llave foránea del usuario que creó la convocatoria
country: país de la convocatoria (categoría)
'''
class Scholarship(models.Model):
    id = models.AutoField(primary_key=True)
    organization = models.ForeignKey(Organization, on_delete=models.CASCADE, null=True)
    name = models.CharField(max_length=250)  
    publication_date = models.DateField(auto_now_add=True)    
    start_date = models.DateField()
    end_date = models.DateField()
    type = models.ManyToManyField(Type)
    image = models.ImageField(upload_to='scholarships', null=True)
    content = models.TextField()
    categories = models.ManyToManyField(Category)
    created_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name='scholarships')
    country = models.ManyToManyField(Country)
    
    def __str__(self):
        return self.name