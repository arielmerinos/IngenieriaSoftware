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
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from django.conf import settings
from django.conf.urls.static import static
from rest_framework.routers import DefaultRouter

from api.views import (
    CreateUserView, UserDetailView, UserMembershipsView, UserTokenView,
    ScholarshipListView, JoinOrganizationView, AcceptMembershipView,
    ScholarshipListCreateView, ScholarshipDetailView, 
    TypeListCreateView, TypeDetailView,
    CountryListCreateView, CountryDetailView,
    InterestListCreateView, InterestDetailView,
    OrganizationViewSet, UserMembershipAdminView, 
    UserNotificationView, PublicUserProfileView,UpdateProfilePhotoView, UpdateStudentView, UpdateUserView
)

# Nueva manera de agregar rutas hechas automaticamente
router = DefaultRouter()
router.register(r'organizations', OrganizationViewSet, basename='organization')

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

    # Organization views
    path('api/', include(router.urls), name='organization-crud'),
    path('organization/join/', JoinOrganizationView.as_view(), name='organization-join'),
    path('organization/accept/', AcceptMembershipView.as_view(), name='organization-accept'),

    # Scholarship views
    path('scholarships/', ScholarshipListView.as_view(), name='scholarship-list'),
    path('scholarships/create/', ScholarshipListCreateView.as_view(), name='scholarship-list-create'),
    path('scholarships/<int:pk>/', ScholarshipDetailView.as_view(), name='scholarship-detail'),
    
    # Endpoints para Types
    path('types/', TypeListCreateView.as_view(), name='type-list-create'),
    path('types/<int:pk>/', TypeDetailView.as_view(), name='type-detail'),
    
    # Endpoints para Countries
    path('countries/', CountryListCreateView.as_view(), name='country-list-create'),
    path('countries/<int:pk>/', CountryDetailView.as_view(), name='country-detail'),
    
    # Endpoints para Interests
    path('interests/', InterestListCreateView.as_view(), name='interest-list-create'),
    path('interests/<int:pk>/', InterestDetailView.as_view(), name='interest-detail'),

    # Endpoints para memberships
    path('user/memberships/', UserMembershipsView.as_view(), name='user-memberships'),
    path('api/user/admin-memberships/', UserMembershipAdminView.as_view(), name='user-memberships'),
    
    # Endpoints para notificaciones
    path('user/notifications/', UserNotificationView.as_view(), name='user-notifications'),

    #endpointss para el perfil de usuario
    path('api/user/<int:id>/profile/', PublicUserProfileView.as_view(), name='public-user-profile'),
    path('api/user/photo/', UpdateProfilePhotoView.as_view(), name='update-profile-photo'),
    path('api/user/', UpdateUserView.as_view(), name='update-user'),
    path('api/user/student/', UpdateStudentView.as_view(), name='update-student'),

] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
