# Ekasan
Vos documents en un instant ! 
Synthètisez les, générez des rapports, retrouvez vos informations grâce à Ekasan !  
## Prérequis
**Docker**
***

## **Attention !**

### ! **Si un processus ou un container utilise le port 5432 ( postgres ), éteignez le temporairement avant. ( Temporairement bien sur ;) )** 

### ! **L'application utilise des modèles GPT, ne communiquez aucun documents ou informations sensibles**

***
## Installation
***

- Clonez ce repo
- Créer un fichier **.env** à la racine du projet 
- Copiez le contenu du fichier **.env.exemple** à la racine dans ce fichier 

```
OPEN_API_KEY=
```

- Ajoutez à la suite du '=' la clé communiquée précedemment ! 
- Lancez la commande à la racine du projet
```
docker compose up
```

- Une fois le processus terminé, vous pouvez essayer l'application [ici](http://localhost:5173/register)

- Créez un compte, puis attendez d'être redirigez ( ça sera à cette [adresse](http://localhost:5173/login))

- Commencez à ajouter des documents et des "vector stores", à créer des assistants personnalisés et à interroger les assistants via le chatbot ! 

- Faites moi votre retour au formulaire ( communiqué en même temps que la clé API )


**Bonne expérience !**