const express = require('express');
const userController= require('../controllers/userController');
const { authenticateJWT } = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware');

const router = express.Router();

router.post('/', authenticateJWT, authorizeRoles('admin'),userController.createUser);
router.get('/', authenticateJWT, authorizeRoles('admin'),userController.getUsers);
router.get('/:id', authenticateJWT, authorizeRoles('admin'),userController.getUser);
router.put('/:id', authenticateJWT, authorizeRoles('admin'),userController.updateUser);
router.delete('/:id', authenticateJWT, authorizeRoles('admin'),userController.deleteUser);
router.post('/passwordReset',userController.passwordReset);


module.exports = router;