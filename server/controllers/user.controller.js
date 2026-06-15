const User = require('../models/User.model');

// GET all users (admin + manager)
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password').sort('-createdAt');
    res.status(200).json({ success: true, users });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
};

// GET single user
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) return res.status(404).json({ success: false, message: 'User not found.' });
    res.status(200).json({ success: true, user });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
};

// UPDATE user role / status (admin only)
exports.updateUser = async (req, res) => {
  try {
    const existingUser = await User.findById(req.params.id);
      if (!existingUser)
        return res.status(404).json({ success: false, message: 'User not found.' });
    const { name, email, role, isActive } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { name, email, role, isActive },
      { new: true, runValidators: true }
    ).select('-password');
    if (!user) return res.status(404).json({ success: false, message: 'User not found.' });
    res.status(200).json({ success: true, message: 'User updated.', user });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
};

// DELETE user (admin only)
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user)
      return res.status(404).json({ success: false, message: 'User not found.' });

    if (req.params.id === req.user._id.toString())
      return res.status(400).json({
        success: false,
        message: "You can't delete yourself."
      });

    if (user.role === 'admin') {
      const adminCount = await User.countDocuments({ role: 'admin' });

      if (adminCount === 1)
        return res.status(400).json({
          success: false,
          message: 'Cannot delete the last admin account.'
        });
    }

    await User.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'User deleted.'
    });
  } catch (e) {
    res.status(500).json({
      success: false,
      message: e.message
    });
  }
};