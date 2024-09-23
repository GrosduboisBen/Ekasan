from rest_framework import serializers
from .models import BaseUser, BaseUserInformation
from django.contrib.auth.models import User
from .helpers.check_env import hash_key

class UserSerializer (serializers.ModelSerializer):
    class Meta:
        model = BaseUser
        fields = '__all__'
    
    def create(self, validated_data):
        # Effectuez le hachage du champ_a_hasher avant de créer l'objet
        password = validated_data.get('password', '')
        if password:
            validated_data['password'] = hash_key(password)
        return super().create(validated_data)
class UserInformationSerializer (serializers.ModelSerializer):
    # user_id = serializers.RelatedField(source='BaseUser', read_only=True)
    class Meta:
        model = BaseUserInformation
        fields = ['id','user_id','email','phone','url']
