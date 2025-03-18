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
from django.contrib.auth.models import User

class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, help_text="User associated with this profile")
    scholarships = models.CharField(max_length=255, help_text="Scholarships awarded to the user")
    certifications = models.TextField(blank=True, help_text="Certifications obtained by the user")
    activities = models.TextField(blank=True, help_text="Activities the user is involved in")
    cv = models.TextField(blank=True, help_text="User's curriculum vitae")
    projects = models.TextField(blank=True, help_text="Projects the user has worked on")
    interests = models.TextField(blank=True, help_text="User's interests")
    categories = models.ManyToManyField(Category, blank=True, help_text="Categories related to the user")

    created_at = models.DateTimeField(auto_now_add=True, help_text="Profile creation date")
    updated_at = models.DateTimeField(auto_now=True, help_text="Profile last updated date")

    def __str__(self):
        return self.user.username

    class Meta:
        verbose_name = "Profile"
        verbose_name_plural = "Profiles"