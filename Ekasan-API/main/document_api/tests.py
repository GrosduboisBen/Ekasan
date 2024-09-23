import json
from typing import Dict
from django.test import TestCase
from rest_framework.test import APITestCase
from rest_framework import status
from django.urls import reverse
from .models import Document
from category_api.models import Category 
from user_api.models import BaseUser
from oauth2_provider.models import Application, AccessToken
from django.utils import timezone
from datetime import datetime, timedelta


class DocumentTests(APITestCase):
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

    def test_create_document(self):
        user = BaseUser.objects.create(name="Test123",first_name="Jean",last_name="Bon",email="JeanBon@gmail.com",password="-JeanBon123-")
        category = Category.objects.create(description="Une description de catégorie",signature=False,type="inconnu")
        
        url = reverse('create-document')
        data = {
            'type': 'Test document type.',
            'name': 'Test document name.',
            'user_id': str(user.id),
            'category': str(category.id),
            'file_id': '1234567890-fileID-Generated',
            'vector_id': '1234567890-vectorID-Generated'
        }

        # Ajouter le token à l'en-tête de la requête
        self.client.credentials(HTTP_AUTHORIZATION='Bearer ' + self.access_token.token)

        response = self.client.post(url, data, format='json')
        document = json.loads(response.content)

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(document["name"], 'Test document name.')
        self.assertEqual(document["type"], 'Test document type.')
        self.assertEqual(document["user_id"], str(user.id))
        self.assertEqual(document["category"], str(category.id))

    def test_get_documents(self):
        user = BaseUser.objects.create(name="Test123",first_name="Jean",last_name="Bon",email="JeanBon@gmail.com",password="-JeanBon123-")
        category = Category.objects.create(description="Une description de catégorie",signature=False,type="inconnu")
        
        url = reverse('read-documents')
        d1 = Document.objects.create(name='Document numéro 1', type='Description 1', user_id_id = str(user.id), category_id = str(category.id))
        d2 = Document.objects.create(name='Document numéro 2', type='Description 2', user_id_id = str(user.id), category_id = str(category.id))

       # Ajouter le token à l'en-tête de la requête
        self.client.credentials(HTTP_AUTHORIZATION='Bearer ' + self.access_token.token)

        response = self.client.get(url)
        documents = response.data

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(documents), 2)
        self.assertEqual(documents[0]['name'], 'Document numéro 1')
        self.assertEqual(documents[0]['type'], 'Description 1')

    def test_get_document(self):
        user = BaseUser.objects.create(name="Test123",first_name="Jean",last_name="Bon",email="JeanBon@gmail.com",password="-JeanBon123-")
        category = Category.objects.create(description="Une description de catégorie",signature=False,type="inconnu")        
        document = Document.objects.create(name='Document numéro 1', type='Description 1', user_id_id = str(user.id), category_id = str(category.id))
      
        url = reverse('read-document', kwargs={'pk' : document.id })
        
       # Ajouter le token à l'en-tête de la requête python manage.py test
        self.client.credentials(HTTP_AUTHORIZATION='Bearer ' + self.access_token.token)

        response = self.client.get(url + "?name=&id=")
       
        self.assertTrue(Document.objects.filter(id=document.id).exists())

        document = json.loads(response.content)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIsInstance(document, Dict)
        self.assertEqual(document['name'], 'Document numéro 1')
        self.assertEqual(document['type'], 'Description 1')

    def test_update_document(self):
        user = BaseUser.objects.create(name="Test123",first_name="Jean",last_name="Bon",email="JeanBon@gmail.com",password="-JeanBon123-")
        category = Category.objects.create(description="Une description de catégorie",signature=False,type="inconnu")        
        document = Document.objects.create(name='Document numéro 1', type='Description 1', user_id_id = str(user.id), category_id = str(category.id))
        url = reverse('update-document', kwargs = {'pk' : document.id })

        # Ajouter le token à l'en-tête de la requête 
        self.client.credentials(HTTP_AUTHORIZATION='Bearer ' + self.access_token.token)

        datas = { 'name' : 'Le nom du document a été modifié par lupdate.'}
        response = self.client.put(url, datas)

        document = json.loads(response.content)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIsInstance(document, Dict)
        self.assertEqual(document['name'], 'Le nom du document a été modifié par lupdate.')
        self.assertEqual(document['type'], 'Description 1')

       
    def test_delete_document(self):
        user = BaseUser.objects.create(name="Test123",first_name="Jean",last_name="Bon",email="JeanBon@gmail.com",password="-JeanBon123-")
        category = Category.objects.create(description="Une description de catégorie",signature=False,type="inconnu")        
        document = Document.objects.create(name='Document numéro 1', type='Description 1', user_id_id = str(user.id), category_id = str(category.id))
        url = reverse('delete-document', kwargs= { 'pk' : document.id })

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

# python manage.py test document_api