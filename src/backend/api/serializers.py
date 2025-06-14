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
from .models.scholarship import Comment
from .models.saved_scholarship import SavedScholarship
from .models.user_data import UserData
from .models.organization import Organization
from .models.organization import Membership
from .models.category import Category
from .models.type import Type
from .models.country import Country
from .models.interests import Interest

# Imports de Notificaciones
from actstream.models import Action # Es el modelo de los cosos que crea actstream
from actstream.actions import follow, unfollow

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "username", "password"]
        extra_kwargs = {"password": {"write_only": True}}

    def create(self, validated_data):
        print(validated_data)
        user = User.objects.create_user(**validated_data)
        return user
    
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

class ScholarshipSerializer(serializers.ModelSerializer):
    # Use TypeSerializer for serialization and PrimaryKeyRelatedField for deserialization
    type = TypeSerializer(many=True, read_only=True)
    type_ids = serializers.PrimaryKeyRelatedField(
        queryset=Type.objects.all(),
        many=True,
        write_only=True
    )
    interests = InterestSerializer(many=True, read_only=True)
    interest_ids = serializers.PrimaryKeyRelatedField(
        queryset=Interest.objects.all(),
        many=True,
        write_only=True
    )
    country = CountrySerializer(many=True, read_only=True)
    country_ids = serializers.PrimaryKeyRelatedField(
        queryset=Country.objects.all(),
        many=True,
        write_only=True
    )
    # Change: Use SlugRelatedField for organization (for input) and show name (for output)
    organization = serializers.SerializerMethodField()
    organization_id = serializers.PrimaryKeyRelatedField(
        queryset=Organization.objects.all(),
        source='organization',
        write_only=True,
        required=False
    )

    created_by = serializers.SlugRelatedField(
        queryset=User.objects.all(),
        slug_field='username',
        required=True
    )

    class Meta:
        model = Scholarship
        fields = [
            "id",
            "organization",      # Output: organization name
            "organization_id",   # Input: organization id
            "name",
            "publication_date",
            "start_date",
            "end_date",
            "type",
            "type_ids",
            "image",
            "content",
            "interests",
            "interest_ids",
            "created_by",
            "country",
            "country_ids",
        ]
        read_only_fields = ["id", "publication_date"]

    def create(self, validated_data):
        type_data = validated_data.pop('type_ids', [])
        interests_data = validated_data.pop('interest_ids', [])
        country_data = validated_data.pop('country_ids', [])
        scholarship = Scholarship.objects.create(**validated_data)
        if type_data:
            scholarship.type.set(type_data)
        if interests_data:
            scholarship.interests.set(interests_data)
        if country_data:
            scholarship.country.set(country_data)
        return scholarship

    def get_organization(self, obj):
        return obj.organization.name if obj.organization else None

    def update(self, instance, validated_data):
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        return instance

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

        follow(request.user, organization, actor_only=False)

        return organization
        
class MembershipSerializer(serializers.ModelSerializer):
    organization = OrganizationSerializer(read_only=True) 
    user = UserSerializer(read_only=True)
    organization_id = serializers.PrimaryKeyRelatedField(
        queryset=Organization.objects.all(),
        source='organization',  
        write_only=True  
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

class ActivitySerializer(serializers.ModelSerializer):
    actor = serializers.SerializerMethodField()
    target = serializers.SerializerMethodField()
    action_object = serializers.SerializerMethodField()

    class Meta:
        model = Action # Es el modelo de los cosos que crea actstream
        fields = ['id', 'actor', 'action_object', 'target', 'verb', 'timestamp']
    
    def get_actor(self, obj):
        if obj.actor:
            return {
                'id': obj.actor.id,
                'type': obj.actor.__class__.__name__,
                'name':
                    obj.actor.username if hasattr(obj.actor, 'username') else
                    "Name Not Available due to actor type."
            }
        return None

    def get_target(self, obj):
        if obj.target:
            return {
                'id': obj.target.id,
                'type': obj.target.__class__.__name__,
                'name':
                    obj.target.username if obj.target.__class__.__name__ == "User" else 
                    obj.target.name if obj.target.__class__.__name__ == "Organization" else
                    obj.target.name if obj.target.__class__.__name__ == "Scholarship" else
                    "Name Not Available due to target type."
            }
        return None
    
    def get_action_object(self, obj):
        if obj.action_object:
            return {
                'id': obj.action_object.id,
                'type': obj.action_object.__class__.__name__,
                'name':
                    obj.action_object.content if obj.action_object.__class__.__name__ == "Comment" else
                    obj.action_object.name if obj.action_object.__class__.__name__ == "Organization" else
                    "Name Not Available due to action_object type."
            }
        return None

class UserDataSerializer(serializers.ModelSerializer):
    interests = InterestSerializer(many=True, read_only=True)
    memberships = MembershipSerializer(many=True, read_only=True)
    photo = serializers.ImageField(read_only=True)
    
    class Meta:
        model = UserData
        fields = [
            "id", 
            "interests", 
            "phone_number", 
            "birthday", 
            "user", 
            "memberships", 
            "photo",
            "bio"
        ]
        read_only_fields = ["user", "id"]
        extra_kwargs = {"user": {"read_only": True}}

class PublicUserProfileSerializer(serializers.ModelSerializer):
    student = UserDataSerializer(read_only=True)

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'student']

    def to_representation(self, instance):
        data = super().to_representation(instance)
        if data['student'] and data['student']['photo']:
            request = self.context.get('request')
            if request:
                data['student']['photo'] = request.build_absolute_uri(data['student']['photo'])
        return data

class CommentSerializer(serializers.ModelSerializer):
    user = serializers.SlugRelatedField(
        queryset=User.objects.all(),
        slug_field='username',
        required=True
    )

    scholarship = serializers.PrimaryKeyRelatedField(
        queryset=Scholarship.objects.all(),
        write_only=True,
        required=False
    )

    class Meta:
        model = Comment
        fields = ['id', 'scholarship', 'user', 'content', 'created_at']
        read_only_fields = ['id', 'created_at']

class SavedScholarshipSerializer(serializers.ModelSerializer):
    scholarship = ScholarshipSerializer(read_only=True)
    user = UserSerializer(read_only=True)

    class Meta:
        model = SavedScholarship
        fields = ['id', 'scholarship', 'user', 'created_at']
        read_only_fields = ['id', 'created_at']

    def create(self, validated_data):
        request = self.context.get('request')
        scholarship_data = validated_data.pop('scholarship', None)
        user_data = validated_data.pop('user', None)

        # Ensure scholarship and user are provided
        if not scholarship_data or not user_data:
            raise serializers.ValidationError("Scholarship and user must be provided.")

        # Create or get the scholarship instance
        scholarship, created = Scholarship.objects.get_or_create(**scholarship_data)

        # Create the saved scholarship entry
        saved_scholarship = SavedScholarship.objects.create(
            scholarship=scholarship,
            user=request.user,
            **validated_data
        )

        return saved_scholarship

    def update(self, instance, validated_data):
        instance.is_active = validated_data.get("is_active", instance.is_active)
        instance.save()
        return instance

class SavedScholarshipSerializer(serializers.ModelSerializer):
    scholarship_data = ScholarshipSerializer(source='scholarship', read_only=True)
    
    class Meta:
        model = SavedScholarship
        fields = ['id', 'user', 'scholarship', 'saved_date', 'scholarship_data']
        read_only_fields = ['id', 'saved_date']