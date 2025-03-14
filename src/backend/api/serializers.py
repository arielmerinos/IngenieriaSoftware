from django.contrib.auth.models import User
from rest_framework import serializers
from .models.scholarship import Scholarship
from .models.student import Student
from .models.organization import Organization
from .models.organization import Membership
from .models.category import Category

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
        fields = ["id", "organization", "name", "publication_date", "start_date", "end_date", "type", "image", "content", "categories","created_by"]
        read_only_fields = ["publication_date"]
        extra_kwargs = {"organization": {"read_only": True}}
        

class StudentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Student
        fields = ["id", "search", "interests", "phone_number", "birthday", "user"]
        extra_kwargs = {"user": {"read_only": True}}
        
        
class OrganizationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Organization
        fields = ["id", "name", "email", "phone_number", "website", "logo", "members"]
        
    def get_members(self, obj):
        memberships = Membership.objects.filter(organization=obj)
        students = [membership.student for membership in memberships]
        return StudentSerializer(students, many=True).dat

    # Falta hacer un funcion para que los estudiantes puedan unirse a una organizacion, usar signals
    def add_member(self, organization, student):
        Membership.objects.create(organization=organization, student=student)

    # Lo mismo pero para remover
    def remove_member(self, organization, student):
        Membership.objects.filter(organization=organization, student=student).delete()
        
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
    