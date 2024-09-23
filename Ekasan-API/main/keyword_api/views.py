from django.shortcuts import render
from .models import Keyword
from oauth2_provider.contrib.rest_framework import TokenHasReadWriteScope, TokenHasScope
from .serializers import KeywordSerializer
from rest_framework import viewsets,generics, permissions
from rest_framework.permissions import BasePermission
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from oauth2_provider.views.generic import ProtectedResourceView
from django.http import HttpResponse, HttpRequest

# Create your views here.
class KeywordCreate(generics.CreateAPIView):
    # API endpoint that allows creation of a new customer
    permission_classes = [TokenHasReadWriteScope]
    queryset = Keyword.objects.all(),
    serializer_class = KeywordSerializer

class KeywordList(generics.ListAPIView):
    # API endpoint that allows Keyword to be viewed.
    permission_classes = [TokenHasReadWriteScope]
    queryset = Keyword.objects.all()
    serializer_class = KeywordSerializer

class KeywordById(ProtectedResourceView, APIView):
    def get(self, request, *args, **kwargs):
        try:
            keyword = Keyword.objects.get(pk=self.kwargs['pk'])
            serializer = KeywordSerializer(keyword)
            return Response(serializer.data)
        except Keyword.DoesNotExist:
            return Response({"error": "Keyword not found"}, status=status.HTTP_404_NOT_FOUND)
        # queryset = Keyword.objects.get(pk=self.kwargs['pk'])
        # return HttpResponse(queryset)

class KeywordUpdate(generics.RetrieveUpdateAPIView):
    # API endpoint that allows a Keyword record to be updated.
    queryset = Keyword.objects.all()
    serializer_class = KeywordSerializer

class KeywordDelete(generics.RetrieveDestroyAPIView):
    # API endpoint that allows a Keyword record to be deleted.
    queryset = Keyword.objects.all()
    serializer_class = KeywordSerializer

