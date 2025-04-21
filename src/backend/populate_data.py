import os
import django

# Configurar el entorno Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

# Importar los modelos
from django.contrib.auth.models import User
from api.models.type import Type
from api.models.country import Country
from api.models.interests import Interest
from api.models.organization import Organization, Membership
from api.models.user_data import UserData

def populate_data():
    print('Cargando datos iniciales...')
    
    # Crear tipos de becas
    create_scholarship_types()
    
    # Crear países
    create_countries()
    
    # Crear intereses
    create_interests()
    
    # Crear usuario administrador si no existe
    create_admin_user()
    
    print('Datos iniciales cargados correctamente.')

def create_scholarship_types():
    # Definir tipos de becas
    types_data = [
        {'name': 'Beca completa', 'type_name': Type.BECA},
        {'name': 'Maestría', 'type_name': Type.MAESTRIA},
        {'name': 'Doctorado', 'type_name': Type.DOCTORADO},
        {'name': 'Postdoc', 'type_name': Type.POSTDOC},
        {'name': 'Investigación', 'type_name': Type.INVESTIGACION},
        {'name': 'Intercambio', 'type_name': Type.INTERCAMBIO},
        {'name': 'Curso', 'type_name': Type.CURSO},
        {'name': 'Taller', 'type_name': Type.TALLER},
        {'name': 'Seminario', 'type_name': Type.SEMINARIO},
        {'name': 'Conferencia', 'type_name': Type.CONFERENCIA},
        {'name': 'Congreso', 'type_name': Type.CONGRESO},
        {'name': 'Simposio', 'type_name': Type.SIMPOSIO},
        {'name': 'Foro', 'type_name': Type.FORO},
        {'name': 'Voluntariado', 'type_name': Type.VOLUNTARIADO},
        {'name': 'Hackathon', 'type_name': Type.HACKATHON},
        {'name': 'Evento', 'type_name': Type.EVENTO},
        {'name': 'Otro', 'type_name': Type.OTRO},
    ]
    
    for type_data in types_data:
        Type.objects.get_or_create(
            name=type_data['name'],
            type_name=type_data['type_name']
        )
    
    print(f'- {len(types_data)} tipos de becas creados/actualizados')

def create_countries():
    # Definir países más relevantes para becas
    
        # Eliminar todos los países existentes
    Country.objects.all().delete()
    print('- Todos los países existentes han sido eliminados')
    
    countries_data = [
        {'name': 'México', 'emoji': 'MX'},
        {'name': 'España', 'emoji': 'ES'},
        {'name': 'Estados Unidos', 'emoji': 'US'},
        {'name': 'Canadá', 'emoji': 'CA'},
        {'name': 'Reino Unido', 'emoji': 'GB'},
        {'name': 'Francia', 'emoji': 'FR'},
        {'name': 'Alemania', 'emoji': 'DE'},
        {'name': 'Japón', 'emoji': 'JP'},
        {'name': 'Australia', 'emoji': 'AU'},
        {'name': 'Brasil', 'emoji': 'BR'},
    ]
    
    for country_data in countries_data:
        Country.objects.get_or_create(
            name=country_data['name'],
            emoji=country_data['emoji']
        )
    
    print(f'- {len(countries_data)} países creados/actualizados')

def create_interests():
    # Definir intereses académicos comunes
    interests_data = [
        {'name': 'Tecnología', 'color': '#3498db'},
        {'name': 'Ciencias', 'color': '#2ecc71'},
        {'name': 'Humanidades', 'color': '#e74c3c'},
        {'name': 'Artes', 'color': '#9b59b6'},
        {'name': 'Medicina', 'color': '#f1c40f'},
        {'name': 'Ingeniería', 'color': '#e67e22'},
        {'name': 'Negocios', 'color': '#1abc9c'},
        {'name': 'Derecho', 'color': '#34495e'},
        {'name': 'Educación', 'color': '#7f8c8d'},
        {'name': 'Ciencias Sociales', 'color': '#d35400'},
    ]
    
    for interest_data in interests_data:
        Interest.objects.get_or_create(
            name=interest_data['name'],
            color=interest_data['color']
        )
    
    print(f'- {len(interests_data)} intereses creados/actualizados')
    
def create_admin_user():
    # Verificar si el usuario administrador existe
    admin_user = None
    if not User.objects.filter(username='admin').exists():
        admin_user = User.objects.create_superuser(
            username='admin',
            email='admin@example.com',
            password='adminpassword'
        )
        print('- Usuario administrador creado')
    else:
        admin_user = User.objects.get(username='admin')
        print('- Usuario administrador ya existe')
    
    # Verificar si el usuario tiene datos asociados
    try:
        user_data = UserData.objects.get(user=admin_user)
        print('- Datos de usuario ya existen')
    except UserData.DoesNotExist:
        # Crear datos de usuario solo si no existen
        UserData.objects.create(
            user=admin_user,
            phone_number="admin-phone-" + str(admin_user.id)  # Usar ID para garantizar unicidad
        )
        print('- Datos de usuario administrador creados')
    
    # Verificar si ya existe la organización
    if not Organization.objects.filter(name='Universidad Ejemplo').exists():
        # Crear organización de ejemplo
        org = Organization.objects.create(
            name='Universidad Ejemplo',
            email='universidad@ejemplo.com',
            phone_number='1234567890',
            website='https://www.universidad-ejemplo.com'
        )
        
        # Verificar si ya existe la membresía
        if not Membership.objects.filter(user=admin_user, organization=org).exists():
            # Crear membresía como admin
            Membership.objects.create(
                user=admin_user,
                organization=org,
                is_admin=True,
                is_active=True
            )
        
        print('- Organización y membresía creadas')
    else:
        print('- Organización ya existe')

if __name__ == "__main__":
    populate_data()