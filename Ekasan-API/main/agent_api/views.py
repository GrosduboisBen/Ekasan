from django.shortcuts import render
from rest_framework import viewsets,generics, permissions
from rest_framework.permissions import BasePermission
from rest_framework.views import APIView
from rest_framework.decorators import authentication_classes, permission_classes, action
from .models import Agent
from oauth2_provider.views.generic import ProtectedResourceView
from django.http import HttpResponse, HttpRequest, JsonResponse
from oauth2_provider.contrib.rest_framework import TokenHasReadWriteScope, TokenHasScope
from .serializers import AgentSerializer
from rest_framework.response import Response
from rest_framework import status



class AgentById(ProtectedResourceView, APIView):
    def get(self, request, *args, **kwargs):
        try:
            agent = Agent.objects.get(pk=self.kwargs['pk'])
            serializer = AgentSerializer(agent)
            return Response(serializer.data)
        except Agent.DoesNotExist:
            return Response({"error": "Agent not found"}, status=status.HTTP_404_NOT_FOUND)
        # queryset = Agent.objects.get(pk=self.kwargs['pk'])
        # return HttpResponse(queryset)
        
class AgentCreate(generics.CreateAPIView):
    # API endpoint that allows creation of a new Agent
    permission_classes = [TokenHasReadWriteScope]
    queryset = Agent.objects.all()
    serializer_class = AgentSerializer

class AgentList(generics.ListCreateAPIView):
    # API endpoint that allows Agent to be viewed.
    permission_classes = [TokenHasReadWriteScope]
    # required_scopes = ['read']
    queryset = Agent.objects.all()
    serializer_class = AgentSerializer

class AgentUpdate(generics.UpdateAPIView):
    queryset = Agent.objects.all()
    serializer_class = AgentSerializer

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        return Response(serializer.data)
    
class AgentDelete(generics.RetrieveDestroyAPIView):
    # API endpoint that allows a Agent record to be deleted.
    permission_classes = [TokenHasReadWriteScope]
    queryset = Agent.objects.all()
    serializer_class = AgentSerializer
class AgentViewSet(viewsets.ModelViewSet):
    serializer_class = AgentSerializer
    queryset = Agent.objects.all()