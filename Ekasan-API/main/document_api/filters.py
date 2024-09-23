from django_filters import rest_framework as filters
from .models import Document

class DocumentFilter(filters.FilterSet):
    name = filters.CharFilter(field_name='name', lookup_expr='icontains')
    id = filters.CharFilter(field_name='id')
    vector_id = filters.CharFilter(field_name='vector_id')

    class Meta:
        model = Document
        fields = ['name', 'id','vector_id']