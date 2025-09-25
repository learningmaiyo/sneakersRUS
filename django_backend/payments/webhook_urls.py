from django.urls import path
from django.views.decorators.csrf import csrf_exempt
from . import views

urlpatterns = [
    path('stripe/', csrf_exempt(views.stripe_webhook), name='stripe_webhook'),
]