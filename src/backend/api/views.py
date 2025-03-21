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

from django.http import JsonResponse
from django.shortcuts import render
from django.contrib.auth.models import User
from rest_framework import generics, permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth.decorators import login_required
from django.utils.decorators import method_decorator
from django.views import View
from .models.scholarship import Scholarship
from .models.user_data import UserData
from .models.organization import Organization, Membership
from .models.category import Category
from .models.type import Type
from .models.country import Country
from .models.interests import Interest
from .serializers import (
    UserSerializer, ScholarshipSerializer, OrganizationSerializer, 
    MembershipSerializer, CategorySerializer, UserDataSerializer, 
    TypeSerializer, CountrySerializer, InterestSerializer
)

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

        return response

class UserDetailView(APIView):
    permission_classes = [IsAuthenticated]  # Solo usuarios autenticados pueden acceder

    def get(self, request):
        user = request.user  # Obtiene el usuario desde el token
        print(user)
        serializer = UserSerializer(user)
        return Response(serializer.data)

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

class ScholarshipListView(APIView):
    def get(self, request):
        scholarships = Scholarship.objects.all()
        serializer = ScholarshipSerializer(scholarships, many=True)
        return Response(serializer.data)

class UserDataListView(APIView):
    def get(self, request):
        user_data = UserData.objects.all()
        serializer = UserDataSerializer(user_data, many=True)
        return Response(serializer.data)
    
class OrganizationListView(APIView):
    def get(self, request):
        organizations = Organization.objects.all()
        serializer = OrganizationSerializer(organizations, many=True)
        return Response(serializer.data)

#############################################################################3

class OrganizationCreateView(generics.CreateAPIView):
    queryset = Organization.objects.all()
    serializer_class = OrganizationSerializer
    permission_classes = [permissions.IsAuthenticated]

class JoinOrganizationView(APIView):
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
        
        # Crear la solicitud: el usuario que se une no es admin y la solicitud queda pendiente
        membership = Membership.objects.create(
            user=request.user,
            organization=organization,
            is_admin=False,
            is_active=False
        )
        serializer = MembershipSerializer(membership)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
        
class AcceptMembershipView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, format=None):
        membership_id = request.data.get("membership_id")
        if not membership_id:
            return Response({"error": "Se requiere el membership_id."}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            membership = Membership.objects.get(id=membership_id)
        except Membership.DoesNotExist:
            return Response({"error": "La solicitud de membresía no existe."}, status=status.HTTP_404_NOT_FOUND)
        
        # Verificar que el usuario que realiza la solicitud sea administrador de la organización
        admin_exists = Membership.objects.filter(
            organization=membership.organization,
            user=request.user,
            is_admin=True,
            is_active=True  # Se asume que el admin ya tiene la solicitud aceptada
        ).exists()
        if not admin_exists:
            return Response({"error": "No tienes permisos para aceptar miembros en esta organización."}, status=status.HTTP_403_FORBIDDEN)
        
        # Actualizar la solicitud a aceptada
        membership.is_active = True
        membership.save()
        serializer = MembershipSerializer(membership)
        return Response(serializer.data, status=status.HTTP_200_OK)

        
############################################################################
    
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

class CountryListView(APIView):
    def get(self, request):
        countries = Country.objects.all()
        serializer = CountrySerializer(countries, many=True)
        return Response(serializer.data)

class InterestListView(APIView):
    def get(self, request):
        interests = Interest.objects.all()
        serializer = InterestSerializer(interests, many=True)
        return Response(serializer.data)