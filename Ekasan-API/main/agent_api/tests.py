import json
from typing import Dict
from django.test import TestCase
from rest_framework.test import APITestCase
from rest_framework import status
from django.urls import reverse
from .models import Agent
from user_api.models import BaseUser
from oauth2_provider.models import Application, AccessToken
from django.utils import timezone
from datetime import datetime, timedelta


class AgentTests(APITestCase):
    # Authentification
    def setUp(self):
        # Créer un utilisateur
        self.user = BaseUser.objects.create_user(username='testuser', password='f7bad292-a9e0-4ccd')

        # Créer une application OAuth2
        self.application = Application.objects.create(
            name='Test Application',
            client_type=Application.CLIENT_CONFIDENTIAL,
            authorization_grant_type=Application.GRANT_PASSWORD,
            user=self.user
        )

        # Créer un token d'accès
        self.access_token = AccessToken.objects.create(
            user=self.user,
            application=self.application,
            token='test-token-12345',
            expires=timezone.now() + timedelta(days=1),
            scope='read write'
        )

    def test_create_agent(self):
        url = reverse('create-agent')
        data = {
            'document_type': 'Test document type.',
            'name': 'Test name.',
            'keywords': {'key1': 'value1', 'key2': 'value2'}
        }
       
       # Ajouter le token à l'en-tête de la requête
        self.client.credentials(HTTP_AUTHORIZATION='Bearer ' + self.access_token.token)

        response = self.client.post(url, data, format='json')
        agent = Agent.objects.first()

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Agent.objects.count(), 1)
        self.assertEqual(Agent.objects.get().name, 'Test name.')
        self.assertEqual(agent.keywords, {'key1': 'value1', 'key2': 'value2'})
        self.assertEqual(agent.tool_url, timezone.now().date())

    def test_get_agents(self):
        url = reverse('read-agents')
        Agent.objects.create(name='Agent numéro 1', document_type='Description 1',keywords={'key1': 'value1', 'key2': 'value2'})
        Agent.objects.create(name='Agent numéro 2', document_type='Description 2',keywords={'key1': 'value1', 'key2': 'value2'})
        Agent.objects.create(name='Agent numéro 3', document_type='Description 3',keywords={'key1': 'value1', 'key2': 'value2'})

       # Ajouter le token à l'en-tête de la requête
        self.client.credentials(HTTP_AUTHORIZATION='Bearer ' + self.access_token.token)

        response = self.client.get(url)
        agents = response.data

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(agents), 3)
        self.assertEqual(agents[0]['name'], 'Agent numéro 1')
        self.assertEqual(agents[0]['keywords'], {'key1': 'value1', 'key2': 'value2'})
        self.assertEqual(agents[0]['tool_url'], datetime.now().strftime("%Y-%m-%d"))

    def test_get_agent(self):
        agent = Agent.objects.create(name='Agent numéro 1', document_type='Description 1',keywords={'key1': 'value1', 'key2': 'value2'})
        url = reverse('read-agent', kwargs={"pk" : agent.id})
        
       # Ajouter le token à l'en-tête de la requête python manage.py test
        self.client.credentials(HTTP_AUTHORIZATION='Bearer ' + self.access_token.token)

        response = self.client.get(url )
       
        self.assertTrue(Agent.objects.filter(id=agent.id).exists())

        agent = json.loads(response.content)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIsInstance(agent, Dict)
        self.assertEqual(agent['name'], 'Agent numéro 1')
        self.assertEqual(agent['keywords'], {'key1': 'value1', 'key2': 'value2'})
        self.assertEqual(agent['tool_url'], datetime.now().strftime("%Y-%m-%d"))

    def test_update_agent(self):
        agent = Agent.objects.create(name='Agent numéro 1', document_type='Description 1',keywords={'key1': 'value1', 'key2': 'value2'})
        url = reverse('update-agent', kwargs = {'pk' : agent.id })

        # Ajouter le token à l'en-tête de la requête 
        self.client.credentials(HTTP_AUTHORIZATION='Bearer ' + self.access_token.token)

        datas = { 'name' : 'Le nom de lAgent modifié par lupdate.'}
        response = self.client.put(url, datas)

        agent = json.loads(response.content)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIsInstance(agent, Dict)
        self.assertEqual(agent['name'], 'Le nom de lAgent modifié par lupdate.')
        self.assertEqual(agent['keywords'], {'key1': 'value1', 'key2': 'value2'})
        self.assertEqual(agent['tool_url'], datetime.now().strftime("%Y-%m-%d"))
        
    def test_delete_agent(self):
        agent = Agent.objects.create(name='Agent numéro 1', document_type='Description 1',keywords={'key1': 'value1', 'key2': 'value2'})
        url = reverse('delete-agent', kwargs= { 'pk' : agent.id })

        # Ajouter le token à l'en-tête de la requête python manage.py test
        self.client.credentials(HTTP_AUTHORIZATION='Bearer ' + self.access_token.token)

        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)

    # Déconnexion
    def tearDown(self):
        # Nettoyer après les tests
        self.user.delete()
        self.application.delete()
        self.access_token.delete()

