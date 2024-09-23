from django.db import models
import uuid

class Extension(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    tag = models.CharField("Name", max_length=240)
    created = models.DateField(auto_now_add=True)
