from django.contrib import admin
from .models import Keyword

class KeywordAdmin(admin.ModelAdmin):
    pass

admin.site.register(Keyword, KeywordAdmin)