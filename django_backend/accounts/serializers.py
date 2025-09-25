from rest_framework import serializers
from django.contrib.auth.password_validation import validate_password
from django.contrib.auth import authenticate
from .models import User, Profile, UserRoleAssignment


class UserRegistrationSerializer(serializers.ModelSerializer):
    """Serializer for user registration"""
    password = serializers.CharField(write_only=True, validators=[validate_password])
    password_confirm = serializers.CharField(write_only=True)
    
    class Meta:
        model = User
        fields = ['email', 'username', 'first_name', 'last_name', 'password', 'password_confirm']
    
    def validate(self, attrs):
        if attrs['password'] != attrs['password_confirm']:
            raise serializers.ValidationError("Password confirmation doesn't match password.")
        return attrs
    
    def create(self, validated_data):
        validated_data.pop('password_confirm')
        user = User.objects.create_user(**validated_data)
        return user


class ProfileSerializer(serializers.ModelSerializer):
    """Serializer for user profile"""
    user_email = serializers.CharField(source='user.email', read_only=True)
    
    class Meta:
        model = Profile
        fields = [
            'id', 'user_email', 'first_name', 'last_name', 'display_name',
            'avatar_url', 'bio', 'country', 'date_of_birth', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'user_email', 'created_at', 'updated_at']


class UserRoleSerializer(serializers.ModelSerializer):
    """Serializer for user roles"""
    user_email = serializers.CharField(source='user.email', read_only=True)
    
    class Meta:
        model = UserRoleAssignment
        fields = ['id', 'user_email', 'role', 'created_at']
        read_only_fields = ['id', 'user_email', 'created_at']


class UserSerializer(serializers.ModelSerializer):
    """Serializer for user details"""
    profile = ProfileSerializer(read_only=True)
    roles = serializers.SerializerMethodField()
    
    class Meta:
        model = User
        fields = ['id', 'email', 'username', 'first_name', 'last_name', 'profile', 'roles', 'date_joined']
        read_only_fields = ['id', 'date_joined']
    
    def get_roles(self, obj):
        return [assignment.role for assignment in obj.role_assignments.all()]


class ChangePasswordSerializer(serializers.Serializer):
    """Serializer for changing password"""
    old_password = serializers.CharField(required=True)
    new_password = serializers.CharField(required=True, validators=[validate_password])
    new_password_confirm = serializers.CharField(required=True)
    
    def validate(self, attrs):
        if attrs['new_password'] != attrs['new_password_confirm']:
            raise serializers.ValidationError("New password confirmation doesn't match.")
        return attrs
    
    def validate_old_password(self, value):
        user = self.context['request'].user
        if not user.check_password(value):
            raise serializers.ValidationError("Old password is incorrect.")
        return value