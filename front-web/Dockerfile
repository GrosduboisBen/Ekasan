FROM node:20-bookworm-slim

# Définir le répertoire de travail dans le conteneur
WORKDIR /app

# Copier l'application
COPY . .

# Installer les dépendances
RUN npm install --legacy-peer-deps

# Exposer le port sur lequel l'application s'exécute
EXPOSE 5173
