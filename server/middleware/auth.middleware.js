const jwt = require('jsonwebtoken');
const User = require('../models/User.model');

// Verify JWT + attach user
exports.protect = async (req, res, next) => {
  let token;

  // Extract token from header
  if (req.headers.authorization?.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized. No token.'
    });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Get user from DB
    const user = await User.findById(decoded.id).select('-password');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User not found.'
      });
    }

    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'User is deactivated.'
      });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Token invalid or expired.'
    });
  }
};

// Admin only
exports.adminOnly = (req, res, next) => {
  if (req.user?.role === 'admin') return next();

  return res.status(403).json({
    success: false,
    message: 'Admin access required.'
  });
};

// Admin or Manager
exports.managerOrAdmin = (req, res, next) => {
  if (['admin', 'manager'].includes(req.user?.role)) return next();

  return res.status(403).json({
    success: false,
    message: 'Manager or Admin access required.'
  });
};

// Any authenticated user (agent or above)
exports.agentOrAbove = (req, res, next) => {
  if (['admin', 'manager', 'agent'].includes(req.user?.role)) return next();

  return res.status(403).json({
    success: false,
    message: 'Access denied.'
  });
};