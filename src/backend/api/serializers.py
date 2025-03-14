from django.contrib.auth.models import User
from rest_framework import serializers
from .models.scholarship import Scholarship
from .models.user_data import UserData
from .models.organization import Organization
from .models.organization import Membership
from .models.category import Category
from .models.type import Type
from .models.country import Country

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "username", "password"]
        extra_kwargs = {"password": {"write_only": True}}

    def create(self, validated_data):
        print(validated_data)
        user = User.objects.create_user(**validated_data)
        return user
    
class ScholarshipSerializer(serializers.ModelSerializer):
    class Meta:
        model = Scholarship
        fields = ["id", "organization", "name", "publication_date", "start_date", "end_date", "type", "image", "content", "categories","created_by","country"]
        read_only_fields = ["publication_date", "created_by","id","organization"]
        extra_kwargs = {"organization": {"read_only": True}}
        

class UserDataSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserData
        fields = ["id", "history_search", "interests", "phone_number", "birthday", "user", "memberships", "history_search"]
        read_only_fields = ["user", "id"]
        extra_kwargs = {"user": {"read_only": True}}
        
        
class OrganizationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Organization
        fields = ["id", "name", "email", "phone_number", "website", "logo", "members"]
        
        
class MembershipSerializer(serializers.ModelSerializer):
    class Meta:
        model = Membership
        fields = ["id", "student", "organization", "is_admin"]
    
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
    