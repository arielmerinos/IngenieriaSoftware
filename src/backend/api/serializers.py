from rest_framework import serializers
from api import models as customModels
from django.contrib.auth import authenticate

class UserSerializer(serializers.ModelSerializer):

    class Meta:
        model = customModels.User
        
        fields = [
            'correo',
            'primerNombre',
            'segundoNombre',
            'primerApellido',
            'segundoApellido',
            'telefono',
            'fechaNac'
        ]

        read_only_fields = ('correo')

class UserRegisterSerializer(serializers.ModelSerializer):
    contrasena = serializers.CharField(write_only=True)
    class Meta:
        model = customModels.User
        fields = [
            'correo',
            'contrasena',
            'primerNombre',
            'segundoNombre',
            'primerApellido',
            'segundoApellido',
            'telefono',
            'fechaNac',
        ]

    def validate(self, attrs):
        # Aqui van las validaciones de los fields
        return attrs

    def create(self, validated_data):
        # Al llamar a create se ejecutan las validaciones, por eso validate regresa su entrada
        return customModels.User.objects._create_user(**validated_data)
    
class UserLoginSerializer(serializers.ModelSerializer):
    correo = serializers.CharField()
    contrasena = serializers.CharField(write_only=True)

    def validate(self,data):
        user = authenticate(**data)
        if user and user.is_active:
            return user
        raise serializers.ValidationError('Credenciales incorrectas')