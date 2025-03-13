from django.contrib.auth.models import User
from rest_framework import serializers
from .models.scholarship import Scholarship

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
        fields = ["id", "organization", "name", "publication_date", "start_date", "end_date", "type", "image", "content", "categories"]
        read_only_fields = ["publication_date", "created_at"]
        extra_kwargs = {"organization": {"read_only": True}}