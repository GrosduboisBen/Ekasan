"""
URL configuration for main project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from user_api.views import UserById, UserCreate, UserList,UserUpdate,UserDelete,Auth,Login,VerifyCredentialsView
from user_api.views import UserInformationCreate, UserInformationList,UserInformationUpdate,UserInformationDelete

from document_api.views import DocumentCreate, DocumentList,DocumentUpdate,DocumentDelete, DocumentById
from document_api.views import DocumentInformationCreate, DocumentInformationList,DocumentInformationUpdate,DocumentInformationDelete

from agent_api.views import AgentById, AgentCreate, AgentList,AgentUpdate,AgentDelete

from file_upload.views import upload_file_ai

from extension_api.views import ExtensionCreate, ExtensionList, ExtensionById, ExtensionUpdate, ExtensionDelete

from keyword_api.views import KeywordCreate, KeywordList, KeywordById, KeywordUpdate, KeywordDelete

from category_api.views import CategoryCreate, CategoryList, CategoryById, CategoryUpdate, CategoryDelete

from django.contrib import admin
from django.urls import path, include  # Ensure `include` is imported
import oauth2_provider.views as oauth2_views


urlpatterns = [
    path('admin/', admin.site.urls),
    # Auth
    path('auth', Auth.as_view()),
    path('login/', Login.as_view()),
    path('o/', include('oauth2_provider.urls', namespace='oauth2_provider')),
    path('https://www.example.com/oidc_callback',UserList.as_view()),
    path('verify-credentials/', VerifyCredentialsView.as_view(), name='verify-credentials'),

    # Users
    path('user/create/', UserCreate.as_view(), name='create-user'),
    path('user/list', UserList.as_view(), name='read-users'),
    path('user/<uuid:pk>', UserById.as_view(), name='read-user'),
    path('user/update/<uuid:pk>/', UserUpdate.as_view(), name='update-user'),
    path('user/delete/<uuid:pk>/', UserDelete.as_view(), name='delete-user'),
    ## Informations
    path('user/info/create/', UserInformationCreate.as_view(), name='create-user'),
    path('user/<user_id>/info/detail', UserInformationList.as_view()),
    path('user/info/update/<uuid:pk>/', UserInformationUpdate.as_view(), name='update-user'),
    path('user/info/delete/<uuid:pk>/', UserInformationDelete.as_view(), name='delete-user'),
    # Documents
    path('document/create/', DocumentCreate.as_view(),name='create-document'),
    path('document/list', DocumentList.as_view(),name='read-documents'),
    path('document/<uuid:pk>', DocumentById.as_view(),name='read-document'),
    path('document/update/<uuid:pk>/', DocumentUpdate.as_view(), name='update-document'),
    path('document/delete/<uuid:pk>/', DocumentDelete.as_view(), name='delete-document'),
    ## Informations
    path('document/info/create/', DocumentInformationCreate.as_view(), name='create-user'),
    path('document/<document_id>/info/detail', DocumentInformationList.as_view()),
    path('document/info/update/<uuid:pk>/', DocumentInformationUpdate.as_view(), name='update-user'),
    path('document/info/delete/<uuid:pk>/', DocumentInformationDelete.as_view(), name='delete-user'),
    # Agents
    path('agent/create/', AgentCreate.as_view(), name='create-agent'),
    path('agent/list', AgentList.as_view(), name="read-agents"),
    path('agent/<uuid:pk>', AgentById.as_view(), name="read-agent"),
    path('agent/update/<uuid:pk>/', AgentUpdate.as_view(), name='update-agent'),
    path('agent/delete/<uuid:pk>/', AgentDelete.as_view(), name='delete-agent'),
    # Upload
    path('upload_ai/',upload_file_ai,name="upload_ai"),
    # Extension
    path('extension/create/', ExtensionCreate.as_view(), name='create-extension'),
    path('extension/list', ExtensionList.as_view(), name="read-extensions"),
    path('extension/<uuid:pk>',ExtensionById.as_view(), name="read-extension"),
    path('extension/update/<uuid:pk>/', ExtensionUpdate.as_view(), name='update-extension'),
    path('extension/delete/<uuid:pk>/', ExtensionDelete.as_view(), name='delete-extension'),
    # Keyword
    path('keyword/create/', KeywordCreate.as_view(), name='create-keyword'),
    path('keyword/list', KeywordList.as_view(), name="read-keywords"),
    path('keyword/<uuid:pk>',KeywordById.as_view(), name="read-keyword"),
    path('keyword/update/<uuid:pk>/', KeywordUpdate.as_view(), name='update-keyword'),
    path('keyword/delete/<uuid:pk>/', KeywordDelete.as_view(), name='delete-keyword'),
    # Category
    path('category/create/', CategoryCreate.as_view(), name='create-category'),
    path('category/list', CategoryList.as_view(), name="read-categories"),
    path('category/<uuid:pk>',CategoryById.as_view(), name="read-category"),
    path('category/update/<uuid:pk>/', CategoryUpdate.as_view(), name='update-category'),
    path('category/delete/<uuid:pk>/', CategoryDelete.as_view(), name='delete-category'),
]
