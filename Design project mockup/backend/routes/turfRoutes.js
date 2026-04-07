const express = require('express');
const router = express.Router();
const { getTurfs, getTurfById, getTurfSlots, searchLocations } = require('../controllers/turfController');

router.get('/locations/search', searchLocations);
router.get('/', getTurfs);
router.get('/:id', getTurfById);
router.get('/:id/slots', getTurfSlots);

module.exports = router;
