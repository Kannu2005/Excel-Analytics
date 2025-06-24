const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const auth = require('../middlewares/auth');

// Middleware to check if user is admin
const isAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Access denied. Admin only.' });
  }
  next();
};

// Admin dashboard stats
router.get('/stats', auth, isAdmin, adminController.getDashboardStats);

// User management
router.get('/users', auth, isAdmin, adminController.getAllUsers);
router.delete('/users/:userId', auth, isAdmin, adminController.deleteUser);

// File management
router.get('/files', auth, isAdmin, adminController.getAllFiles);
router.delete('/files/:fileId', auth, isAdmin, adminController.deleteFile);

// Storage usage
router.get('/storage', auth, isAdmin, adminController.getStorageUsage);

// Chart statistics route
router.get('/charts/stats', auth, isAdmin, adminController.getChartStats);

// Get all charts with pagination and filtering
router.get('/charts', auth, isAdmin, adminController.getAllCharts);

// Get specific chart by ID
router.get('/charts/:chartId', auth, isAdmin, adminController.getChartById);

// Delete specific chart
router.delete('/charts/:chartId', auth, isAdmin, adminController.deleteChart);

// Bulk delete charts
router.delete('/charts', auth, isAdmin, adminController.bulkDeleteCharts);

// Get chart analytics dashboard
router.get('/dashboard', auth, isAdmin, adminController.getDashboardOverview);

module.exports = router;