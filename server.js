const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();
const os = require('os');
const sequelize = require('./src/config/database');
const app = express();

const PORT = process.env.PORT || 3001;
const corsOptions = {
    origin: true,
    optionsSuccessStatus: 200,
    credentials: true,
};
if (!process.env.JWT_SECRET) {
    console.error('JWT_SECRET is not defined');
    process.exit(1);
}
app.use(cors(corsOptions));
app.use(bodyParser.json());

const authRoutes = require('./src/routes/auth');
const userRoutes = require('./src/routes/user');
app.use('/auth', authRoutes);
app.use('/users', userRoutes);
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
        console.log('Database synchronized successfully.');
        console.log('Database & tables created!');
        return sequelize.authenticate();
    })
    .then(() => {
        console.log('Connected to the database successfully.');
        app.listen(PORT, () => {
            const localIP = getLocalIPAddress();
            console.log(`Server running at http://${localIP}:${PORT}`);
        });
    })
    .catch(err => {
        console.error('Unable to connect to the database:', err);
    });
