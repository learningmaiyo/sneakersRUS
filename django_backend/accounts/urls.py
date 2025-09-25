from django.urls import path
from . import views

urlpatterns = [
    path('register/', views.register_view, name='register'),
    path('login/', views.login_view, name='login'),
    path('roles/', views.user_roles_view, name='user_roles'),
    path('roles/assign/', views.assign_role_view, name='assign_role'),
]