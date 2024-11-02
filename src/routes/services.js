const express = require('express');
const servicesController = require('../controllers/servicesController');
const upload = require('../config/multer');
const { authenticateJWT } = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware');

const router = express.Router();

router.post('/',upload.single('picture'), authenticateJWT, authorizeRoles('admin', 'veterinaire'), servicesController.createService);
router.get('/', authenticateJWT, authorizeRoles('admin', 'veterinaire'), servicesController.getServices);
router.get('/:id', authenticateJWT, authorizeRoles('admin', 'veterinaire'), servicesController.getServiceById);
router.put('/:id',upload.single('picture'), authenticateJWT, authorizeRoles('admin', 'veterinaire'), servicesController.updateService);
router.delete('/:id',upload.single('picture'), authenticateJWT, authorizeRoles('admin', 'veterinaire'), servicesController.deleteService);


module.exports = router;