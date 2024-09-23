is_app_initiated=$(scripts/is_app_builded.sh)
ai_key=$(scripts/fetch_api_key.sh)

echo "INITIATED" "$is_app_initiated"
echo "KEY" "$ai_key"


# If app has already been set up in container.
if [ "$is_app_initiated" = "initiated" ]; then
    cd ./Ekasan-API
    python3 main/manage.py makemigrations
    python3 main/manage.py migrate
    echo "Running Server..."
    python3 main/manage.py runserver 0.0.0.0:8090
else
    id=$(python scripts/generate_id.py)
    pass=$(python scripts/generate_pass.py)
    echo "ADMIN PASS: $pass"
    # Set up env variable : True if app has already been builded in container.
    # False if script run for the first time in this context.
    ./scripts/init_app.sh

    ./scripts/store_cred.sh 'OPENAI_API_KEY' "$ai_key" "/app/volume/.env"
    ./scripts/store_cred.sh 'OPENAI_API_KEY' "$ai_key" "/app/Ekasan-API/.env"
    ./scripts/store_cred.sh 'OPENAI_API_KEY' "$ai_key" "/app/Ekasan-API/volume/.env"
    ./scripts/store_cred.sh 'OPENAI_API_KEY' "$ai_key" "/app/Ekasan-API/ai_api/volume/.env"
    ./scripts/store_cred.sh 'OPENAI_API_KEY' "$ai_key" "/app/Ekasan-API/main/volume/.env"
    
    cd ./Ekasan-API
    python3 main/manage.py makemigrations
    python3 main/manage.py migrate

    # Create django admin user with generated pass
    ./scripts/init_auth.sh "$pass"

    # Create oauth app and store response.
    output=$(python3 main/manage.py createapplication 'confidential' password --client-id=$id --name=eksan-auth)

    # Grep "client_secret"
    client_secret_line=$(echo "$output" | grep "client_secret")

    # awk secret value
    client_secret=$(echo "$client_secret_line" | awk '{print $2}')

    # Store cred in app .env file
    ./scripts/store_cred.sh "CLIENT_ID" "$id" "/app/volume/.env"
    ./scripts/store_cred.sh "CLIENT_SECRET" "$client_secret" "/app/volume/.env"
    ./scripts/store_cred.sh "ADMIN_PASS" "$pass" "/app/volume/.env"

    DEST_FILE="/app/front-web/.env"

    # Display in terminal
    echo "Le client_secret est : $client_secret"
    echo "Le client_id est : $id"
    python3 main/manage.py runserver 0.0.0.0:8090
fi
