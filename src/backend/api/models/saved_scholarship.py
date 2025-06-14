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
from .scholarship import Scholarship

class SavedScholarship(models.Model):
    id = models.AutoField(primary_key=True)
    user = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name='saved_scholarships',
        help_text="User who saved the scholarship"
    )
    scholarship = models.ForeignKey(
        Scholarship, on_delete=models.CASCADE, related_name='saved_by',
        help_text="The saved scholarship"
    )
    saved_date = models.DateTimeField(auto_now_add=True, help_text="Date when the scholarship was saved")

    class Meta:
        verbose_name = "Saved Scholarship"
        verbose_name_plural = "Saved Scholarships"
        unique_together = ('user', 'scholarship')  # Prevent duplicate saved items

    def __str__(self):
        return f"{self.user.username} - {self.scholarship.name}"
