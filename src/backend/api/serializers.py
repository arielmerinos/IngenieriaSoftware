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

import logging
from django.contrib.auth.models import User
from django.core.validators import URLValidator, ValidationError
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

class TypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Type
        fields = ['id', 'name', 'type_name']
        
class CountrySerializer(serializers.ModelSerializer):
    class Meta:
        model = Country
        fields = ['id', 'name', 'emoji']
    
class InterestSerializer(serializers.ModelSerializer):
    class Meta:
        model = Interest
        fields = ['id', 'name', 'color']

class ScholarshipSerializer(serializers.ModelSerializer):
    # Use TypeSerializer for serialization and PrimaryKeyRelatedField for deserialization
    type = TypeSerializer(many=True, read_only=True)  # Nested serializer for output
    type_ids = serializers.PrimaryKeyRelatedField(
        queryset=Type.objects.all(),
        many=True,
        write_only=True  # Only used for input
    )
    interests = InterestSerializer(many=True, read_only=True)  # Nested serializer for output
    interest_ids = serializers.PrimaryKeyRelatedField(
        queryset=Interest.objects.all(),
        many=True,
        write_only=True  # Only used for input
    )
    country = CountrySerializer(many=True, read_only=True)  # Nested serializer for output
    country_ids = serializers.PrimaryKeyRelatedField(
        queryset=Country.objects.all(),
        many=True,
        write_only=True  # Only used for input
    )
    organization = serializers.SerializerMethodField()

    created_by = serializers.SlugRelatedField(
        queryset=User.objects.all(),
        slug_field='username',  # Accept the username instead of the pk
        required=True
    )

    class Meta:
        model = Scholarship
        fields = [
            "id",
            "organization",
            "name",
            "publication_date",
            "start_date",
            "end_date",
            "type",  # Nested serializer for output
            "type_ids",  # PrimaryKeyRelatedField for input
            "image",
            "content",
            "interests",  # Nested serializer for output
            "interest_ids",  # PrimaryKeyRelatedField for input
            "created_by",  # Accept username from the frontend
            "country",  # Nested serializer for output
            "country_ids",  # PrimaryKeyRelatedField for input
        ]
        read_only_fields = ["id", "publication_date"]

    def create(self, validated_data):
        # Extract Many-to-Many fields
        type_data = validated_data.pop('type_ids', [])
        interests_data = validated_data.pop('interest_ids', [])
        country_data = validated_data.pop('country_ids', [])

        logger = logging.getLogger(__name__)
        logger.debug("Type Data: %s", type_data)
        logger.debug("Interests Data: %s", interests_data)
        logger.debug("Country Data: %s", country_data)

        # Create the Scholarship object
        scholarship = Scholarship.objects.create(**validated_data)

        # Handle Many-to-Many fields
        if type_data:
            scholarship.type.set(type_data)  # Directly set the list of PKs

        if interests_data:
            scholarship.interests.set(interests_data)  # Directly set the list of PKs

        if country_data:
            scholarship.country.set(country_data)  # Directly set the list of PKs

        return scholarship

    def get_organization(self, obj):
        return obj.organization.name if obj.organization else None  # Return the name of the organization
    
    def update(self, instance, validated_data):
        # Update the fields directly
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
    website = serializers.CharField(allow_blank=True, required=False)

    class Meta:
        model = Organization
        fields = ['id','name', 'email', 'website', 'description', 'phone_number', 'logo']
        extra_kwargs = {
            'phone_number': {'required': False, 'allow_null': True},
            'logo': {'required': False, 'allow_null': True},
        }

    def validate_website(self, value: str) -> str:
        if not value:
            return value
        if not value.startswith(('http://', 'https://')):
            value = 'https://' + value
        validator = URLValidator()
        try:
            validator(value)
        except ValidationError:
            raise serializers.ValidationError(
                'Ingresa una URL válida, p.ej. permisos.com o https://permisos.com'
            )
        return value

    def create(self, validated_data):
        request = self.context.get('request')
        organization = Organization.objects.create(**validated_data)
        Membership.objects.create(
            user=request.user,
            organization=organization,
            is_admin=True,
            is_active=True
        )
        return organization
        
        
class MembershipSerializer(serializers.ModelSerializer):
    organization = OrganizationSerializer(read_only=True)  # Nested serializer for output
    organization_id = serializers.PrimaryKeyRelatedField(
        queryset=Organization.objects.all(),
        source='organization',  # Maps to the `organization` field in the model
        write_only=True  # Only used for input
    )

    class Meta:
        model = Membership
        fields = ['id', 'user', 'organization', 'organization_id', 'is_admin', 'is_active']

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

