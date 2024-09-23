from rest_framework import serializers
from .models import Document,DocumentInformation
class DocumentSerializer (serializers.ModelSerializer):
    class Meta:
        model = Document
        fields = ['id','type','name','user_id','category','file_id','vector_id']
class DocumentInformationSerializer (serializers.ModelSerializer):
    class Meta:
        model = DocumentInformation
        fields = ['id','document_id','url','delivered']