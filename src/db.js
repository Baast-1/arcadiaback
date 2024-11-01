const mysql = require('mysql2');
require('dotenv').config(); // Charge les variables d'environnement depuis le fichier .env


// Création d'un pool de connexions
const db = mysql.createPool({
    host: process.env.DB_HOST,        
    user: process.env.DB_USER,       
    password: process.env.DB_PASSWORD, 
    database: process.env.DB_NAME,     
    port: process.env.DB_PORT || 3306,  // Remplacez par le nom de votre base de données
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Pour utiliser une connexion du pool
db.getConnection((err, connection) => {
    if (err) throw err; // Gestion des erreurs de connexion
    console.log('Connecté à la base de données');

    // Utilisez la connexion...

    // Quand vous avez terminé avec la connexion, la remettre dans le pool
    connection.release();
});

module.exports = db;
