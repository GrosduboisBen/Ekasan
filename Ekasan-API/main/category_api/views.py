from django.shortcuts import render
from .models import Category
from oauth2_provider.contrib.rest_framework import TokenHasReadWriteScope, TokenHasScope
from .serializers import CategorySerializer
from rest_framework import viewsets,generics, permissions
from rest_framework.permissions import BasePermission
from rest_framework.views import APIView
from oauth2_provider.views.generic import ProtectedResourceView
from django.http import HttpResponse, HttpRequest
from rest_framework.response import Response


# Create your views here.
class CategoryCreate(generics.CreateAPIView):
    # API endpoint that allows creation of a new category
    permission_classes = [TokenHasReadWriteScope]
    queryset = Category.objects.all(),
    serializer_class = CategorySerializer

class CategoryList(generics.ListAPIView):
    # API endpoint that allows Category to be viewed.
    permission_classes = [TokenHasReadWriteScope]
    queryset = Category.objects.all()
    serializer_class = CategorySerializer

class CategoryById(ProtectedResourceView, APIView):
    def get(self, request, *args, **kwargs):
        try:
            keyword = Category.objects.get(pk=self.kwargs['pk'])
            serializer = CategorySerializer(keyword)
            return Response(serializer.data)
        except Category.DoesNotExist:
            return Response({"error": "Category not found"}, status=status.HTTP_404_NOT_FOUND)
        # queryset = Category.objects.get(pk=self.kwargs['pk'])
        # return HttpResponse(queryset)


class CategoryUpdate(generics.UpdateAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        return Response(serializer.data)
    
class CategoryDelete(generics.RetrieveDestroyAPIView):
    # API endpoint that allows a Category record to be deleted.
    queryset = Category.objects.all()
    serializer_class = CategorySerializer

