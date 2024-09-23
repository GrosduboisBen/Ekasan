from django.contrib import admin
from django.urls import path
from open_ai.views import *
from assistant_api.views import *

urlpatterns = [
    path('admin/', admin.site.urls),
    path('chat/', Connect.as_view()),
    path('upload_file/',upload_file_ai,name='upload'),
    path('get_all_vectors',get_all_vector_stores,name='get_all_vectors'),
    path('get_vector_files',get_all_vector_store_files,name='get_vector_files'),
    path('delete_all_files',delete_all_files,name='delete_all_files'),
    path('get_vector',get_vector_store_by_id,name='delete_all_files'),
    path('add_vector_store/',create_vector_store,name='delete_all_files'),
    path('add_assistant/',add_assistant,name='add_assistant'),
    path('get_assistant',get_assistant,name='get_assistant'),
    path('get_all_assistant',get_all_assistants,name='get_all_assistant'),
    path('get_vector_assistants',get_vector_assistants,name='get_vector_assistants'),
    path('delete_assistant',delete_assistant,name='delete_assistant'),
    path('ask_assistant/',ask_assistant,name='ask_assistant'),
    path('update_assistant/',edit_assistant,name='update_assistant'),
]
