const express = require('express');
const animalsController = require('../controllers/animalsController');
const upload = require('../config/multer');
const { authenticateJWT } = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware');

const router = express.Router();

router.post('/',upload.array('picture', 3), authenticateJWT, authorizeRoles('admin'), animalsController.createAnimal);
router.get('/', animalsController.getAnimals);
router.put('/view/:id', animalsController.incrementView);
router.get('/:id', authenticateJWT, authorizeRoles('admin', 'veterinaire', 'employe'), animalsController.getAnimalById);
router.put('/:id',upload.array('picture', 3), authenticateJWT, authorizeRoles('admin'), animalsController.updateAnimal);
router.delete('/:id',upload.array('picture', 3), authenticateJWT, authorizeRoles('admin'), animalsController.deleteAnimal);


module.exports = router;  