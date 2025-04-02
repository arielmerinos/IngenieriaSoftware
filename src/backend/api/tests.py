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

from django.test import TestCase
from django.urls import reverse
from .serializers import MembershipSerializer, OrganizationSerializer
from rest_framework.test import APIClient, APITestCase
from django.contrib.auth import get_user_model
from rest_framework import status
import json
from datetime import date, timedelta

from .models.scholarship import Scholarship
from .models.type import Type
from .models.country import Country
from .models.interests import Interest
from .models.organization import Organization, Membership

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


class ScholarshipTests(APITestCase):
    def setUp(self):
        # Crear usuario para pruebas
        self.client = APIClient()
        self.user = User.objects.create_user(
            username='testuser',
            password='testpassword123',
            email='test@example.com'
        )
        
        # Autenticar al usuario
        self.client.force_authenticate(user=self.user)
        
        # Crear tipos, países e intereses para las pruebas
        self.scholarship_type = Type.objects.create(name='Beca', type_name='beca')
        self.country = Country.objects.create(name='México', emoji='🇲🇽')
        self.interest = Interest.objects.create(name='Tecnología', color='#3498db')
        
        # Crear organización y membresía para pruebas
        self.organization = Organization.objects.create(
            name='Universidad Test',
            email='uni@test.com',
            phone_number='123456789',
            website='https://www.test.com'
        )
        
        self.membership = Membership.objects.create(
            user=self.user,
            organization=self.organization,
            is_admin=True,
            is_active=True
        )
        
        # Crear beca de prueba
        self.scholarship = Scholarship.objects.create(
            name='Beca de prueba',
            start_date=date.today(),
            end_date=date.today() + timedelta(days=30),
            content='Descripción de la beca de prueba',
            created_by=self.user,
            organization=self.organization
        )
        
        # Añadir relaciones muchos a muchos
        self.scholarship.type.add(self.scholarship_type)
        self.scholarship.country.add(self.country)
        self.scholarship.interests.add(self.interest)
        
        # URLs para pruebas
        self.list_create_url = reverse('scholarship-list-create')
        self.detail_url = reverse('scholarship-detail', args=[self.scholarship.id])
    
    # def test_list_scholarships(self):
    #     """Prueba para listar todas las becas"""
    #     response = self.client.get(self.list_create_url)
    #     self.assertEqual(response.status_code, status.HTTP_200_OK)
    #     self.assertEqual(len(response.data), 1)
    
    # def test_create_scholarship(self):
    #     """Prueba para crear una nueva beca"""
    #     data = {
    #         'name': 'Nueva beca',
    #         'start_date': date.today().strftime('%Y-%m-%d'),
    #         'end_date': (date.today() + timedelta(days=60)).strftime('%Y-%m-%d'),
    #         'content': 'Descripción de la nueva beca',
    #         'organization': self.organization.id,
    #         'type': [self.scholarship_type.id],
    #         'country': [self.country.id],
    #         'interests': [self.interest.id]
    #     }
        
        # response = self.client.post(self.list_create_url, data, format='json')
        # self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        # self.assertEqual(Scholarship.objects.count(), 2)
        # self.assertEqual(response.data['name'], 'Nueva beca')
    
    # def test_retrieve_scholarship(self):
    #     """Prueba para obtener detalle de una beca"""
    #     response = self.client.get(self.detail_url)
    #     self.assertEqual(response.status_code, status.HTTP_200_OK)
    #     self.assertEqual(response.data['name'], 'Beca de prueba')
    
    # def test_update_scholarship(self):
    #     """Prueba para actualizar una beca completa"""
    #     data = {
    #         'name': 'Beca actualizada',
    #         'start_date': date.today().strftime('%Y-%m-%d'),
    #         'end_date': (date.today() + timedelta(days=90)).strftime('%Y-%m-%d'),
    #         'content': 'Descripción actualizada',
    #         'organization': self.organization.id,
    #         'type': [self.scholarship_type.id],
    #         'country': [self.country.id],
    #         'interests': [self.interest.id]
    #     }
        
    #     response = self.client.put(self.detail_url, data, format='json')
    #     self.assertEqual(response.status_code, status.HTTP_200_OK)
    #     self.scholarship.refresh_from_db()
    #     self.assertEqual(self.scholarship.name, 'Beca actualizada')
    #     self.assertEqual(self.scholarship.content, 'Descripción actualizada')
    
    # def test_partial_update_scholarship(self):
    #     """Prueba para actualizar parcialmente una beca"""
    #     data = {
    #         'name': 'Beca parcialmente actualizada'
    #     }
        
    #     response = self.client.patch(self.detail_url, data, format='json')
    #     self.assertEqual(response.status_code, status.HTTP_200_OK)
    #     self.scholarship.refresh_from_db()
    #     self.assertEqual(self.scholarship.name, 'Beca parcialmente actualizada')
    #     # El resto de datos permanecen iguales
    #     self.assertEqual(self.scholarship.content, 'Descripción de la beca de prueba')
    
    # def test_delete_scholarship(self):
    #     """Prueba para eliminar una beca"""
    #     response = self.client.delete(self.detail_url)
    #     self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
    #     self.assertEqual(Scholarship.objects.count(), 0)
    
    def test_unauthorized_access(self):
        """Prueba para verificar acceso no autorizado"""
        # Logout
        self.client.force_authenticate(user=None)
        
        # Intentar acceder sin autenticación
        response = self.client.get(self.list_create_url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

class OrganizationSerializerTest(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username='testuser',
            password='pass123',
            email='test@example.com'
        )
        self.context = {'request': type('Request', (), {'user': self.user})}
        # Datos válidos para la creación de una organización
        self.valid_data = {
            'id': '1',
            'name': 'Organización de Prueba',
            'email': 'contacto@orgprueba.com',
            'website': 'https://orgprueba.com',
            'description': 'Descripción de la organización de prueba',
            'phone_number': '123456789',
            'logo': None  # Opcional
        }

    def test_organization_serializer_valido(self):
        serializer = OrganizationSerializer(data=self.valid_data, context=self.context)
        self.assertTrue(serializer.is_valid(), serializer.errors)
        organization = serializer.save()
        # Verificamos que se haya creado la organización con los datos correctos
        self.assertEqual(organization.name, self.valid_data['name'])
        self.assertEqual(organization.email, self.valid_data['email'])
        # Verificamos que se haya creado la membresía correspondiente y que el usuario sea admin
        membership = Membership.objects.get(organization=organization, user=self.user)
        self.assertTrue(membership.is_admin)
        # self.assertTrue(not membership.is_active)  # Dependiendo de la lógica, si se marca activa al crearse

    def test_organization_serializer_datos_invalidos(self):
        # Por ejemplo, si se omite el campo 'name' que es requerido
        data_invalida = self.valid_data.copy()
        data_invalida.pop('name')
        serializer = OrganizationSerializer(data=data_invalida, context=self.context)
        self.assertFalse(serializer.is_valid())
        self.assertIn('name', serializer.errors)


class MembershipSerializerTest(TestCase):
    def setUp(self):
        # Usuario y organización para probar Membership
        self.user = User.objects.create_user(
            username='memberuser',
            password='pass123',
            email='member@example.com'
        )
        self.organization = Organization.objects.create(
            id = 3,
            name='testorg',
            email='unam@gmail.com',
            website='http://unam.com.mx',
            description='testorg description',
            phone_number='7774761814',
            logo='/media/logos/IMG_0587.jpeg'
        )
        # Datos iniciales para la membresía
        self.membership_data = {
            'user': self.user.id,
            'organization': self.organization.id,
            'is_admin': True,
            'is_active': True
        }

    def test_membership_serializer_creacion(self):
        serializer = MembershipSerializer(data=self.membership_data)
        self.assertTrue(serializer.is_valid(), serializer.errors)
        membership = serializer.save()

        # Verificar los datos de la membresía
        self.assertEqual(membership.user, self.user)
        self.assertEqual(membership.organization, self.organization)
        self.assertTrue(membership.is_admin)
        self.assertTrue(membership.is_active)

        # Serializar la membresía creada
        serialized_membership = MembershipSerializer(membership).data

        # Verificar la salida serializada
        expected_output = {
            'id': membership.id,
            'user': self.user.id,
            'organization': {
                'id': self.organization.id,
                'name': self.organization.name,
                'email': self.organization.email,
                'website': self.organization.website,
                'description': self.organization.description,
                'phone_number': self.organization.phone_number,
                'logo': self.organization.logo,
            },
            'is_admin': True,
            'is_active': True
        }
        self.assertEqual(serialized_membership, expected_output)
