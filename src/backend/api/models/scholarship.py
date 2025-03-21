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
from .type import Type
from .country import Country
from .organization import Organization
from django.contrib.auth.models import User
from .interests import Interest

class Scholarship(models.Model):
    id = models.AutoField(primary_key=True)
    organization = models.ForeignKey(
        Organization, on_delete=models.CASCADE, null=True, blank=True,
        related_name='scholarships', help_text="Organization offering the scholarship"
    )
    name = models.CharField(max_length=250, help_text="Name of the scholarship")
    publication_date = models.DateField(auto_now_add=True, help_text="Date when the scholarship was published")
    start_date = models.DateField(help_text="Start date of the scholarship")
    end_date = models.DateField(help_text="End date of the scholarship")
    type = models.ManyToManyField(
        Type, related_name='scholarship_types', related_query_name='scholarship_type',
        blank=True, help_text="Type of the scholarship"
    )
    image = models.ImageField(
        upload_to='scholarships', null=True, blank=True, help_text="Image related to the scholarship"
    )
    content = models.TextField(help_text="Description of the scholarship")
    interests = models.ManyToManyField(
        Interest, related_name='scholarship_interests', related_query_name='scholarship_interest',
        blank=True, help_text="Interests describing the scholarship"
    )
    created_by = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name='created_scholarships',
        help_text="User who created the scholarship"
    )
    country = models.ManyToManyField(
        Country, related_name='scholarship_countries', related_query_name='scholarship_country',
        blank=True, help_text="Country where the scholarship is offered"
    )

    def __str__(self):
        return self.name

    class Meta:
        verbose_name = "Scholarship"
        verbose_name_plural = "Scholarships"