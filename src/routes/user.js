const express = require('express');
const { createUser, getUsers, getUser, updateUser, deleteUser, updatePassword, getProfile, updateProfile, createUserClient, passwordReset } = require('../controllers/userController');
const { authenticateJWT } = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware');

const router = express.Router();

// Route to get the authenticated user's profile
router.get('/profile', authenticateJWT, getProfile);
router.put('/profile', authenticateJWT, updateProfile);

// Routes with admin/gestionnaire authorization
router.post('/', authenticateJWT, authorizeRoles('admin', 'gestionnaire'), createUser);
router.post('/organisateur', createUserClient);
router.get('/', authenticateJWT, authorizeRoles('admin', 'gestionnaire'), getUsers);
router.get('/:id', authenticateJWT, authorizeRoles('admin', 'gestionnaire'), getUser);
router.put('/:id', authenticateJWT, authorizeRoles('admin', 'gestionnaire'), updateUser);
router.delete('/:id', authenticateJWT, authorizeRoles('admin', 'gestionnaire'), deleteUser);
router.put('/:id/password', authenticateJWT, authorizeRoles('admin', 'gestionnaire'), updatePassword);
router.post('/passwordReset', passwordReset);


module.exports = router;