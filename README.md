# TIC-GPE : Ekasan
***
## Installation
***
### Prérequis

- __NodeJS 20+__
- __Python 3.10__
- __Docker & Docker Compose__
- __Expo.dev__
***
***
### 1. __Api & Base de Données__
***
- Dans le dossier` Ekasan-API`, lancez la commande :
```
 docker compose up --build
```

> _Configuration optionnelle : Autorisation du front en local. Ceci est une solution temporaire, voir [ici](#3-front-end--mobile)_

- Éditer le fichier `Ekasan-API/main/main/settings.py`: Ajoutez votre adresse ip dans cette constante 
```
ALLOWED_HOSTS = [
    "0.0.0.0",
    "localhost",
    "x.x.x.x"
]
```

- _**Nom des containers Docker associés :** ekasan-api-ai_web , ekasan-api-web, ekasan-api-localstack_

### 2. __Front-End : Web__
***
- Dans le dossier `front-web` , lancez la commande 
```
npm run dev
```

>  ___Conteneurisation en cours___
***
### 3. __Front-End : Mobile__
***
- Dans le dossier `front-mobile-gpe`, lancez la commande

        yarn install

***
> **ATTENTION**: la rubrique configuration suivante est une solution _temporaire_. Elle sera automatisée avec les autres scripts d'installation une fois l'application **conteneurisée**.
>
> L'adresse IP utilisée sera celle du container concerné au sein d'un network docker.

- Editer le fichier ``front-mobile-gpe/config.js`` : 
    - IP_ADDRESS : Renseignez L'IP de votre machine
***

***
## Utilisation
### 1. _Api & Base de Données_
#### Stack
> - Postgresql
> - Django-rest-framework
> - Python 3.10
> - Django-oauth-toolkit
***
- La base de données __Postgresql__ est accessible sur <http://localhost:5432/> (via un outil tel que __Dbeaver__ ou __PgAdmin__ à l'aide des informations suivantes par défaut) :
    - **DB_PASSWORD**: ekasan_secure_password
    - **DB_USER**: ekasan_user
    - **DB_NAME**: ekasan_db_renew
***
- Le modèle de données est le suivant : 
![data-model](/documentation-resources/schema-db.png)
***
- Les routes de l'API sont couvertes par OAuth2 à l'aide de la librairie [django-oauth-toolkit](https://django-oauth-toolkit.readthedocs.io/en/latest/) , et nécessite donc une authentification _( à l'exception bien sur des routes de connexion et d'inscription )_

- 2 APIs sont mise en service : 
    - L'API prinicipale ( ***main*** ), communiquant avec la base de données de l'application et les services Oauth2- L'API est disponible à l'url <http://localhost:8090/>
        La documentation des routes est disponible [ici](https://three-cornucopia-546.notion.site/API-Main-ea687d3235c441fda3775730703ede42?pvs=4)
.
    - L'API destinée à l'IA ( ***ai*** ), chargé de faire communiquer le chatbot ainsi que la gestion des fichiers.- L'API est disponible à l'url <http://localhost:8000/>
***

### 2. _Front-End : Mobile_
***
#### Lancement de l'application
    npx expo start

- Choisissez l'émulateur

![émulateur](/documentation-resources//EkasanMobileScreenShot.png)


### 3. _Front-End: Web_
***
#### Stack
> - Vue3-JS
> - Vuexy + Vuetify
> - Node 20+
***

- L'application web est disponible à l'adresse <http://localhost:5432>
***
### 4. _OpenAI_
***

- La clé api **OpenAI** est renseignée via un script d'initialisation des différents des différentes composantes des APIs et de leurs variables d'environnement

> **L'utilisation** de cette clé à été **restreinte** en terme d'utilisation pour éviter les utilisations non désirée.

- Le système de gestion des fichiers et d'interrogation de ces derniers utilise [l'api **OpenAI**](https://platform.openai.com/docs/overview) , permettant à l'utilisateur d'interroger l'IA uniquement sur les fichiers qui auront été **uploadé**, assurant ainsi la pertinence des réponses et donc le bon fonctionnnement de l'application.

> _Le **gestionnaire de fichier** est en cours de migration **depuis** le service **localstack** **vers** un environnement de déploiement **AWS** . Ce service sera jumellé par la suite aux services du **LLM** concerné._

- Un assistant recevera le message utilisateur du chatbot comme une instruction, cependant le prompt reste défini ( pour le moment ) côté Open AI API.

***
##  À venir

### Général

- Dev container (Vscode)
- Conteneurisation des app fronts
***
### API

- **Modèles**
    - Mots clés
    - Catégories custom
    - Types de fichiers

- **Fonctionnalité**
    - Création d'assitants
    - Création de catégories de fichiers personnalisé
    - Fine-Tuning des assistants
    - Rapports d'analayses
***
### Front-End

- Connections aux nouveaux modèles
- Chatbot
- Automatisation des processus d'analyses et de tri
- Téléchargement des fichiers et de rapports d'analyses généré
***
### IA
- Création de compte personnalisé
- Choix entre plusieurs modèles de langages.
- Personnalisation des prompts des assistants
- Génération de rapport d'analyse.
