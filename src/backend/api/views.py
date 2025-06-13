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

# Imports de Django
from django.http import JsonResponse
from django.shortcuts import get_object_or_404
from django.shortcuts import render
from django.contrib.auth.models import User
from django.contrib.auth.decorators import login_required
from django.utils.decorators import method_decorator
from django.views import View

# Imports de Django REST Framework
from rest_framework import generics, permissions, status, viewsets
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.exceptions import PermissionDenied

# Imports nuestros
from .models import (
    Scholarship, UserData, Organization, Membership, Category,
    Type, Country, Interest
)
from .serializers import (
    UserSerializer, ScholarshipSerializer, OrganizationSerializer, 
    MembershipSerializer, CategorySerializer, UserDataSerializer, 
    TypeSerializer, CountrySerializer, InterestSerializer, ActivitySerializer, PublicUserProfileSerializer
)

# Imports de Notifiaciones
from actstream import action
from actstream.models import target_stream # Metodo que devuelve las notificaciones del target

class TypeListCreateView(APIView):
    """
    Vista para listar todos los tipos y crear nuevos.
    GET: Listar todos los tipos
    POST: Crear un nuevo tipo
    """
    permission_classes = [permissions.IsAuthenticated]
    
    def get(self, request):
        """Listar todos los tipos"""
        types = Type.objects.all()
        serializer = TypeSerializer(types, many=True)
        return Response(serializer.data)
    
    def post(self, request):
        """Crear un nuevo tipo"""
        serializer = TypeSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class TypeDetailView(APIView):
    """
    Vista para recuperar, actualizar o eliminar un tipo específico.
    GET: Obtener detalle de un tipo
    PUT: Actualizar un tipo completo
    PATCH: Actualizar parcialmente un tipo
    DELETE: Eliminar un tipo
    """
    permission_classes = [permissions.IsAuthenticated]
    
    def get_object(self, pk):
        """Obtener objeto de tipo por ID"""
        return get_object_or_404(Type, pk=pk)
    
    def get(self, request, pk):
        """Obtener detalle de un tipo específico"""
        type_obj = self.get_object(pk)
        serializer = TypeSerializer(type_obj)
        return Response(serializer.data)
    
    def put(self, request, pk):
        """Actualizar un tipo completo"""
        type_obj = self.get_object(pk)
        serializer = TypeSerializer(type_obj, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def patch(self, request, pk):
        """Actualizar parcialmente un tipo"""
        type_obj = self.get_object(pk)
        serializer = TypeSerializer(type_obj, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def delete(self, request, pk):
        """Eliminar un tipo"""
        type_obj = self.get_object(pk)
        type_obj.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

# ------------ VISTAS PARA PAÍS ------------

class CountryListCreateView(APIView):
    """
    Vista para listar todos los países y crear nuevos.
    GET: Listar todos los países
    POST: Crear un nuevo país
    """
    permission_classes = [permissions.IsAuthenticated]
    
    def get(self, request):
        """Listar todos los países"""
        countries = Country.objects.all()
        serializer = CountrySerializer(countries, many=True)
        return Response(serializer.data)
    
    def post(self, request):
        """Crear un nuevo país"""
        serializer = CountrySerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class CountryDetailView(APIView):
    """
    Vista para recuperar, actualizar o eliminar un país específico.
    GET: Obtener detalle de un país
    PUT: Actualizar un país completo
    PATCH: Actualizar parcialmente un país
    DELETE: Eliminar un país
    """
    permission_classes = [permissions.IsAuthenticated]
    
    def get_object(self, pk):
        """Obtener objeto de país por ID"""
        return get_object_or_404(Country, pk=pk)
    
    def get(self, request, pk):
        """Obtener detalle de un país específico"""
        country = self.get_object(pk)
        serializer = CountrySerializer(country)
        return Response(serializer.data)
    
    def put(self, request, pk):
        """Actualizar un país completo"""
        country = self.get_object(pk)
        serializer = CountrySerializer(country, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def patch(self, request, pk):
        """Actualizar parcialmente un país"""
        country = self.get_object(pk)
        serializer = CountrySerializer(country, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def delete(self, request, pk):
        """Eliminar un país"""
        country = self.get_object(pk)
        country.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

# ------------ VISTAS PARA INTERÉS ------------

class InterestListCreateView(APIView):
    """
    Vista para listar todos los intereses y crear nuevos.
    GET: Listar todos los intereses
    POST: Crear un nuevo interés
    """
    permission_classes = [permissions.IsAuthenticated]
    
    def get(self, request):
        """Listar todos los intereses"""
        interests = Interest.objects.all()
        serializer = InterestSerializer(interests, many=True)
        return Response(serializer.data)
    
    def post(self, request):
        """Crear un nuevo interés"""
        serializer = InterestSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class InterestDetailView(APIView):
    """
    Vista para recuperar, actualizar o eliminar un interés específico.
    GET: Obtener detalle de un interés
    PUT: Actualizar un interés completo
    PATCH: Actualizar parcialmente un interés
    DELETE: Eliminar un interés
    """
    permission_classes = [permissions.IsAuthenticated]
    
    def get_object(self, pk):
        """Obtener objeto de interés por ID"""
        return get_object_or_404(Interest, pk=pk)
    
    def get(self, request, pk):
        """Obtener detalle de un interés específico"""
        interest = self.get_object(pk)
        serializer = InterestSerializer(interest)
        return Response(serializer.data)
    
    def put(self, request, pk):
        """Actualizar un interés completo"""
        interest = self.get_object(pk)
        serializer = InterestSerializer(interest, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def patch(self, request, pk):
        """Actualizar parcialmente un interés"""
        interest = self.get_object(pk)
        serializer = InterestSerializer(interest, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def delete(self, request, pk):
        """Eliminar un interés"""
        interest = self.get_object(pk)
        interest.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

# class ScholarshipDetailView(APIView):
#     """
#     Vista para recuperar, actualizar o eliminar una beca específica.
#     GET: Obtener detalle de una beca
#     PUT: Actualizar una beca completa
#     PATCH: Actualizar parcialmente una beca
#     DELETE: Eliminar una beca
#     """
#     permission_classes = [permissions.IsAuthenticated]
    
#     def get_object(self, pk):
#         """Obtener objeto de beca por ID"""
#         return get_object_or_404(Scholarship, pk=pk)
    
#     def check_permission(self, scholarship, user):
#         """Verificar si el usuario tiene permiso para modificar la beca"""
#         # El creador de la beca siempre puede modificarla
#         if scholarship.created_by == user:
#             return True
            
#         # Si la beca pertenece a una organización, verificar si el usuario es admin
#         if scholarship.organization:
#             is_admin = Membership.objects.filter(
#                 user=user,
#                 organization=scholarship.organization,
#                 is_admin=True,
#                 is_active=True
#             ).exists()
#             return is_admin
            
#         return False
    
#     def get(self, request, pk):
#         """Obtener detalle de una beca específica"""
#         scholarship = self.get_object(pk)
#         serializer = ScholarshipSerializer(scholarship)
#         return Response(serializer.data)
    
#     def put(self, request, pk):
#         """Actualizar una beca completa"""
#         scholarship = self.get_object(pk)
        
#         # Verificar permisos
#         if not self.check_permission(scholarship, request.user):
#             return Response(
#                 {"error": "No tienes permiso para modificar esta beca."},
#                 status=status.HTTP_403_FORBIDDEN
#             )
        
#         serializer = ScholarshipSerializer(scholarship, data=request.data)
#         if serializer.is_valid():
#             serializer.save()
#             return Response(serializer.data)
#         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
#     def patch(self, request, pk):
#         """Actualizar parcialmente una beca"""
#         scholarship = self.get_object(pk)
        
#         # Verificar permisos
#         if not self.check_permission(scholarship, request.user):
#             return Response(
#                 {"error": "No tienes permiso para modificar esta beca."},
#                 status=status.HTTP_403_FORBIDDEN
#             )
        
#         serializer = ScholarshipSerializer(scholarship, data=request.data, partial=True)
#         if serializer.is_valid():
#             serializer.save()
#             return Response(serializer.data)
#         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
#     def delete(self, request, pk):
#         """Eliminar una beca"""
#         scholarship = self.get_object(pk)
        
#         # Verificar permisos
#         if not self.check_permission(scholarship, request.user):
#             return Response(
#                 {"error": "No tienes permiso para eliminar esta beca."},
#                 status=status.HTTP_403_FORBIDDEN
#             )
        
#         scholarship.delete()
#         return Response(status=status.HTTP_204_NO_CONTENT)

### Vistas de la API ###

class CreateUserView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]

    def create(self, request, *args, **kwargs):
        response = super().create(request, *args, **kwargs)
        user = User.objects.get(username=request.data["username"])

        # Create UserData instance for the newly created user
        UserData.objects.create(user=user)

        # Generate tokens for the newly created user
        refresh = RefreshToken.for_user(user)
        access_token = str(refresh.access_token)
        refresh_token = str(refresh)

        response.data["access"] = access_token
        response.data["refresh"] = refresh_token

        # Enviar notificación de bienvenida
        action.send(
            sender=user,
            verb='createdAccount',
            target=user)
        
        return response

class UserDetailView(APIView):
    permission_classes = [IsAuthenticated]  # Solo usuarios autenticados pueden acceder

    def get(self, request):
        user = request.user  # Obtiene el usuario desde el token
        print(user)
        serializer = UserSerializer(user)
        return Response(serializer.data)
    
class UserNotificationView(APIView):
    """
    Vista para obtener las notificaciones del usuario autenticado.
    """
    permission_classes = [IsAuthenticated]

    # def get(self, request):
    #     user = request.user
    #     notifications = actor_stream(user)
    #     notifications = [{
    #         'actor': str(notification.actor),
    #         'verb': notification.verb,
    #         'action_object': str(notification.action_object) if notification.action_object else None,
    #         'target': str(notification.target) if notification.target else None,
    #         'timestamp': notification.timestamp.isoformat()
    #     } for notification in notifications]
    #     return JsonResponse(notifications, safe=False)

    def get(self, request):
        user = request.user
        # Obtener las notificaciones del usuario
        notifications = target_stream(user)
        
        # Serializar las notificaciones
        serializer = ActivitySerializer(notifications, many=True)
        
        # Retornar las notificaciones serializadas
        return Response(serializer.data, status=status.HTTP_200_OK)

@method_decorator(login_required, name='dispatch')
class UserTokenView(View):
    def get(self, request, *args, **kwargs):
        access_token = request.session.get('jwt_access_token')
        refresh_token = request.session.get('jwt_refresh_token')
        username = request.session.get('username')

        if not (access_token and refresh_token and username):
            return JsonResponse({'error': 'No se encontraron los tokens'}, status=400)

        return JsonResponse({
            'username': username,
            'access_token': access_token,
            'refresh_token': refresh_token
        })

# class ScholarshipListView(APIView):
#     def get(self, request):
#         scholarships = Scholarship.objects.all()
#         serializer = ScholarshipSerializer(scholarships, many=True)
#         return Response(serializer.data)
    
class ScholarshipListCreateView(APIView):
    """
    Vista para listar todas las becas y crear nuevas.
    GET: Listar todas las becas
    POST: Crear una nueva beca
    """
    permission_classes = [permissions.IsAuthenticated]
    
    def get(self, request):
        """Listar todas las becas"""
        scholarships = Scholarship.objects.all()
        serializer = ScholarshipSerializer(scholarships, many=True)
        return Response(serializer.data)
    
    def post(self, request):
        """Crear una nueva beca"""
        print(request.data)  # Imprimir los datos recibidos para depuración
        # Añadir el usuario actual como creador
        serializer = ScholarshipSerializer(data=request.data)
        
        if serializer.is_valid():
        #     # Verificar si se especificó una organización
        #     organization_id = request.data.get('organization')
            
        #     # Si se especificó organización, verificar que el usuario pertenezca a ella
        #     if organization_id:
        #         # Verificar que el usuario es miembro activo de la organización
        #         is_member = Membership.objects.filter(
        #             user=request.user,
        #             organization_id=organization_id,
        #             is_active=True
        #         ).exists()
                
        #         if not is_member:
        #             return Response(
        #                 {"error": "No tienes permiso para crear becas para esta organización."},
        #                 status=status.HTTP_403_FORBIDDEN
        #             )
            
            # Guardar la beca con el usuario actual como creador
            scholarship = serializer.save(created_by=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class ScholarshipDetailView(APIView):
    """
    Vista para recuperar, actualizar o eliminar una beca específica.
    GET: Obtener detalle de una beca
    PUT: Actualizar una beca completa
    PATCH: Actualizar parcialmente una beca
    DELETE: Eliminar una beca
    """
    permission_classes = [permissions.IsAuthenticated]
    
    def get_object(self, pk):
        """Obtener objeto de beca por ID"""
        return get_object_or_404(Scholarship, pk=pk)
    
    def check_permission(self, scholarship, user):
        """Verificar si el usuario tiene permiso para modificar la beca"""
        # El creador de la beca siempre puede modificarla
        if scholarship.created_by == user:
            return True
            
        # Si la beca pertenece a una organización, verificar si el usuario es admin
        if scholarship.organization:
            is_admin = Membership.objects.filter(
                user=user,
                organization=scholarship.organization,
                is_admin=True,
                is_active=True
            ).exists()
            return is_admin
            
        return False
    
    def get(self, request, pk):
        """Obtener detalle de una beca específica"""
        scholarship = self.get_object(pk)
        serializer = ScholarshipSerializer(scholarship)
        return Response(serializer.data)
    
    def put(self, request, pk):
        """Actualizar una beca completa"""
        scholarship = self.get_object(pk)
        
        # Verificar permisos
        if not self.check_permission(scholarship, request.user):
            return Response(
                {"error": "No tienes permiso para modificar esta beca."},
                status=status.HTTP_403_FORBIDDEN
            )
        
        serializer = ScholarshipSerializer(scholarship, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def patch(self, request, pk):
        """Actualizar parcialmente una beca"""
        scholarship = self.get_object(pk)
        
        # Verificar permisos
        if not self.check_permission(scholarship, request.user):
            return Response(
                {"error": "No tienes permiso para modificar esta beca."},
                status=status.HTTP_403_FORBIDDEN
            )
        
        serializer = ScholarshipSerializer(scholarship, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def delete(self, request, pk):
        """Eliminar una beca"""
        scholarship = self.get_object(pk)
        
        # Verificar permisos
        if not self.check_permission(scholarship, request.user):
            return Response(
                {"error": "No tienes permiso para eliminar esta beca."},
                status=status.HTTP_403_FORBIDDEN
            )
        
        scholarship.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

class ScholarshipListView(APIView):
    permission_classes = [AllowAny]
    
    def get(self, request):
        # Obtener el parámetro de organización si existe
        organization_id = request.query_params.get('organization', None)
        
        # Filtrar scholarships
        if organization_id:
            # Verificar que la organización existe
            organization = get_object_or_404(Organization, id=organization_id)
            scholarship_data = Scholarship.objects.filter(organization=organization)
        else:
            # Si no hay filtro, devolver todas
            scholarship_data = Scholarship.objects.all()
        
        # Ordenar por fecha de publicación (más recientes primero)
        scholarship_data = scholarship_data.order_by('-publication_date')
        
        serializer = ScholarshipSerializer(scholarship_data, many=True)
        return Response(serializer.data)

class UserDataListView(APIView):
    def get(self, request):
        user_data = UserData.objects.all()
        serializer = UserDataSerializer(user_data, many=True)
        return Response(serializer.data)
    

## Vistas de Organización ##


class OrganizationViewSet(viewsets.ModelViewSet):
    """
    ViewSet para gestionar el CRUD completo de Organizaciones.
    Las operaciones disponibles serán:
      - list: Listar todas las organizaciones
      - create: Crear una nueva organización
      - retrieve: Obtener el detalle de una organización
      - update: Actualizar completamente una organización (solo admins)
      - partial_update: Actualizar parcialmente una organización (solo admins)
      - destroy: Eliminar una organización (solo admins)
    """
    queryset = Organization.objects.all()
    serializer_class = OrganizationSerializer

    def get_permissions(self):
        """Definir permisos según la acción"""
        if self.action in ['list', 'retrieve']:
            permission_classes = [AllowAny]
        else:
            permission_classes = [permissions.IsAuthenticated]
        return [permission() for permission in permission_classes]

    def get_serializer_context(self):
        """Agregar contexto al serializer"""
        context = super().get_serializer_context()
        context['request'] = self.request           
        return context

    def check_admin_permission(self, organization):
        """
        Verificar si el usuario actual es admin de la organización
        """
        if not self.request.user.is_authenticated:
            raise PermissionDenied("Debes estar autenticado para realizar esta acción.")
        
        # Verificar si el usuario es admin de esta organización
        is_admin = Membership.objects.filter(
            user=self.request.user,
            organization=organization,
            is_admin=True,
            is_active=True
        ).exists()
        
        if not is_admin:
            raise PermissionDenied("No tienes permisos de administrador para esta organización.")

    def update(self, request, *args, **kwargs):
        """Actualizar completamente una organización (solo admins)"""
        organization = self.get_object()
        self.check_admin_permission(organization)
        return super().update(request, *args, **kwargs)

    def partial_update(self, request, *args, **kwargs):
        """Actualizar parcialmente una organización (solo admins)"""
        organization = self.get_object()
        self.check_admin_permission(organization)
        return super().partial_update(request, *args, **kwargs)

    def destroy(self, request, *args, **kwargs):
        """Eliminar una organización (solo admins)"""
        organization = self.get_object()
        self.check_admin_permission(organization)
        return super().destroy(request, *args, **kwargs)

class JoinOrganizationView(APIView):
    """
    Vista para solicitar unirse a una organización.
    
    POST: Solicitar unirse a una organización
    """
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, format=None):
        organization_id = request.data.get("organization_id")
        if not organization_id:
            return Response({"error": "Se requiere el organization_id."}, status=status.HTTP_400_BAD_REQUEST)
        try:
            organization = Organization.objects.get(id=organization_id)
        except Organization.DoesNotExist:
            return Response({"error": "La organización no existe."}, status=status.HTTP_404_NOT_FOUND)
        
        # Verifica si ya existe una solicitud o el usuario ya es miembro
        if Membership.objects.filter(user=request.user, organization=organization).exists():
            return Response({"error": "Ya has solicitado o eres miembro de esta organización."}, status=status.HTTP_400_BAD_REQUEST)
        
        membership = Membership.objects.create(
            user=request.user,
            organization=organization,
            is_admin=False,
            is_active=False
        )
        serializer = MembershipSerializer(membership)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
        
class AcceptMembershipView(APIView):
    """
    Vista para aceptar una solicitud de membresía.
    
    POST: Aceptar una solicitud de membresía
    """
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, format=None):
        membership_id = request.data.get("membership_id")
        if not membership_id:
            return Response({"error": "Se requiere el membership_id."}, status=status.HTTP_400_BAD_REQUEST)
        try:
            membership = Membership.objects.get(id=membership_id)
        except Membership.DoesNotExist:
            return Response({"error": "La solicitud de membresía no existe."}, status=status.HTTP_404_NOT_FOUND)
        
        admin_exists = Membership.objects.filter(
            organization=membership.organization,
            user=request.user,
            is_admin=True,
            is_active=True  
        ).exists()
        if not admin_exists:
            return Response({"error": "No tienes permisos para aceptar miembros en esta organización."}, status=status.HTTP_403_FORBIDDEN)
        
        membership.is_active = True
        membership.save()
        serializer = MembershipSerializer(membership)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
class UserMembershipsView(APIView):
    """
    Vista para obtener las memberships de un usuario dado su id.
    """
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        memberships = Membership.objects.filter(user=request.user, is_active=True)
        serializer = MembershipSerializer(memberships, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
class UserMembershipAdminView(APIView):
    """
    Vista para obtener las memberships de un usuario dado su id, donde es admin.
    """
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        memberships = Membership.objects.filter(user=request.user, is_active=True, is_admin=True)
        serializer = MembershipSerializer(memberships, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
class MembershipListView(APIView):
    def get(self, request):
        memberships = Membership.objects.all()
        serializer = MembershipSerializer(memberships, many=True)
        return Response(serializer.data)

class CategoryListView(APIView):
    def get(self, request):
        categories = Category.objects.all()
        serializer = CategorySerializer(categories, many=True)
        return Response(serializer.data)
    
class TypeListView(APIView):
    def get(self, request):
        types = Type.objects.all()
        serializer = TypeSerializer(types, many=True)
        return Response(serializer.data)



class PublicUserProfileView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, id):
        print(f"=== DEBUG: Obteniendo perfil para usuario ID: {id} ===")
        print(f"Request headers: {dict(request.headers)}")
        
        try:
            user = get_object_or_404(User, id=id)
            print(f"Usuario encontrado: {user.username}")
            
            # Asegurar que el usuario tenga un objeto student
            if not hasattr(user, 'student'):
                print("Creando UserData para el usuario...")
                UserData.objects.create(user=user)
                # Refrescar el objeto user desde la base de datos
                user.refresh_from_db()
            
            print("Serializando datos del usuario...")
            serializer = PublicUserProfileSerializer(user)
            print(f"Datos serializados: {serializer.data}")
            
            return Response(serializer.data)
            
        except Exception as e:
            print(f"Error in PublicUserProfileView: {e}")
            import traceback
            traceback.print_exc()
            return Response(
                {'error': f'Error al obtener el perfil: {str(e)}'}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

class UpdateProfilePhotoView(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request):
        user_data = request.user.student
        photo = request.FILES.get('photo')
        if not photo:
            return Response({"error": "No se proporcionó ninguna imagen."}, status=400)

        user_data.photo = photo
        user_data.save()
        return Response({"message": "Foto actualizada correctamente."})

class UpdateUserView(APIView):
    permission_classes = [IsAuthenticated]
    
    def patch(self, request):
        user = request.user
        serializer = UserSerializer(user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=400)

class UpdateStudentView(APIView):
    permission_classes = [IsAuthenticated]
    
    def patch(self, request):
        student, created = UserData.objects.get_or_create(user=request.user)
        serializer = UserDataSerializer(student, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=400)