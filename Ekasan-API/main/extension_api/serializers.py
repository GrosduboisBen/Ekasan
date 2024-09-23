from rest_framework import serializers
from .models import Extension

class ExtensionSerializer (serializers.ModelSerializer):
    class Meta:
        model = Extension
        fields = '__all__'