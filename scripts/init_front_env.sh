DEST_FILE="/app/front-web/.env"
IS_BUILDED=$(if [ -f "$ENV_FILE" ]; then
    # Utilisez grep pour rechercher la ligne correspondante à la variable
    VAR_VALUE=$(grep "^VITE_BUILDED=" "$ENV_FILE" | cut -d'=' -f2)
    
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
)

if [ "$IS_BUILDED" = "initiated" ]; then
    cd front-web
    npm i --legacy-peer-deps
    npm run dev
else

    rm /app/front-web/.env
    touch /app/front-web/.env

    echo "VITE_BASE_PATH_MAIN=http://localhost:8090/" >> "$DEST_FILE"
    echo "VITE_BASE_PATH_AI=http://localhost:8000/" >> "$DEST_FILE"


    ./scripts/store_front_env.sh 'VITE_CLIENT_ID' 'CLIENT_ID'
    ./scripts/store_front_env.sh 'VITE_CLIENT_SEC' 'CLIENT_SECRET'
    ./scripts/store_front_env.sh 'VITE_CLIENT_PASS' 'ADMIN_PASS'

    echo "VITE_BUILDED=initiated" >> "$DEST_FILE"
    cd front-web
    npm i --legacy-peer-deps
    npm run dev
fi