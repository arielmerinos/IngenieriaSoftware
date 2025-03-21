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

from django.contrib import admin
from django.urls import path,include
from api.views import CreateUserView, UserDetailView, UserTokenView, ScholarshipListView, JoinOrganizationView, AcceptMembershipView, OrganizationCreateView
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

urlpatterns = [
    path('admin/', admin.site.urls),
    path("api/user/", UserDetailView.as_view(), name="user_detail"),  
    path("api/user/register/", CreateUserView.as_view(), name="register"),
    path("api/token/", TokenObtainPairView.as_view(), name="get_token"),
    path("api/token/refresh/", TokenRefreshView.as_view(), name="refresh"),
    path("api-auth/", include("rest_framework.urls")),
    path('oauth/', include('social_django.urls', namespace='social')),
    path('api/auth/tokens/', UserTokenView.as_view(), name='user_tokens'),
    path("api/", include("api.urls")),

    path("organization/create/", OrganizationCreateView.as_view(), name='organization-create'),
    path('organization/join/', JoinOrganizationView.as_view(), name='organization-join'),
    path('organization/accept/', AcceptMembershipView.as_view(), name='organization-accept'),
]
