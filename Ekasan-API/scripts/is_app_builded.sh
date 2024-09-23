#!/bin/sh

# Chemin vers le fichier .env monté dans le volume
ENV_FILE="/app/volume/.env"

if [ -f "$ENV_FILE" ]; then
    # Utilisez grep pour rechercher la ligne correspondante à la variable
    VAR_VALUE=$(grep "^INITIATED=" "$ENV_FILE" | cut -d'=' -f2)
    
    if [ -n "$VAR_VALUE" ]; then
        # echo "La valeur de $INITIATED est : $VAR_VALUE"
        echo "$VAR_VALUE"
    else
        # echo "La variable $INITIATED n'est pas définie dans le fichier .env."
        echo $false
    fi
else
    echo $false
fi