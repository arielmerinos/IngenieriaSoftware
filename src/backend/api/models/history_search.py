from django.db import models

"""
Este modelo es para simular una tabla de historial de búsqueda
history_search: palabras que describen la búsqueda del estudiantes
"""
class HistorySearch(models.Model):
    key_words = models.CharField(max_length=255)