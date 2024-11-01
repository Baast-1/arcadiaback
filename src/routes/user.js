const express = require('express');
const { createUser, getUsers, getUser, updateUser, deleteUser, passwordReset } = require('../controllers/userController');
const { authenticateJWT } = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware');

const router = express.Router();

router.post('/', authenticateJWT, authorizeRoles('admin', 'gestionnaire'), createUser);
router.get('/', authenticateJWT, authorizeRoles('admin', 'gestionnaire'), getUsers);
router.get('/:id', authenticateJWT, authorizeRoles('admin', 'gestionnaire'), getUser);
router.put('/:id', authenticateJWT, authorizeRoles('admin', 'gestionnaire'), updateUser);
router.delete('/:id', authenticateJWT, authorizeRoles('admin', 'gestionnaire'), deleteUser);
router.post('/passwordReset', passwordReset);


module.exports = router;