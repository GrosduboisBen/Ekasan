from django.shortcuts import render
from .models import Document,DocumentInformation
from oauth2_provider.contrib.rest_framework import TokenHasReadWriteScope, TokenHasScope
from .serializers import DocumentSerializer,DocumentInformationSerializer
from rest_framework import viewsets,generics, permissions
from rest_framework.permissions import BasePermission
from rest_framework.views import APIView
from oauth2_provider.views.generic import ProtectedResourceView
from django.http import HttpResponse, HttpRequest
from rest_framework.response import Response
from rest_framework import status
from django_filters import rest_framework as filters
from django_filters.rest_framework import DjangoFilterBackend
from .filters import DocumentFilter


# Create your views here.
class DocumentCreate(generics.CreateAPIView):
    # API endpoint that allows creation of a new customer
    permission_classes = [TokenHasReadWriteScope]
    queryset = Document.objects.all(),
    serializer_class = DocumentSerializer

class DocumentList(generics.ListAPIView):
    queryset = Document.objects.all()
    serializer_class = DocumentSerializer
    permission_classes = [TokenHasReadWriteScope]
    filter_backends = [DjangoFilterBackend]
    filterset_class = DocumentFilter

    def get_queryset(self):
        queryset = super().get_queryset()
        # Le filtrage est maintenant géré par le filterset_class
        return queryset
# class DocumentList(generics.ListAPIView):
#     # API endpoint that allows Document to be viewed.
#     permission_classes = [TokenHasReadWriteScope]
#     queryset = Document.objects.all()
#     serializer_class = DocumentSerializer
#     filter_backends = [DjangoFilterBackend]
#     filterset_class = DocumentFilter

class DocumentById(ProtectedResourceView, APIView):
    def get(self, request, *args, **kwargs):
        try:
            document = Document.objects.get(pk=self.kwargs['pk'])
            serializer = DocumentSerializer(document)
            return Response(serializer.data)
        except Document.DoesNotExist:
            return Response({"error": "Document not found"}, status=status.HTTP_404_NOT_FOUND)
# class DocumentById(ProtectedResourceView, APIView):
#     name = filters.CharFilter(field_name='name', lookup_expr='icontains')
#     id = filters.CharFilter(field_name='id')
#     class Meta:
#         model = Document
#         fields = ['name', 'id']

        
class DocumentViewSet(viewsets.ModelViewSet):
    serializer_class = DocumentSerializer
    queryset = Document.objects.all()

class DocumentUpdate(generics.UpdateAPIView):
    queryset = Document.objects.all()
    serializer_class = DocumentSerializer

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        return Response(serializer.data)

class DocumentDelete(generics.RetrieveDestroyAPIView):
    # API endpoint that allows a Document record to be deleted.
    queryset = Document.objects.all()
    serializer_class = DocumentSerializer

# ---------- Document Informations------------

class DocumentInformationCreate(generics.CreateAPIView):
    permission_classes = [TokenHasReadWriteScope]
    queryset = DocumentInformation.objects.all()
    serializer_class = DocumentInformationSerializer

class DocumentInformationList(ProtectedResourceView):
    permission_classes = [TokenHasReadWriteScope]
    serializer_class = DocumentInformationSerializer
    def get(self, request, *args, **kwargs):
        queryset = DocumentInformation.objects.filter(document_id=self.kwargs['document_id']).values()
        return HttpResponse(queryset)

class DocumentInformationUpdate(generics.RetrieveUpdateAPIView):
    permission_classes = [TokenHasReadWriteScope]
    queryset = DocumentInformation.objects.all()
    serializer_class = DocumentInformationSerializer
class DocumentInformationDelete(generics.RetrieveDestroyAPIView):
    permission_classes = [TokenHasReadWriteScope]
    queryset = DocumentInformation.objects.all()
    serializer_class = DocumentInformationSerializer

class DocumentInformationViewSet(viewsets.ModelViewSet):
    serializer_class = DocumentInformationSerializer
    queryset = DocumentInformation.objects.all()
# Create your views here.
