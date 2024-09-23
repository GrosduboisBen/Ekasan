
python3 main/manage.py makemigrations
python3 main/manage.py migrate

# If app has already been set up in container.
is_app_initiated=$(scripts/is_app_builded.sh)
echo "$is_app_initiated"

if [ "$is_app_initiated" = "initiated" ]; then
    echo "Running Server..."
    python3 main/manage.py runserver 0.0.0.0:8090
else
    id=$(python scripts/generate_id.py)
    pass=$(python scripts/generate_pass.py)
    echo "ADMIN PASS: $pass"
    # Set up env variable : True if app has already been builded in container.
    # False if script run for the first time in this context.
    ./scripts/init_app.sh

    # Create django admin user with generated pass
    ./scripts/store_cred.sh 'OPENAI_API_KEY' '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'
    ./scripts/init_auth.sh "$pass"

    # Create oauth app and store response.
    output=$(python3 main/manage.py createapplication 'confidential' password --client-id=$id --name=eksan-auth)

    # Utilisez grep pour rechercher la ligne contenant "client_secret"
    client_secret_line=$(echo "$output" | grep "client_secret")

    # Utilisez awk pour extraire la valeur du secret (2ème colonne)
    client_secret=$(echo "$client_secret_line" | awk '{print $2}')

    # Store cred in app .env file
    ./scripts/store_cred.sh "CLIENT_ID" "$id"
    ./scripts/store_cred.sh "CLIENT_SECRET" "$client_secret"
    ./scripts/store_cred.sh "ADMIN_PASS" "$pass"

    # Affichez la valeur du secret
    echo "Le client_secret est : $client_secret"
    echo "Le client_id est : $id"
    python3 main/manage.py runserver 0.0.0.0:8090
fi
