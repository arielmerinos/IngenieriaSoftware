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

from django.contrib.auth.models import User
from rest_framework import serializers
from .models.scholarship import Scholarship
from .models.user_data import UserData
from .models.organization import Organization
from .models.organization import Membership
from .models.category import Category
from .models.type import Type
from .models.country import Country
from .models.interests import Interest

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "username", "password"]
        extra_kwargs = {"password": {"write_only": True}}

    def create(self, validated_data):
        print(validated_data)
        user = User.objects.create_user(**validated_data)
        return user
    
# class ScholarshipSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = Scholarship
#         fields = ["id", "organization", "name", "publication_date", "start_date", "end_date", "type", "image", "content", "categories","created_by","country"]
#         read_only_fields = ["publication_date", "created_by","id","organization"]
#         extra_kwargs = {"organization": {"read_only": True}}

class ScholarshipSerializer(serializers.ModelSerializer):
    class Meta:
        model = Scholarship
        fields = [
            "id", 
            "organization", 
            "name", 
            "publication_date", 
            "start_date", 
            "end_date", 
            "type", 
            "image", 
            "content", 
            "interests",
            "created_by",
            "country"
        ]
        read_only_fields = ["publication_date", "created_by", "id"]
    
    def create(self, validated_data):
        # Extraer relaciones ManyToMany antes de crear la beca
        types = validated_data.pop('type', [])
        interests = validated_data.pop('interests', [])
        countries = validated_data.pop('country', [])
        
        # Crear la beca con los datos restantes
        scholarship = Scholarship.objects.create(**validated_data)
        
        # Añadir relaciones ManyToMany después de crear
        if types:
            scholarship.type.set(types)
        if interests:
            scholarship.interests.set(interests)
        if countries:
            scholarship.country.set(countries)
            
        return scholarship
    
    def update(self, instance, validated_data):
        # Actualizar relaciones ManyToMany si están presentes
        if 'type' in validated_data:
            instance.type.set(validated_data.pop('type'))
        if 'interests' in validated_data:
            instance.interests.set(validated_data.pop('interests'))
        if 'country' in validated_data:
            instance.country.set(validated_data.pop('country'))
        
        # Actualizar campos normales
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        
        instance.save()
        return instance

class UserDataSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserData
        fields = ["id", "history_search", "interests", "phone_number", "birthday", "user", "memberships", "history_search"]
        read_only_fields = ["user", "id"]
        extra_kwargs = {"user": {"read_only": True}}
        
class OrganizationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Organization
        fields = ['name', 'email', 'website', 'description', 'phone_number', 'logo']
        extra_kwargs = {
            'phone_number': {'required': False, 'allow_null': True},
            'logo': {'required': False, 'allow_null': True},
        }
    
    def create(self, validated_data):
        request = self.context.get('request')
        organization = Organization.objects.create(**validated_data)
        Membership.objects.create(user=request.user, organization=organization, is_admin=True)
        return organization
        
        
class MembershipSerializer(serializers.ModelSerializer):
    class Meta:
        model = Membership
        fields = ["id", "user", "organization", "is_admin", "is_active"]
        read_only_fields = ['id', 'user', 'organization', 'is_admin', 'is_active']

    def create(self, validated_data):
        return Membership.objects.create(**validated_data)

    def delete(self, validated_data):
        Membership.objects.filter(**validated_data).delete()
        
    def update(self, instance, validated_data):
        instance.is_admin = validated_data.get("is_admin", instance.is_admin)
        instance.save()
        return instance

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ["id", "name"]

class TypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Type
        fields = ["id", "name"]
        
class CountrySerializer(serializers.ModelSerializer):
    class Meta:
        model = Country
    fields = ["id", "name", "emoji"]
    
class InterestSerializer(serializers.ModelSerializer):
    class Meta:
        model = Interest
    fields = ["id", "name","color"]
        
    