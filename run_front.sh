#!/bin/bash

# Récupérer l'adresse de l'hôte
if [[ "$OSTYPE" == "darwin"* ]]; then
    # Pour macOS
    ip_address=$(ifconfig | grep 'inet ' | grep -v '127.0.0.1' | awk '{print $2}' | head -n 1)
elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
    # Pour Linux
    ip_address=$(ifconfig | grep -oP '(?<=inet\s)\d+(\.\d+){3}' | grep -v '127.0.0.1' | head -n 1)
elif [[ "$OSTYPE" == "msys"* || "$OSTYPE" == "win32" ]]; then
    # Pour Windows (utilisez ipconfig)
    ip_address=$(ipconfig | grep 'IPv4' | awk '{print $NF}' | head -n 1)
else
    echo "Impossible de configurer votre adresse IP pour le projet Ekasan front. Votre système d'exploitation n'est pas pris en charge."
    exit 1
fi

# Configuration par défaut du projet mobile pour les appels API
echo "const IP_ADDRESS = '$ip_address';" > config.js
echo "const API_PORT = '8090';" >> config.js
echo "const IA_API_PORT = '8000';" >> config.js
echo "export const API_URL = 'http://' + IP_ADDRESS + ':' + API_PORT;" >> config.js
echo "export const IA_API_URL = 'http://' + IP_ADDRESS + ':' + IA_API_PORT;" >> config.js

echo "Une configuration de base a été effectuée dans votre projet. Vous pouvez la changer à tout moment dans le fichier config.js ."
echo "Votre adresse IP ($ip_address) a été configurée pour le projet Ekasan front."
echo "Lancement du projet..."
npx expo start
