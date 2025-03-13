from django.shortcuts import render
from django.contrib.auth.models import User
from rest_framework import generics
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework_simplejwt.tokens import RefreshToken
from .serializers import UserSerializer, ScholarshipSerializer
from django.http import JsonResponse
from django.contrib.auth.decorators import login_required
from django.utils.decorators import method_decorator
from django.views import View
from .models.scholarship import Scholarship

class CreateUserView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]

    def create(self, request, *args, **kwargs):
        response = super().create(request, *args, **kwargs)
        user = User.objects.get(username=request.data["username"])

        # Generar tokens para el usuario recién creado
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


class ScholarshipListView(generics.ListCreateAPIView):
    queryset = Scholarship.objects.all()
    model = Scholarship
    context_object_name = 'scholarships'
    serializer_class = ScholarshipSerializer

