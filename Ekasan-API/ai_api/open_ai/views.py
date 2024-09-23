from django.shortcuts import render
from rest_framework import viewsets,generics, permissions
from rest_framework.permissions import BasePermission
from rest_framework.views import APIView
from .models import BaseUser
from .serializers import UserSerializer
from oauth2_provider.views.generic import ProtectedResourceView
from django.http import HttpResponse
from oauth2_provider.contrib.rest_framework import TokenHasReadWriteScope
from rest_framework.response import Response
from openai import OpenAI
from decouple import  Config, RepositoryEnv
import os
import time
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse

from ai_api.utils import *
 

env_file_path = 'volume/.env'

env_config = Config(RepositoryEnv(env_file_path))
# Create your views here.

client = OpenAI(api_key=env_config('OPENAI_API_KEY'))

@csrf_exempt
def delete_all_files(request):
    list = []
    file_list = retrieve_all_files()
    for file in file_list:
        delete_file(file.id)
    emptied = retrieve_all_files()
    for file in emptied:
        list.append(file.model_dump())
    return JsonResponse(list,safe=False)

@csrf_exempt
def get_all_vector_stores(request):
    list = []
    vector_list = get_vector_store_list().data
    for vector in vector_list:
        list.append(vector.model_dump())
    
    return JsonResponse(list,safe=False)

@csrf_exempt
def get_vector_store_by_id(request):
    data = request.GET.dict()
    response = get_store_by_id(id=data.get('store_id'))
    return JsonResponse(response.model_dump(),safe=False)

@csrf_exempt
def create_vector_store(request):
    data = request.POST.dict()
    response = create_store(store_name=data.get('name'))
    
    return JsonResponse(response.model_dump(),safe=False)

@csrf_exempt
def get_all_vector_store_files(request):
    list = []
    data = request.GET.dict()
    vector_store_id = data.get('store_id')

    files = get_vector_store_files(vector_store_id=vector_store_id)
    for file in files:
        list.append(retrieve_file_info(file.id).model_dump())
    return JsonResponse(list,safe=False)

# Upload file to OpenAI API Vector Store.
@csrf_exempt
def upload_file_ai(request):
    # TODO Add security on already implemented files ( by name and id).
    # Files and bodys request's raw data. 
    data = request.POST.dict()
    files = request.FILES.getlist('file')
    
    # Fetching file ID from request body.
    vector_store_id = data.get('store_id')
    # TODO Should be in different class !
    response = get_vector_store_files(vector_store_id=vector_store_id)
    # Add all files to the store
    for uploaded_file in files:
        # Check file extension
        # TODO We'll need to provide a translated list of available file extensions.
        file_name, file_extension = os.path.splitext(uploaded_file.name)
        if not file_extension:
            # Ajoutez l'extension .pdf si le mimetype est application/pdf
            if uploaded_file.content_type == 'application/pdf':
                uploaded_file.name = file_name + '.pdf'
            else:
                return JsonResponse({"error": "Unsupported file type"}, status=400)

        file = create_file(uploaded_file=uploaded_file)
        file_id = file.id
        client.beta.vector_stores.files.create_and_poll(file_id=file_id,vector_store_id=vector_store_id)
        return JsonResponse(client.files.retrieve(file.id).model_dump())

class Connect(APIView):
    def post(self, request):
        user_content = request.POST.get("content","From the files you know, give me a synthesis of the content of those documents.")
        # assistant =  client.beta.assistants.retrieve("asst_ZC1LHjiERbzCFF337zYXkkOf")
        test_store()
        data = request.data.dict()
        store_id = data.get('store_id')
        test_store()

        assistant = client.beta.assistants.create(
            name="Handle files",
            model="gpt-4-1106-preview",
            instructions="You are an assistant who can retrieve some file from a user input.When you find one or many file, provide the file id at the end of the answer.",
            tools=[{"type": "file_search"}],
            tool_resources={
                "file_search": {
                    "vector_store_ids": [store_id]
                }
            }
        )

        # thread = client.beta.threads.retrieve("thread_YfcPblTdtxN29lQ3CAfUXLVa")
        thread = client.beta.threads.create()

        message = client.beta.threads.messages.create(
            thread_id=thread.id,
            role="user",
            content=user_content
        )

        run = client.beta.threads.runs.create(
            thread_id=thread.id,
            assistant_id=assistant.id,
            instructions="You are an assistant who can retrieve some file from a user input.When you find one or many file, provide the file id at the end of the answer."
        )

        run = client.beta.threads.runs.retrieve(
            thread_id=thread.id,
            run_id=run.id
        )

        while True:
            run = client.beta.threads.runs.retrieve(thread_id=thread.id, run_id=run.id)
            if run.completed_at is not None:
                break
            print('Waiting')
            time.sleep(1)

        messages = client.beta.threads.messages.list(
            thread_id=thread.id
        )
        print('messages',messages.data)
        print((messages.data[0].content[0].text.value))

        # completion = client.chat.completions.create(
        #     model="gpt-3.5-turbo-1106",
        #     messages=[
        #         {"role": "system", "content": "You are an assistant who can retrieve some file from a user input"},
        #         {"role": "user", "content": "From the files you know, can you find me one which is talking about agile methodology ?"}
        #     ],
        # )
        client.beta.threads.delete(thread.id)
        return(Response(messages.data[0].content[0].text.value))

# Create assistant 


# Base classes.
class UserById(ProtectedResourceView):
    def get(self, request, *args, **kwargs):
        queryset = BaseUser.objects.filter(pk=self.kwargs['pk'])
        return HttpResponse(queryset)
class UserCreate(generics.CreateAPIView):
    # API endpoint that allows creation of a new user
    permission_classes = [permissions.AllowAny]
    queryset = BaseUser.objects.all()
    serializer_class = UserSerializer

class UserList(generics.ListCreateAPIView):
    # API endpoint that allows User to be viewed.
    permission_classes = [TokenHasReadWriteScope]
    # required_scopes = ['read']
    queryset = BaseUser.objects.all()
    serializer_class = UserSerializer

