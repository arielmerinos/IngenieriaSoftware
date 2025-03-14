from django.db import models
from .category import Category

"""
El tipo de beca que se puede filtrar en la aplicación. Eg. 
Beca de estudio, beca de investigación, beca de intercambio. Extiende de Category
para poder filtrar becas por tipo.
"""
class Type(Category):
    name = models.CharField(max_length=50)
    
    