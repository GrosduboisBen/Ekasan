from django.db import models
import uuid

# Create your models here.
class Agent(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    document_type = models.CharField("Document Type", max_length=240)
    name = models.CharField("Name", max_length=240)
    tool_url = models.DateField(auto_now_add=True)
    keywords = models.JSONField("keywords")
