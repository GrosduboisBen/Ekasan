import json
from typing import Dict
from rest_framework.test import APITestCase
from rest_framework import status
from django.urls import reverse
from .models import Keyword
from user_api.models import BaseUser
from oauth2_provider.models import Application, AccessToken
from django.utils import timezone
from datetime import datetime, timedelta


class KeywordTests(APITestCase):
    # Authentification
    def setUp(self):
        # Créer un utilisateur python manage.py test
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

    def test_create_keyword(self):
        url = reverse('create-keyword')
        datas = { "name" : "Santé"}

        # Ajouter le token à l'en-tête de la requête
        self.client.credentials(HTTP_AUTHORIZATION='Bearer ' + self.access_token.token)

        response = self.client.post(url, datas)
        keyword = json.loads(response.content)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Keyword.objects.count(), 1)
        self.assertEqual(keyword['name'], 'Santé')

    def test_get_keywords(self):
        url = reverse('read-keywords')
        Keyword.objects.create(name='Keyword numéro 1')
        Keyword.objects.create(name='Keyword numéro 2')
        Keyword.objects.create(name='Keyword numéro 3')

       # Ajouter le token à l'en-tête de la requête
        self.client.credentials(HTTP_AUTHORIZATION='Bearer ' + self.access_token.token)

        response = self.client.get(url)
        keywords = response.data

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(keywords), 3)
        self.assertEqual(keywords[0]['name'], 'Keyword numéro 1')
    

    def test_get_keyword(self):
        keyword = Keyword.objects.create(name='Keyword numéro 1')
        url = reverse('read-keyword', kwargs={"pk" : keyword.id})
        
       # Ajouter le token à l'en-tête de la requête python manage.py test
        self.client.credentials(HTTP_AUTHORIZATION='Bearer ' + self.access_token.token)

        response = self.client.get(url)
       
        self.assertTrue(Keyword.objects.filter(id=keyword.id).exists())

        keyword = json.loads(response.content)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIsInstance(keyword, Dict)
        self.assertEqual(keyword['name'], 'Keyword numéro 1')
        
    def test_update_keyword(self):
        keyword = Keyword.objects.create(name='keyword numéro 1')
        url = reverse('update-keyword', kwargs = {'pk' : keyword.id })

        # Ajouter le token à l'en-tête de la requête python manage.py test keyword_api
        self.client.credentials(HTTP_AUTHORIZATION='Bearer ' + self.access_token.token)

        datas = { 'name' : 'Le nom de keyword a été modifié par lupdate.'}
        response = self.client.put(url, datas)

        keyword = json.loads(response.content)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIsInstance(keyword, Dict)
        self.assertEqual(keyword['name'], 'Le nom de keyword a été modifié par lupdate.')
       
    def test_delete_keyword(self):
        keyword = Keyword.objects.create(name='Keyword numéro 1')
        url = reverse('delete-keyword', kwargs= { 'pk' : keyword.id })

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

