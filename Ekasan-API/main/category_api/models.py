from django.db import models
import uuid
from extension_api.models import Extension
from keyword_api.models import Keyword


class Category(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    description = models.CharField("Description", max_length=240)
    signature = models.BooleanField()
    type = models.CharField("Type", max_length=240)
    created = models.DateField(auto_now_add=True)
    keywords = models.ManyToManyField(Keyword, blank=True)
    extensions = models.ManyToManyField(Extension, blank=True)
