from django.shortcuts import render
from .models import Extension
from oauth2_provider.contrib.rest_framework import TokenHasReadWriteScope, TokenHasScope
from .serializers import ExtensionSerializer
from rest_framework import viewsets,generics, permissions
from rest_framework.permissions import BasePermission
from rest_framework.views import APIView
from oauth2_provider.views.generic import ProtectedResourceView
from django.http import HttpResponse, HttpRequest
from rest_framework.response import Response
from rest_framework import status

# Create your views here.
class ExtensionCreate(generics.CreateAPIView):
    # API endpoint that allows creation of a new customer
    permission_classes = [TokenHasReadWriteScope]
    queryset = Extension.objects.all(),
    serializer_class = ExtensionSerializer

class ExtensionList(generics.ListAPIView):
    # API endpoint that allows Extension to be viewed.
    permission_classes = [TokenHasReadWriteScope]
    queryset = Extension.objects.all()
    serializer_class = ExtensionSerializer

class ExtensionById(ProtectedResourceView, APIView):
    def get(self, request, *args, **kwargs):
        try:
            extension = Extension.objects.get(pk=self.kwargs['pk'])
            serializer = ExtensionSerializer(extension)
            return Response(serializer.data)
        except Extension.DoesNotExist:
            return Response({"error": "Agent not found"}, status=status.HTTP_404_NOT_FOUND)
        # queryset = Agent.objects.get(pk=self.kwargs['pk'])
        # return HttpResponse(queryset)
      
class ExtensionUpdate(generics.RetrieveUpdateAPIView):
    # API endpoint that allows a Extension record to be updated.
    queryset = Extension.objects.all()
    serializer_class = ExtensionSerializer

class ExtensionDelete(generics.RetrieveDestroyAPIView):
    # API endpoint that allows a Extension record to be deleted.
    queryset = Extension.objects.all()
    serializer_class = ExtensionSerializer

