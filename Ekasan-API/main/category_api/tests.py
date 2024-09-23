import json
from typing import Dict
from rest_framework.test import APITestCase
from user_api.models import BaseUser
from keyword_api.models import Keyword
from extension_api.models import Extension
from .models import Category
from oauth2_provider.models import Application, AccessToken
from rest_framework import status
from django.urls import reverse
from django.utils import timezone
from datetime import datetime, timedelta

class CategoryTests(APITestCase):
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

    # Test sur une categorie sans (extension et keyword)
    def test_create_category_without_args(self):
        url = reverse('create-category')
        data = {
            'description': 'Test description.',
            'signature': False,
            'type': 'Test type.'    
        }
        
        # Ajouter le token à l'en-tête de la requête
        self.client.credentials(HTTP_AUTHORIZATION='Bearer ' + self.access_token.token)

        response = self.client.post(url, data, format='json')
        category = Category.objects.first()

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Category.objects.count(), 1)
        self.assertEqual(Category.objects.get().description, 'Test description.')
        self.assertEqual(Category.objects.get().signature, False)
        self.assertEqual(Category.objects.get().type, 'Test type.')

    # Test sur une catégorie avec (keyword et extension)
    def test_create_category_with_args(self):
        url = reverse('create-category')
        keyword1 = Keyword.objects.create(name="Motclé")

        data = {
            'description': 'Test description.',
            'signature': False,
            'type': 'Test type.',
            'keywords': [str(keyword1.id)]
        }
        
        # Ajouter le token à l'en-tête de la requête
        self.client.credentials(HTTP_AUTHORIZATION='Bearer ' + self.access_token.token)

        response = self.client.post(url, data, format='json')
        category = Category.objects.first()

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Category.objects.count(), 1)
        self.assertEqual(Category.objects.get().description, 'Test description.')
        self.assertEqual(Category.objects.get().signature, False)
        self.assertEqual(Category.objects.get().type, 'Test type.')

    def test_get_categories(self):
        url = reverse('read-categories')
        e1 = Extension.objects.create(tag=".txt")
        k1 = Keyword.objects.create(name="santé")
        c1 = Category.objects.create(description='Category Description numéro 1', signature=True, type="type1")
        c2 = Category.objects.create(description='Category Description numéro 2', signature=False, type="type2")
        c1.extensions.add(e1)
        c1.keywords.add(k1)
        c2.extensions.add(e1)
        c2.keywords.add(k1)

       # Ajouter le token à l'en-tête de la requête
        self.client.credentials(HTTP_AUTHORIZATION='Bearer ' + self.access_token.token)

        response = self.client.get(url)
        categorys = response.data

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(categorys), 2)
        self.assertEqual(categorys[0]['description'], 'Category Description numéro 1')
        self.assertEqual(categorys[0]['signature'], True)
        self.assertEqual(categorys[0]['type'], 'type1')
 
    def test_get_category(self):
        category = Category.objects.create(description='Category Description numéro 1', signature=True, type="type1")
        e1 = Extension.objects.create(tag=".txt")
        category.extensions.add(e1)
        url = reverse('read-category', kwargs={"pk" : category.id})
        
       # Ajouter le token à l'en-tête de la requête 
        self.client.credentials(HTTP_AUTHORIZATION='Bearer ' + self.access_token.token)

        response = self.client.get(url)
       
        self.assertTrue(Category.objects.filter(id=category.id).exists())

        category = json.loads(response.content)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(category['description'], 'Category Description numéro 1')
        self.assertEqual(category['signature'], True)
        self.assertEqual(category['type'], 'type1')

    def test_update_category(self):
        category = Category.objects.create(description='Category Description numéro 1', signature=True, type="type1")
        url = reverse('update-category', kwargs = {'pk' : category.id })

        # Ajouter le token à l'en-tête de la requête python manage.py test
        self.client.credentials(HTTP_AUTHORIZATION='Bearer ' + self.access_token.token)

        datas = { 'description' : 'Category Description numéro 111'}
        response = self.client.put(url, datas)

        category = json.loads(response.content)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIsInstance(category, Dict)
        self.assertEqual(category['description'], 'Category Description numéro 111')
        self.assertEqual(category['signature'], True)
        self.assertEqual(category['type'], 'type1')

    def test_delete_category(self):
        category = Category.objects.create(description='Category Description numéro 1', signature=True, type="type1")
        url = reverse('delete-category', kwargs= { 'pk' : category.id })

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


 # python manage.py test category_api
