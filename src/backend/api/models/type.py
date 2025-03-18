# Nombre del programa: Impulsa tu futuro
# Copyright (C) 2025 - Autores:
# Merino Peña Kevin Ariel
# Ortíz Montiel Diego Iain
# Rodríguez Dimayuga Laura Itzel
# Sosa Romo Juan Mario
# Vargas Campos Miguel Angel
#
# Este programa es software libre: puede redistribuirlo y/o modificarlo
# bajo los términos de la Licencia Pública General de GNU v3 publicada por
# la Free Software Foundation.
#
# Este programa se distribuye con la esperanza de que sea útil,
# pero SIN NINGUNA GARANTÍA; sin incluso la garantía implícita de
# COMERCIABILIDAD o IDONEIDAD PARA UN PROPÓSITO PARTICULAR.
# Consulte la Licencia Pública General de GNU para más detalles.
#
# Debería haber recibido una copia de la Licencia Pública General de GNU
# junto con este programa. Si no, consulte <https://www.gnu.org/licenses/>.

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