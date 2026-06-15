const router = require('express').Router();
const {
  login, registerFirstAdmin, createUser,
  getMe, updateProfile, changePassword,
  forgotPassword, resetPassword
} = require('../controllers/auth.controller');
const { protect, adminOnly } = require('../middleware/auth.middleware');

// Public routes
router.post('/login',          login);
router.post('/setup',          registerFirstAdmin); // only works if no admin exists
router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token', resetPassword);

// Protected routes
router.get('/me',              protect, getMe);
router.put('/profile',         protect, updateProfile);
router.put('/change-password', protect, changePassword);

// Admin only — create users
router.post('/users/create',   protect, adminOnly, createUser);

module.exports = router;