from django.urls import path
from auth_app.views import RegisterAPI, LoginAPI
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from auth_app.views import userInfoView

urlpatterns = [
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh', TokenRefreshView.as_view(), name='token_refresh'),
    path('register/', RegisterAPI.as_view(), name='register'),
    path('login/', LoginAPI.as_view(), name='login'),
    path('user_info/', userInfoView.as_view(), name='user_info')
]