from django.shortcuts import render
from rest_framework.views import APIView
from django.http import HttpResponse,HttpResponseServerError,FileResponse
import os
from django.views.decorators.csrf import csrf_exempt
from openai import OpenAI
from decouple import  Config, RepositoryEnv
from rest_framework.response import Response
import requests
from django.conf import settings

if settings.ENV == "test":
    env_file_path = '../volume/.env'
else:
    env_file_path = 'volume/.env'
env_config = Config(RepositoryEnv(env_file_path))
client = OpenAI(api_key=env_config('OPENAI_API_KEY'))
host = 'localhost/8000'
@csrf_exempt
def upload_file_ai(request):
    print('On Main')
    body = request.body
    response=requests.post(f'http://ekasan-api-ai_web-1:8000/upload_file/',data=body)
    if response.status_code == 200:
        return(Response(response.json()))
    else:
        return(Response({'error': 'Échec de l\'authentification'}, status=response.status_code))
