const express = require('express');
const router = express.Router();
const avisMongoController = require('../controllers/avisMongoController');

router.post('/', avisMongoController.createAvis);
router.get('/', avisMongoController.getAllAvis);
router.put('/:id', avisMongoController.putAvis);

module.exports = router;