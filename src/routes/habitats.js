const express = require('express');
const habitatsController = require('../controllers/habitatsController');
const upload = require('../config/multer');
const { authenticateJWT } = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware');

const router = express.Router();

router.post('/',upload.single('picture'), authenticateJWT, authorizeRoles('admin', 'veterinaire'), habitatsController.createHabitat);
router.get('/', habitatsController.getHabitats);
router.get('/:id', authenticateJWT, authorizeRoles('admin', 'veterinaire'), habitatsController.getHabitatById);
router.put('/:id',upload.single('picture'), authenticateJWT, authorizeRoles('admin', 'veterinaire'), habitatsController.updateHabitat);
router.delete('/:id',upload.single('picture'), authenticateJWT, authorizeRoles('admin', 'veterinaire'), habitatsController.deleteHabitat);


module.exports = router;  