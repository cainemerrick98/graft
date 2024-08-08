from rest_framework import generics, mixins, permissions, status
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from auth_app.serializers import RegisterSerializer, UserSerializer
from django.contrib.auth import authenticate, login
from django.contrib.auth.models import User


# Create your views here.
class RegisterAPI(generics.CreateAPIView):
    serializer_class = RegisterSerializer
    queryset = User.objects.all()
    permission_classes = [permissions.AllowAny]


class LoginAPI(generics.GenericAPIView):
    permission_classes = [permissions.AllowAny]
    
    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')
        user = authenticate(username=username, password=password)
        if user is not None:
            refresh = RefreshToken.for_user(user)
            return Response({
                'refresh':str(refresh),
                'access':str(refresh.access_token),
            },status=200)
        return Response(status=401, data={'msg':'invalid credentials'})
        

class verifyTokenView(generics.GenericAPIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        return Response(status=200)


class userInfoView(mixins.RetrieveModelMixin, generics.GenericAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = UserSerializer
    queryset = User.objects.all()

    def get_object(self):
        return self.request.user

    def get(self, request, *args, **kwargs):
        return self.retrieve(request, *args, **kwargs)
