Project : Ekasan

Prérequis : docker

Commandes pour lancer l'api :  
     
Se situer à la racine de Ekasan-API :    
`cd Ekasan-API`  
`docker-compose up`    

Url de l'interface d'administration de l'api principale :   
`http://localhost:8090/admin`

Url du chat :  
`http://localhost:8000/chat/`

Url du bucket s3 :  
`http://localhost:4566/test-s3`

Configuration Auth :     
La première fois que le conteneur se lance:
- Un mot de passe admin est géneré. Il faut le noter quelquepart, afin de pouvoir accéder à l'interface d'administration de django ici : http://localhost:8090/admin/login/?next=/admin/. 
- un client_id et un client_secret sont généré dans le fichier .env du container. Il seront utilisés lors de la connexion sur la route POST /login ainsi que sur la route GET /auth.

Configuration du Chat :  
- la clé pour communiqué avec l'api se situe dans le .env

