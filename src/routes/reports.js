const express = require('express');
const reportsController= require('../controllers/reportsController');
const { authenticateJWT } = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware');

const router = express.Router();

router.post('/animal/:animal_id', authenticateJWT, authorizeRoles('admin','veterinaire', 'employe'),reportsController.createReport);
router.get('/animal/:animal_id', authenticateJWT, authorizeRoles('admin','veterinaire', 'employe'),reportsController.getReportsByAnimal);
router.delete('/:id', authenticateJWT, authorizeRoles('admin','veterinaire', 'employe'),reportsController.deleteReport);

module.exports = router;