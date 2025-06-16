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

from django.core.management.base import BaseCommand
from django.utils import timezone
from api.models import Scholarship
import logging

logger = logging.getLogger(__name__)

class Command(BaseCommand):
    help = 'Elimina becas que han pasado su fecha de finalización'

    def handle(self, *args, **kwargs):
        today = timezone.now().date()
        expired_scholarships = Scholarship.objects.filter(end_date__lt=today)
        count = expired_scholarships.count()
        
        if count > 0:
            # Log info sobre las becas que serán eliminadas
            for scholarship in expired_scholarships:
                logger.info(f"Eliminando beca expirada: {scholarship.name} (ID: {scholarship.id}), "
                           f"Fecha de fin: {scholarship.end_date}, Días expirada: {(today - scholarship.end_date).days}")
            
            # Eliminar las becas expiradas
            expired_scholarships.delete()
            self.stdout.write(self.style.SUCCESS(f'Se eliminaron exitosamente {count} becas expiradas.'))
        else:
            self.stdout.write('No hay becas expiradas para eliminar.')
