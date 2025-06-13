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
from django.contrib.auth.models import User
from .organization import Membership
from .interests import Interest

class UserData(models.Model):
    id = models.AutoField(primary_key=True)
    interests = models.ManyToManyField(Interest, related_name='student_interests', related_query_name='student_interest')
    phone_number = models.CharField(max_length=15, blank=True, null=True)
    birthday = models.DateField(blank=True, null=True)
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='student', null=True)
    memberships = models.ManyToManyField(Membership, related_name='students', related_query_name='student')
    photo = models.ImageField(upload_to='profile_photos/', null=True, blank=True) 
    bio = models.TextField(max_length=500, blank=True, null=True, help_text="Descripción personal")
    
    # history search has a foreign key to user
    def __str__(self):
        return self.user.username   