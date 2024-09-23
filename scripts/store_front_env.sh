DEST_FILE="/app/front-web/.env"
VAR_KEY="$1"
ENV_KEY="$2"
# Vérifiez si le fichier .env existe
ENV_FILE="/app/volume/.env"

if [ -f "$ENV_FILE" ]; then
    # Utilisez grep pour rechercher la ligne correspondante à la variable
    VAR_VALUE=$(grep "^$ENV_KEY=" "$ENV_FILE" | cut -d'=' -f2)
    
    if [ -n "$VAR_VALUE" ]; then
        # echo "La valeur de $INITIATED est : $VAR_VALUE"
        echo "$VAR_KEY=$VAR_VALUE" >> "$DEST_FILE"
    else
        # echo "La variable $INITIATED n'est pas définie dans le fichier .env."
        echo $false
    fi
else
    echo $false
fi