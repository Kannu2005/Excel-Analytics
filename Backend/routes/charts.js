const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const { createChart, getUserCharts, getChart,deleteChart } = require('../controllers/chartController');

// Create new chart
router.post('/', auth, createChart);

// Get user's charts
router.get('/', auth, getUserCharts);

// Get specific chart
router.get('/:chartId', auth, getChart);
router.delete('/delete/:chartId', auth, deleteChart);
module.exports = router;