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

class Follow(models.Model):
    followed = models.ForeignKey(User, on_delete=models.CASCADE, related_name='follow')
    follower = models.ForeignKey(User, on_delete=models.CASCADE, related_name='follower')
    
    def __str__(self):
        return f'{self.User} sigue a {self.User}'
    
    @property
    def mutual_follow(self):
        return Follow.objects.filter(followed=self.follower, follower=self.followed).exists()