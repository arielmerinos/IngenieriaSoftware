from django.contrib.auth.models import User
from rest_framework import serializers
from .models.scholarship import Scholarship
from .models.student import Student

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