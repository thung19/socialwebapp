"""
URL configuration for backend project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from api.views import CreateUserView
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

# Define the URL patterns for the project. Takes the URL pattern, the view to be called, and an optional name for the URL.1
urlpatterns = [
    # Admin site URL
    path("admin/", admin.site.urls),
    # User registration endpoint. 
    path("api/user/register/", CreateUserView.as_view(), name="register"),
    # JWT authentication endpoints
    path("api/token/", TokenObtainPairView.as_view(), name="get_token"),
    # Token refresh endpoint
    path("api/token/refresh/", TokenRefreshView.as_view(), name="refresh"),
    # Include REST framework's authentication URLs
    path("api-auth/", include("rest_framework.urls")),
    # Include API app URLs
    path("api/", include("api.urls")),
]
