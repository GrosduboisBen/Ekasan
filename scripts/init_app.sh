#!/bin/sh

# Chemin vers le fichier .env monté dans le volume
ENV_FILE="/app/volume/.env"
INITIATED="initiated"
# Vérifiez si le fichier .env existe
if [ -f "$ENV_FILE" ]; then
    echo "INITIATED=$INITIATED" > "$ENV_FILE"
    echo "Nouvelle variable ajoutée au fichier .env."
else
    echo "Le fichier .env n'existe pas dans le volume."
    touch /app/volume/.env
    touch /app/Ekasan-API/ai_api/volume/.env
    touch /app/Ekasan-API/main/volume/.env
    echo "INITIATED=$INITIATED" > "$ENV_FILE"
    echo "Nouvelle variable ajoutée au fichier .env."
fi
