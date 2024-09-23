#!/bin/sh

# Chemin vers le fichier .env monté dans le volume
NAME="$1"
VAL="$2"
ENV_FILE="$3"
# Vérifiez si le fichier .env existe
if [ -f "$ENV_FILE" ]; then
    echo "$NAME=$VAL" >> "$ENV_FILE"
    echo "Nouvelle variable ajoutée au fichier .env."
else
    echo "Le fichier .env n'existe pas dans le volume."
    touch /app/volume/.env
    echo "$NAME=$VAL" >> "$ENV_FILE"
    echo "Nouvelle variable ajoutée au fichier .env."
fi
