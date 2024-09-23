from django.db import models
from django.contrib.auth.models import AbstractUser
import uuid

# Create your models here.
class BaseUser(AbstractUser):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField("Name", max_length=240)
    first_name = models.CharField("First Name", max_length=240)
    last_name = models.CharField("Last Name", max_length=50)
    created = models.DateField(auto_now_add=True)
