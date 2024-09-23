import json
from typing import Dict
from rest_framework.test import APITestCase
from rest_framework import status
from django.urls import reverse
from .models import Extension
from user_api.models import BaseUser
from oauth2_provider.models import Application, AccessToken
from django.utils import timezone
from datetime import datetime, timedelta


class ExtensionTests(APITestCase):
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

    def test_create_extension(self):
        url = reverse('create-extension')
        data = {
            'tag': '.txt',
        }
       
       # Ajouter le token à l'en-tête de la requête
        self.client.credentials(HTTP_AUTHORIZATION='Bearer ' + self.access_token.token)

        response = self.client.post(url, data, format='json')
        extension = Extension.objects.first()

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Extension.objects.count(), 1)
        self.assertEqual(Extension.objects.get().tag, '.txt')

    def test_get_extensions(self):
        url = reverse('read-extensions')
        Extension.objects.create(tag = '.txt')
        Extension.objects.create(tag = '.pdf')
        Extension.objects.create(tag = '.jpg')

       # Ajouter le token à l'en-tête de la requête
        self.client.credentials(HTTP_AUTHORIZATION='Bearer ' + self.access_token.token)

        response = self.client.get(url)
        extensions = response.data

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(extensions), 3)
        self.assertEqual(extensions[0]['tag'], '.txt')
        self.assertEqual(extensions[1]['tag'], '.pdf')
        self.assertEqual(extensions[2]['tag'], '.jpg')

    def test_get_extension(self):
        extension = Extension.objects.create(tag = '.txt')
        url = reverse('read-extension', kwargs={"pk" : extension.id})
        
       # Ajouter le token à l'en-tête de la requête python manage.py test
        self.client.credentials(HTTP_AUTHORIZATION='Bearer ' + self.access_token.token)

        response = self.client.get(url)
       
        self.assertTrue(Extension.objects.filter(id=extension.id).exists())
        extension = json.loads(response.content)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIsInstance(extension, Dict)
        self.assertEqual(extension['tag'], '.txt')

    def test_update_extension(self):
        extension = Extension.objects.create(tag = '.txt')
        url = reverse('update-extension', kwargs = {'pk' : extension.id })

        # Ajouter le token à l'en-tête de la requête python manage.py test
        self.client.credentials(HTTP_AUTHORIZATION='Bearer ' + self.access_token.token)

        datas = { 'tag' : '.png'}
        response = self.client.put(url, datas)

        extension = json.loads(response.content)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIsInstance(extension, Dict)
        self.assertEqual(extension['tag'], '.png')
        
    def test_delete_extension(self):
        extension = Extension.objects.create(tag='.pdf')
        url = reverse('delete-extension', kwargs= { 'pk' : extension.id })

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

