const express = require('express');
const feedsController= require('../controllers/feedsController');
const { authenticateJWT } = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware');

const router = express.Router();

router.post('/animal/:animal_id', authenticateJWT, authorizeRoles('admin','veterinaire', 'employe'),feedsController.createFeed);
router.get('/animal/:animal_id', authenticateJWT, authorizeRoles('admin','veterinaire', 'employe'),feedsController.getFeedsByAnimal);
router.delete('/:id', authenticateJWT, authorizeRoles('admin','veterinaire', 'employe'),feedsController.deleteFeed);

module.exports = router;