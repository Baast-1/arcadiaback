# Arcadiaback - Back-end

## Description
Ce projet est le back-end de l'application web Arcadia, conçu avec Node.js et Express. Il gère les données des animaux, habitats, services, et utilisateurs (employés, vétérinaires, administrateurs).  

## Fonctionnalités
- Gestion des utilisateurs (employés, vétérinaires, administrateurs).
- API RESTful pour gérer les services, habitats, et animaux.
- Stockage des données relationnelles et NoSQL.
- Authentification et sécurisation des routes.

## Technologies utilisées
- **Node.js** : Environnement d'exécution JavaScript côté serveur.
- **Express.js** : Framework léger pour créer des APIs RESTful.
- **MySQL** : Base de données relationnelle.
- **MongoDB** : Base de données NoSQL pour les statistiques.

## Installation
### Prérequis
- Node.js (version 16 ou supérieure)
- NPM ou Yarn
- MySQL
- MongoDB

### Étapes
1. Clonez le dépôt :
   ```bash
   git clone <https://github.com/Baast-1/arcadiaback.git>
   cd arcadiaback

2. Installez les dépendances : npm install

3. Configurez les variables d'environnement dans un fichier .env :
DB_NAME=arcadia
DB_USER=root
DB_PASSWORD=root
DB_HOST=localhost
DB_PORT=8889
MONGO_URI=mongodb://localhost:27017/arcadia
JWT_SECRET='a1e302d85f01c45dac6f871bc49ddf57e4720c5338cdef00186507c7ce3e196f65639699ea21f36075940123f098335f530c92d833b9dc01990b5bd828b03207'

4. Lancer le back : node --watch server.js