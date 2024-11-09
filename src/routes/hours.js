const express = require('express');
const hoursController = require('../controllers/hoursController');
const { authenticateJWT } = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware');

const router = express.Router();

router.post('/', authenticateJWT, authorizeRoles('admin'), hoursController.createHour);
router.get('/', hoursController.getHours);
router.get('/:id', authenticateJWT, authorizeRoles('admin'), hoursController.getHourById);
router.put('/:id', authenticateJWT, authorizeRoles('admin'), hoursController.updateHour);
router.delete('/:id', authenticateJWT, authorizeRoles('admin'), hoursController.deleteHour);

module.exports = router;