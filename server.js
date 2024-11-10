const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();
const os = require('os');
const sequelize = require('./src/config/database');
const app = express();
const mongoose = require('./src/config/mongodb')

const PORT = process.env.PORT || 3001;
const corsOptions = {
    origin: true,
    optionsSuccessStatus: 200,
    credentials: true,
};
if (!process.env.JWT_SECRET) {
    console.error('JWT_SECRET est pas defini');
    process.exit(1);
}
app.use(cors(corsOptions));
app.use(bodyParser.json());

const avisMongoRoutes = require('./src/routes/avisMongo');
const authRoutes = require('./src/routes/auth');
const userRoutes = require('./src/routes/user');
const hourRoutes = require('./src/routes/hours');
const serviceRoutes = require('./src/routes/services');
const habitatRoutes = require('./src/routes/habitats');
const commentRoutes = require('./src/routes/comments');
const animalRoutes = require('./src/routes/animals');
const feedRoutes = require('./src/routes/feeds');
const reportsRoutes = require('./src/routes/reports');
const contactRoutes = require('./src/routes/contact');

require('./src/models/associations');

app.use('/auth', authRoutes);
app.use('/users', userRoutes);
app.use('/hours', hourRoutes);
app.use('/services', serviceRoutes);
app.use('/habitats', habitatRoutes);
app.use('/comments', commentRoutes);
app.use('/animals', animalRoutes);
app.use('/feeds', feedRoutes);
app.use('/reports', reportsRoutes);
app.use('/avis', avisMongoRoutes);
app.use('/contact', contactRoutes);

app.use('/uploads', express.static('uploads'));


const getLocalIPAddress = () => {
    const interfaces = os.networkInterfaces();
    for (const name of Object.keys(interfaces)) {
        for (const iface of interfaces[name]) {
            if (iface.family === 'IPv4' && !iface.internal) {
                return iface.address;
            }
        }
    }
    return 'localhost';
};

sequelize.sync({ alter: true })
    .then(() => {
        console.log('Base de données synchronisée avec succès.');
        console.log('Base de données et tables créées !');
        return sequelize.authenticate();
    })
    .then(() => {
        console.log('Connecté à la base de données avec succès.');
        app.listen(PORT, () => {
            const localIP = getLocalIPAddress();
            console.log(`Serveur en cours d'exécution à l'adresse http://${localIP}:${PORT}`);
        });
    })
    .catch(err => {
        console.error('Impossible de se connecter à la base de données :', err);
    });
