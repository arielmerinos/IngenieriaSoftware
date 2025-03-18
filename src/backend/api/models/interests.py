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
"""
This model is used to represent a category of scholarships.
This server as hashtags that are going to be used to filter scholarships.
And add custom scholarships to the feed 

Los intereses son palabras clave que se utilizan para filtrar las becas y agregar becas personalizadas al feed
Por ejemplo: IA, Cybersecurity, Data Science, Law, etc.
"""
class Interest(Category):
    color = models.CharField(max_length=8) #hexadecimal color to represent the interest