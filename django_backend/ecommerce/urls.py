"""
URL configuration for ecommerce project.
"""
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

# Import viewsets
from products.views import ProductViewSet
from cart.views import CartViewSet
from orders.views import OrderViewSet
from accounts.views import ProfileViewSet

# Create router and register viewsets
router = DefaultRouter()
router.register(r'products', ProductViewSet)
router.register(r'cart', CartViewSet, basename='cart')
router.register(r'orders', OrderViewSet, basename='orders')
router.register(r'profiles', ProfileViewSet, basename='profiles')

urlpatterns = [
    # Admin
    path('admin/', admin.site.urls),
    
    # API Authentication
    path('api/auth/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/auth/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/auth/', include('accounts.urls')),
    
    # API Endpoints
    path('api/v1/', include(router.urls)),
    
    # Payment endpoints
    path('api/payments/', include('payments.urls')),
    
    # Stripe webhooks
    path('webhooks/', include('payments.webhook_urls')),
]

# Serve media files in development
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

# Custom admin site headers
admin.site.site_header = "Sneaker Store Admin"
admin.site.site_title = "Sneaker Store Admin Portal"
admin.site.index_title = "Welcome to Sneaker Store Administration"