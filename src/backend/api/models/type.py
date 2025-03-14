from django.db import models
from .category import Category

'''
    Este modelo extiende de Category y representa el tipo de categoría, a un subconjunto predefinido
'''
class Type(Category):
    BECA = 'beca'
    MAESTRIA = 'maestria'
    DOCTORADO = 'doctorado'
    POSTDOC = 'postdoc'
    INVESTIGACION = 'investigacion'
    INTERCAMBIO = 'intercambio'
    CURSO = 'curso'
    TALLER = 'taller'
    SEMINARIO = 'seminario'
    CONFERENCIA = 'conferencia'
    CONGRESO = 'congreso'
    SIMPOSIO = 'simposio'
    FORO = 'foro'
    VOLUNTARIADO = 'voluntariado'
    HACKATHON = 'hackathon'
    EVENTO = 'evento'
    OTRO = 'otro'
    

    TYPE_CHOICES = (
        (BECA, 'Beca'),
        (MAESTRIA, 'Maestría'),
        (DOCTORADO, 'Doctorado'),
        (POSTDOC, 'Postdoc'),
        (INVESTIGACION, 'Investigación'),
        (INTERCAMBIO, 'Intercambio'),
        (CURSO, 'Curso'),
        (TALLER, 'Taller'),
        (SEMINARIO, 'Seminario'),
        (CONFERENCIA, 'Conferencia'),
        (CONGRESO, 'Congreso'),
        (SIMPOSIO, 'Simposio'),
        (FORO, 'Foro'),
        (VOLUNTARIADO, 'Voluntariado'),
        (HACKATHON, 'Hackathon'),
        (EVENTO, 'Evento'),
        (OTRO, 'Otro'),
    )

    type_name = models.CharField(max_length=50, choices=TYPE_CHOICES, default=BECA)