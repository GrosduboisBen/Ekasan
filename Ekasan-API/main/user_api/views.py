from django.shortcuts import render
from rest_framework import viewsets,generics, permissions
from rest_framework.permissions import BasePermission
from rest_framework.views import APIView
# from rest_framework.decorators import authentication_classes, permission_classes, action
from .models import BaseUser,BaseUserInformation
from .serializers import UserSerializer,UserInformationSerializer
from oauth2_provider.views.generic import ProtectedResourceView
from django.http import HttpResponse
from oauth2_provider.contrib.rest_framework import TokenHasReadWriteScope
from rest_framework.response import Response
from .helpers.check_env import get_creds
import requests
from urllib.parse import urlencode
from .helpers.check_env import hash_key
from rest_framework import status
from django.http import Http404
from rest_framework.generics import RetrieveAPIView

# ---------- Auth------------
class Auth(APIView):
    def get(self, request):
        return Response(get_creds())

class Login(APIView):
    def post(self, request):
        host = request.get_host()
        response=requests.post(f'http://{host}/o/token/',data=request.data)
        if response.status_code == 200:
            return(Response(response.json()))
        else:
            return(Response({'error': 'Échec de l\'authentification'}, status=response.status_code))
class VerifyCredentialsView(APIView):
    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')
        
        if not username or not password:
            return Response({'error': 'Username and password are required'}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            user = BaseUser.objects.get(username=username)
        except BaseUser.DoesNotExist:
            return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)
        
        hashed_password = hash_key(password)
        
        if user.password == hashed_password:
            user_data = UserSerializer(user).data
            return Response({'success': 'Credentials are valid','user':user_data}, status=status.HTTP_200_OK)
        else:
            return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)

# ---------- Users------------
class UserById(RetrieveAPIView):
    queryset = BaseUser.objects.all()
    serializer_class = UserSerializer
    lookup_field = 'pk' 
class UserCreate(generics.CreateAPIView):
    # API endpoint that allows creation of a new user
    permission_classes = [permissions.AllowAny]
    queryset = BaseUser.objects.all()
    serializer_class = UserSerializer

class UserList(generics.ListCreateAPIView):
    # API endpoint that allows User to be viewed.
    permission_classes = [TokenHasReadWriteScope]
    # required_scopes = ['read']
    queryset = BaseUser.objects.all()
    serializer_class = UserSerializer

class UserUpdate(generics.RetrieveUpdateAPIView):
    # API endpoint that allows a User record to be updated.
    permission_classes = [TokenHasReadWriteScope]
    queryset = BaseUser.objects.all()
    serializer_class = UserSerializer
class UserDelete(generics.RetrieveDestroyAPIView):
    # API endpoint that allows a User record to be deleted.
    permission_classes = [TokenHasReadWriteScope]
    queryset = BaseUser.objects.all()
    serializer_class = UserSerializer
class UserViewSet(viewsets.ModelViewSet):
    serializer_class = UserSerializer
    queryset = BaseUser.objects.all()

# ---------- Users Informations------------

class UserInformationCreate(generics.CreateAPIView):
    permission_classes = [TokenHasReadWriteScope]
    queryset = BaseUserInformation.objects.all()
    serializer_class = UserInformationSerializer
class UserInformationList(ProtectedResourceView):
    permission_classes = [TokenHasReadWriteScope]
    serializer_class = UserInformationSerializer
    def get(self, request, *args, **kwargs):
        queryset = BaseUserInformation.objects.filter(user_id=self.kwargs['user_id']).values()
        return HttpResponse(queryset)

class UserInformationUpdate(generics.RetrieveUpdateAPIView):
    permission_classes = [TokenHasReadWriteScope]
    queryset = BaseUserInformation.objects.all()
    serializer_class = UserInformationSerializer
class UserInformationDelete(generics.RetrieveDestroyAPIView):
    permission_classes = [TokenHasReadWriteScope]
    queryset = BaseUserInformation.objects.all()
    serializer_class = UserInformationSerializer

class UserInformationViewSet(viewsets.ModelViewSet):
    serializer_class = UserInformationSerializer
    queryset = BaseUserInformation.objects.all()
# Create your views here.
