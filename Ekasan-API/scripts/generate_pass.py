import os
import uuid
import random
import string

os.environ["MA_VARIABLE"] = "Valeur_de_ma_variable"


# ------PASS------
def generate_random_password(length=12):
    # Définir les caractères à utiliser pour générer le mot de passe
    characters = string.ascii_letters + string.digits + string.punctuation

    # Générer le mot de passe aléatoire en mélangeant les caractères
    password = ''.join(random.choice(characters) for _ in range(length))
    return password

# Utilisation : générez un mot de passe de 16 caractères (par défaut)
random_password = generate_random_password()
print(random_password)
