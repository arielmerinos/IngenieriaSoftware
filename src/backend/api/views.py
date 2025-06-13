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

from .models.scholarship import Comment

from .serializers import (
    UserSerializer, ScholarshipSerializer, OrganizationSerializer, 
    MembershipSerializer, CategorySerializer, UserDataSerializer, 
    TypeSerializer, CountrySerializer, InterestSerializer, ActivitySerializer, CommentSerializer
)

# Imports de Notifiaciones
from actstream import action
from actstream.models import target_stream # Metodo que devuelve las notificaciones del target
from actstream.models import user_stream # Metodo que devuelve las notificaciones de las cosas que sigue el usuario
from actstream.actions import follow, unfollow

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


    def get(self, request):
        user = request.user
        # Obtener las notificaciones del usuario
        # notifications = target_stream(user)
        notifications = user_stream(
            request.user, with_user_activity=True).exclude(verb='started following')
        # Excluir notificaciones de "started following"
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

            
            # Guardar la beca con el usuario actual como creador
            scholarship = serializer.save(created_by=request.user)

            # El autor de la beca sigue a la beca pa que las notificaciones
            # relacioandas a esta aparezcan en su stream
            follow(request.user, scholarship, actor_only=False)

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

class FollowOrganizationView(APIView):
    """
    Vista para alternar el seguimiento de una organización.

    POST: Si no existe la relación, la crea con is_active=True.
          Si ya existe, invierte el valor de is_active (seguir / dejar de seguir).
    """
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, format=None):
        organization_id = request.data.get("organization_id")
        if not organization_id:
            return Response(
                {"error": "Se requiere el organization_id."},
                status=status.HTTP_400_BAD_REQUEST
            )

        organization = get_object_or_404(Organization, id=organization_id)

        membership, created = Membership.objects.get_or_create(
            user=request.user,
            organization=organization,
            defaults={
                'is_admin': False,
                'is_active': True
            }
        )

        if not created:
            membership.is_active = not membership.is_active
            membership.save()

        serializer = MembershipSerializer(membership)
        
        action.send(
            request.user,
            target=organization,
            verb= "addFollower" if membership.is_active else "dropFollower"
        )

        status_code = status.HTTP_201_CREATED if created else status.HTTP_200_OK
        return Response(serializer.data, status=status_code)
        
class ToggleAdminStatusView(APIView):
    """
    Vista para alternar el estado de administrador de una membresía.
    Si es admin, lo degrada. Si no es admin, lo promueve.
    """
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, *args, **kwargs):
        membership_id = request.data.get("membership_id")
        if not membership_id:
            return Response({"error": "Se requiere el ID de la membresía (membership_id)."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            membership_to_change = Membership.objects.get(id=membership_id)
        except Membership.DoesNotExist:
            return Response({"error": "La membresía no existe."}, status=status.HTTP_404_NOT_FOUND)

        is_requester_admin = Membership.objects.filter(
            organization=membership_to_change.organization,
            user=request.user,
            is_admin=True
        ).exists()

        if not is_requester_admin:
            return Response({"error": "No tienes permisos para modificar roles en esta organización."}, status=status.HTTP_403_FORBIDDEN)

        membership_to_change.is_admin = not membership_to_change.is_admin
        membership_to_change.save()

        serializer = MembershipSerializer(membership_to_change)

        if membership_to_change.is_admin:
            follow(membership_to_change.user, membership_to_change.organization, actor_only=False)
            action.send(
                request.user,
                target=membership_to_change.user,
                verb="givenAdmin",
                action_object=membership_to_change.organization
            )
        else:
            unfollow(membership_to_change.user, membership_to_change.organization)
            action.send(
                request.user,
                target=membership_to_change.user,
                verb="lostAdmin",
                action_object=membership_to_change.organization
            )

        return Response(serializer.data, status=status.HTTP_200_OK)

class OrganizationMembershipsView(APIView):
    """
    Vista para obtener todas las membresías de una organización específica.
    Requiere que el usuario que hace la petición sea admin de dicha organización.
    """
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, organization_id, *args, **kwargs):
        # Verificar que la organización existe para evitar errores
        from .models import Organization # Importación local para evitar importación circular si es necesario
        if not Organization.objects.filter(id=organization_id).exists():
            return Response({"error": "Organización no encontrada."}, status=status.HTTP_404_NOT_FOUND)

        # Verificación de permisos: El usuario que pide la lista debe ser admin de esa organización.
        is_requester_admin = Membership.objects.filter(
            organization__id=organization_id,
            user=request.user,
            is_admin=True
        ).exists()

        if not is_requester_admin:
            return Response({"error": "No tienes permisos para ver los miembros de esta organización."}, status=status.HTTP_403_FORBIDDEN)
        
        # Si tiene permisos, obtener y devolver todos los miembros de la organización.
        memberships = Membership.objects.filter(organization__id=organization_id)
        serializer = MembershipSerializer(memberships, many=True)
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
        memberships = Membership.objects.filter(user=request.user, is_admin=True)
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

class CommentView(APIView):
    """
    Vista para comentarios en una beca.
    
    PUT: Crear un nuevo comentario.

    GET: Listar todos los comentarios de una beca.
    """

    def put(self, request, pk):

        scholarship = get_object_or_404(Scholarship, pk=pk)

        content = request.data.get("content")
        
        if not content:
            return Response({"error": "El contenido del comentario es obligatorio."}, status=status.HTTP_400_BAD_REQUEST)
        
        comment = Comment.objects.create(
            scholarship=scholarship,
            user=request.user,
            content=content
        )

        serializer = CommentSerializer(comment)

        # Envia la notifiacion a quien siga la beca
        action.send(
            request.user, # El usuario que crea el comentario
            verb='newComment',
            action_object=comment, # El comentario creado
            target=scholarship, # La beca a la que se le hace el comentario
        )
        
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    def get(self, request, pk):

        scholarship = get_object_or_404(Scholarship, pk=pk)
        
        comments = Comment.objects.filter(scholarship=scholarship)
        
        serializer = CommentSerializer(comments, many=True)

        return Response(serializer.data, status=status.HTTP_200_OK)
    
    def get_permissions(self):
        """
        Define los permisos para cada vista.
        Se pueden ver los comentarios de una beca sin autenticación,
        pero para crear un comentario se requiere autenticación.
        """
        if self.request.method in ['GET']:
            return [permissions.AllowAny()]
        
        return [permissions.IsAuthenticated()]

class CommentEditView(APIView):
    """
    Vista para editar o eliminar un comentario.

    DELETE: Eliminar un comentario existente.
    """
    
    permission_classes = [permissions.IsAuthenticated]
    
    def delete(self, request, pk):
        
        comment = get_object_or_404(Comment, pk=pk)
        
        # Verificar que el usuario es el autor del comentario
        if comment.user != request.user:
            return Response(
                {"error": "No tienes permiso para eliminar este comentario."},
                status=status.HTTP_403_FORBIDDEN
            )
        
        comment.delete()
        
        return Response(status=status.HTTP_200_OK)