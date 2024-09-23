# front-mobile
Prerequis:
- nodejs
- expo

Lancer le projet:    
a la racine de front-mobile-gpe:  
`yarn install`  
`npx expo start`  
  
Configuration du front:  
  
éditer le fichier `front-mobile-gpe/config.js`  
éditer `IP_ADDRESS` avec la votre.  
  
autoriser votre adresse ip dans le back:  
éditer le fichier `Ekasan-API/main/main/settings.py`  
  
Autorisé votre adresse ip dans le back:  
  
ajouter votre adresse ip dans cette constante  
ALLOWED_HOSTS = [  
    "0.0.0.0",  
    "localhost",  
    "x.x.x.x"  
]  
