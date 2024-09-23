from django.contrib import admin
from .models import Extension

class ExtensionAdmin(admin.ModelAdmin):
    pass

admin.site.register(Extension, ExtensionAdmin)