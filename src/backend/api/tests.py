from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APIClient, APITestCase
from django.contrib.auth import get_user_model
from rest_framework import status
import json

User = get_user_model()

class LoginTests(APITestCase):
    def setUp(self):
        self.client = APIClient()
        # Crear un usuario de prueba
        self.user_data = {
            'username': 'test',
            'password': 'micontracontracontra3',
            'email': 'test@ciencias.unam.mx',
        }
        self.user = User.objects.create_user(**self.user_data)
        
        # URLs para las pruebas
        self.login_url = reverse('get_token')
        self.refresh_token_url = reverse('refresh')
        self.user_detail_url = reverse('user_detail')
    
    def test_login_success(self):
        # Prueba un inicio de sesión exitoso con credenciales válidas
        login_data = {
            'username': 'test',
            'password': 'micontracontracontra3'
        }
        response = self.client.post(self.login_url, login_data, format='json')
        
        # Verificar respuesta correcta
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('access', response.data)
        self.assertIn('refresh', response.data)
    
    def test_login_fail_wrong_password(self):
        # Prueba un inicio de sesión con contraseña incorrecta
        login_data = {
            'username': 'test',
            'password': 'wrongpassword'
        }
        response = self.client.post(self.login_url, login_data, format='json')
        
        # Verificar respuesta de error
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
    
    def test_login_fail_user_not_found(self):
        # Prueba un inicio de sesión con usuario inexistente
        login_data = {
            'username': 'nonexistentuser',
            'password': 'micontracontracontra3'
        }
        response = self.client.post(self.login_url, login_data, format='json')
        
        # Verificar respuesta de error
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
    
    def test_access_protected_endpoint_with_token(self):
        # Prueba acceder a un endpoint protegido usando un token válido
        # Primero obtenemos el token
        login_data = {
            'username': 'test',
            'password': 'micontracontracontra3'
        }
        login_response = self.client.post(self.login_url, login_data, format='json')
        access_token = login_response.data['access']
        
        # Configuramos el token en el cliente
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {access_token}')
        
        # Intentamos acceder al endpoint protegido
        response = self.client.get(self.user_detail_url)
        
        # Verificar respuesta correcta
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['username'], 'test')
    
    def test_access_protected_endpoint_without_token(self):
        # Prueba acceder a un endpoint protegido sin token
        # Sin credenciales
        self.client.credentials()
        
        # Intentamos acceder al endpoint protegido
        response = self.client.get(self.user_detail_url)
        
        # Verificar respuesta de error
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
    
    def test_refresh_token(self):
        # Prueba la renovación de token JWT
        # Primero obtenemos los tokens iniciales
        login_data = {
            'username': 'test',
            'password': 'micontracontracontra3'
        }
        login_response = self.client.post(self.login_url, login_data, format='json')
        refresh_token = login_response.data['refresh']
        
        # Intentamos renovar el token
        refresh_data = {
            'refresh': refresh_token
        }
        response = self.client.post(self.refresh_token_url, refresh_data, format='json')
        
        # Verificar respuesta correcta
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('access', response.data)
    
    def test_refresh_token_invalid(self):
        # Prueba la renovación con un token inválido
        # Intentamos renovar con un token inválido
        refresh_data = {
            'refresh': 'invalid-token-string'
        }
        response = self.client.post(self.refresh_token_url, refresh_data, format='json')
        
        # Verificar respuesta de error
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)


class UserRegistrationTests(APITestCase):
    def setUp(self):
        # Configuración inicial para cada prueba de registro
        self.client = APIClient()
        self.register_url = reverse('register')
    
    def test_register_success(self):
        # Prueba un registro exitoso de usuario
        register_data = {
            'username': 'newuser',
            'password': 'micontracontracontra3',
            'email': 'newuser@ciencias.unam.mx'
        }
        response = self.client.post(self.register_url, register_data, format='json')
        
        # Verificar respuesta correcta
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertIn('access', response.data)
        self.assertIn('refresh', response.data)
        
        # Verificar que el usuario realmente se creó
        self.assertTrue(User.objects.filter(username='newuser').exists())
    
    def test_register_duplicate_username(self):
        # Prueba un registro con nombre de usuario duplicado
        # Crear un usuario primero
        User.objects.create_user(
            username='existinguser',
            password='micontracontracontra3',
            email='existing@ciencias.unam.mx'
        )
        
        # Intentar crear otro usuario con el mismo nombre
        register_data = {
            'username': 'existinguser',
            'password': 'otherpassword456',
            'email': 'new@ciencias.unam.mx'
        }
        response = self.client.post(self.register_url, register_data, format='json')
        
        # Verificar respuesta de error
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
    
    def test_register_invalid_data(self):
        # Prueba un registro con datos inválidos (sin contraseña)
        register_data = {
            'username': 'invaliduser',
            'email': 'invalid@ciencias.unam.mx'
            # Sin contraseña
        }
        response = self.client.post(self.register_url, register_data, format='json')
        
        # Verificar respuesta de error
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)


class SocialAuthTests(TestCase):
    def setUp(self):
        # Configuración inicial para las pruebas de autenticación social
        self.client = APIClient()
        self.token_url = reverse('user_tokens')
    
    def test_access_token_url_unauthenticated(self):
        # Prueba acceder a la URL de tokens sin autenticación
        response = self.client.get(self.token_url)
        
        # Debería redirigir al login ya que está decorado con @login_required
        self.assertEqual(response.status_code, status.HTTP_302_FOUND)