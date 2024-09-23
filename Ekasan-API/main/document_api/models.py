from django.db import models
import uuid
from category_api.models import Category
# Create your models here.
class Document(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user_id = models.ForeignKey("user_api.BaseUser", verbose_name="BaseUser", on_delete=models.CASCADE)
    type = models.CharField("Type", max_length=240)
    name = models.CharField("Name", max_length=240)
    created = models.DateField(auto_now_add=True)
    file_id = models.CharField("FileId", max_length=240)
    vector_id = models.CharField("VectorId", max_length=240)
    category = models.ForeignKey(Category, on_delete=models.CASCADE, null=True)

    class Meta:
        ordering = ["name","created"]

class DocumentInformation(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    document_id = models.ForeignKey("document_api.Document", verbose_name="Document", on_delete=models.CASCADE)
    url = models.CharField("Url", max_length=480,null=True)
    delivered = models.DateField(auto_now_add=True)
