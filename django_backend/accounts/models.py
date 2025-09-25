import uuid
from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    """Custom User model with UUID primary key"""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    email = models.EmailField(unique=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']
    
    class Meta:
        db_table = 'auth_user'
        

class UserRole(models.TextChoices):
    """User role choices"""
    CUSTOMER = 'customer', 'Customer'
    ADMIN = 'admin', 'Admin'
    SUPER_ADMIN = 'super_admin', 'Super Admin'


class Profile(models.Model):
    """User profile with additional information"""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    first_name = models.CharField(max_length=100, blank=True)
    last_name = models.CharField(max_length=100, blank=True)
    display_name = models.CharField(max_length=200, blank=True)
    avatar_url = models.URLField(blank=True)
    bio = models.TextField(blank=True)
    country = models.CharField(max_length=100, blank=True)
    date_of_birth = models.DateField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'profiles'
    
    def __str__(self):
        return f"{self.display_name or self.user.username}'s Profile"


class UserRoleAssignment(models.Model):
    """User role assignments"""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='role_assignments')
    role = models.CharField(max_choices=UserRole.choices, default=UserRole.CUSTOMER)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'user_roles'
        unique_together = ['user', 'role']
    
    def __str__(self):
        return f"{self.user.email} - {self.role}"


# Signal to create profile automatically
from django.db.models.signals import post_save
from django.dispatch import receiver

@receiver(post_save, sender=User)
def create_user_profile(sender, instance, created, **kwargs):
    """Create profile and assign customer role when user is created"""
    if created:
        Profile.objects.create(
            user=instance,
            first_name=instance.first_name,
            last_name=instance.last_name,
            display_name=f"{instance.first_name} {instance.last_name}".strip()
        )
        UserRoleAssignment.objects.create(
            user=instance,
            role=UserRole.CUSTOMER
        )