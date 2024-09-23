ENV_FILE=".env"
VAR_VALUE=$(grep "^OPEN_API_KEY=" "$ENV_FILE" | cut -d'=' -f2)
echo $VAR_VALUE