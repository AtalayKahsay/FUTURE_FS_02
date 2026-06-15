const router = require('express').Router();

const {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser
} = require('../controllers/user.controller');

const {
  protect,
  adminOnly,
  managerOrAdmin
} = require('../middleware/auth.middleware');

// All routes require authentication
router.use(protect);

// ── READ (Admin + Manager) ─────────────────────────────
router.get('/', managerOrAdmin, getAllUsers);
router.get('/:id', managerOrAdmin, getUserById);

// ── WRITE (Admin only) ────────────────────────────────
router.put('/:id', adminOnly, updateUser);
router.delete('/:id', adminOnly, deleteUser);

module.exports = router;