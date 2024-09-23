import os
import uuid
import random
import string

# Génération d'un UUID
generated_uuid = str(uuid.uuid4())
# Définition d'une variable d'environnement avec l'UUID généré
os.environ["CLIENT_ID"] = generated_uuid
print(generated_uuid)
