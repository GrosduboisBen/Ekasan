from django.db import models
import uuid
from .helpers.check_env import hash_key
from django.contrib.auth.models import AbstractUser

# Create your models here.

class BaseUser(AbstractUser):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField("Name", max_length=240)
    first_name = models.CharField("First Name", max_length=240)
    last_name = models.CharField("Last Name", max_length=50)
    created = models.DateField(auto_now_add=True)


class BaseUserInformation(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user_id = models.ForeignKey("user_api.BaseUser", verbose_name="BaseUser", on_delete=models.CASCADE)
    email = models.EmailField("Email", max_length=240)
    phone = models.CharField("Phone", max_length=80)
    url = models.CharField("Url", max_length=480,null=True)
    created = models.DateField(auto_now_add=True)
