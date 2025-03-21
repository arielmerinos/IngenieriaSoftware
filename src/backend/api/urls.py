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

from django.urls import path
from . import views

urlpatterns = [
    path('user/', views.UserDataListView.as_view()),
    path('organizations/', views.OrganizationListView.as_view()),
    # path('scholarships/', views.ScholarshipListView.as_view(), name='scholarship-list'),
    path('scholarships/', views.ScholarshipListCreateView.as_view(), name='scholarship-list-create'),
    path('scholarships/<int:pk>/', views.ScholarshipDetailView.as_view(), name='scholarship-detail'),
    path('categories/', views.CategoryListView.as_view()),
    # path('organizations/<int:pk>/', views.OrganizationDetail.as_view()),
    # path('students/<int:pk>/', views.StudentDetail.as_view()),
    # path('scholarships/<int:pk>/', views.ScholarshipDetail.as_view()),
]