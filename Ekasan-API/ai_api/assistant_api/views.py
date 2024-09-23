from django.shortcuts import render
from decouple import  Config, RepositoryEnv
from openai import OpenAI
from ai_api.utils import *
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
from rest_framework.response import Response
from ai_api.settings import BASE_DIR
# Create your views here.
import json

env_file_path = 'volume/.env'
env_config = Config(RepositoryEnv(env_file_path))
# Create your views here.

client = OpenAI(api_key=env_config('OPENAI_API_KEY'))


@csrf_exempt
def get_all_assistants(request):
    list = []
    assistant_list = get_assistant_list()
    for assistant in assistant_list:
        list.append(assistant.model_dump())
    
    return JsonResponse(list,safe=False)

@csrf_exempt
def get_assistant(request):
    data = request.GET.dict()
    response = get_assistant_by_id(assistant_id=data.get('assistant_id'))
    return JsonResponse(response.model_dump(),safe=False)

@csrf_exempt
def edit_assistant(request):
    data = request.POST.dict()
    assistant_id = data.get('assistant_id')
    name = data.get('name') 
    description = data.get('description')
    instructions = data.get('instructions')
    vector_id = data.get('vector_id') 
    response = update_assistant(
        assistant_id=assistant_id,
        name=name,
        description=description,
        instructions = instructions,
        vector_id=vector_id,
        )

    return JsonResponse(response.model_dump(),safe=False)

@csrf_exempt
def get_vector_assistants(request):
    list = []
    data = request.GET.dict()
    vector_id = data.get('vector_id')
    assistant_list = get_assistant_list()
    for assistant in assistant_list:
        vector_store_ids = assistant.tool_resources.file_search.vector_store_ids
        if vector_id in vector_store_ids:
            list.append(assistant.model_dump())
    
    return JsonResponse(list,safe=False)

@csrf_exempt
def delete_assistant(request):
    data = request.GET.dict()
    assistant_id = data.get('assistant_id')
    response = delete_assistant_id(assistant_id=assistant_id)
    return JsonResponse({'status':'deleted','id':assistant_id},safe=False)

@csrf_exempt
def add_assistant(request):
    # TODO Add security on already implemented files ( by name and id).
    # Files and bodys request's raw data. 
    data = request.POST.dict()
    assistant_name = data.get('name')
    vector_store_id = data.get('store_id')
    instructions = data.get('instructions')
    description = data.get('description')

    response = create_assistant(
        name=assistant_name,
        instructions=instructions,
        store_id=vector_store_id,
        description=description
    )
    # Fetching file ID from request body.
    return JsonResponse(response.model_dump())

@csrf_exempt
def ask_assistant(request):
    # data = request.POST.dict()
    raw_data = list(request.POST.keys())[0]
    data = json.loads(raw_data)
    store_id = data.get('store_id')
    thread_id = data.get('thread_id')
    assistant_id = data.get('assistant_id')
    instruction = data.get('instruction')
    content = data.get('content')

    if thread_id is None:
        new_thread = create_assistant_thread(store_id=store_id)
        thread_id = new_thread.id
    
    create_thread_user_message(thread_id=thread_id,content=content)

    run = create_thread_run(thread_id=thread_id,assistant_id=assistant_id,instructions=instruction)

    answer = retrieve_thread_message(thread_id=thread_id,run_id=run.id)

    delete_thread(thread_id=thread_id)
    return JsonResponse({'answer':answer})
