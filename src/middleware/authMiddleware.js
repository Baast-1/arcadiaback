const jwt = require('jsonwebtoken');
const User = require('../models/user');

const authenticateJWT = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).json({ message: 'Pas de token, pas authorisation' });
    }
    const token = authHeader.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: 'Pas de token, pas authorisation' });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findByPk(decoded.user.id);
        if (!user) {
            return res.status(401).json({ message: 'User non trouver' });
        }
        req.user = user; 
        next();
    } catch (err) {
        res.status(401).json({ message: 'Token pas valide' });
    }
};

module.exports = {
    authenticateJWT,
};
