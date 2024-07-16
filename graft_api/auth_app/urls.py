from django.urls import path
from auth_app.views import RegisterAPI, LoginAPI


urlpatterns = [
    path('register/', RegisterAPI.as_view(), name='register'),
    path('login/', LoginAPI.as_view(), name='login')
]