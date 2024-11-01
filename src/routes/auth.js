const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/user');
const { authenticateJWT } = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/email', async (req, res) => {
    const { email } = req.body;
    try {
        const user = await User.findOne({ where: { email } });
        if (user) {
            console.log(`Email trouvé: ${user.email}`);
            return res.status(200).json({ exists: true });
        } else {
            return res.status(200).json({ exists: false });
        }
    } catch (error) {
        console.error('Erreur lors de la vérification de l\'email:', error);
        res.status(500).json({ error: error.message });
    }
});

router.post('/register', async (req, res) => {
    const { email, password, firstname, lastname } = req.body;

    try {
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ error: 'Email already in use', errorCode: 'EMAIL_IN_USE' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await User.create({
            email,
            password: hashedPassword,
            firstname,
            lastname,
            role: 'user'
        });

        const secret = process.env.JWT_SECRET;
        if (!secret) {
            console.error('JWT_SECRET non défini');
            return res.status(500).json({ message: 'Erreur de configuration du serveur' });
        }

        const token = jwt.sign({ user: { id: newUser.id, role: newUser.role } }, secret, {
            expiresIn: '1h',
        });

        res.status(201).json({ message: 'User registered successfully', token });
    } catch (error) {
        console.error('Erreur lors de l\'enregistrement:', error);
        res.status(500).json({ message: 'Erreur serveur', error });
    }
});

router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        console.log('Received credentials:', { email, password });

        const user = await User.findOne({ where: { email } });

        if (!user) {
            console.error('Utilisateur non trouvé');
            return res.status(400).json({ error: 'User not found', errorCode: 'USER_NOT_FOUND' });
        }

        console.log('Stored password hash:', user.password);

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            console.error('Mot de passe incorrect');
            return res.status(401).json({ message: 'Mot de passe incorrect', errorCode: 'INVALID_PASSWORD' });
        }

        const secret = process.env.JWT_SECRET;
        if (!secret) {
            console.error('JWT_SECRET non défini');
            return res.status(500).json({ message: 'Erreur de configuration du serveur' });
        }

        const token = jwt.sign({ user: { id: user.id, role: user.role, company: user.company_id } }, secret, {
            expiresIn: '1h',
        });

        res.json({ message: 'Connexion réussie', token });
    } catch (error) {
        console.error('Erreur lors de la connexion:', error);
        res.status(500).json({ message: 'Erreur serveur', error });
    }
});

router.get('/verify-token', authenticateJWT, (req, res) => {
    res.status(200).json({ message: 'Token valide', user: req.user.email });
});

router.post('/logout', (req, res) => {
    res.json({ message: 'Déconnexion réussie' });
});

module.exports = router;