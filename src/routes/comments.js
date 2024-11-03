const express = require('express');
const commentsController= require('../controllers/commentsController');
const { authenticateJWT } = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware');

const router = express.Router();

router.post('/habitat/:habitat_id', authenticateJWT, authorizeRoles('admin','veterinaire'),commentsController.createCommentByHabitat);
router.get('/habitat/:habitat_id', authenticateJWT, authorizeRoles('admin','veterinaire'),commentsController.getCommentsByHabitat);
router.delete('/:id', authenticateJWT, authorizeRoles('admin','veterinaire'),commentsController.deleteComment);

module.exports = router;