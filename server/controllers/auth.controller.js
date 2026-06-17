const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const User = require('../models/User.model');
const nodemailer = require('nodemailer');

const genToken = id => jwt.sign({ id }, process.env.JWT_SECRET, {
  expiresIn: process.env.JWT_EXPIRE || '7d'
});

// ── PUBLIC: Login ─────────────────────────────────────
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ success: false, message: 'Email and password required.' });

    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.comparePassword(password)))
      return res.status(401).json({ success: false, message: 'Invalid credentials.' });

    if (!user.isActive)
      return res.status(401).json({ success: false, message: 'Account is deactivated. Contact admin.' });

    const token = genToken(user._id);
    res.status(200).json({
      success: true,
      token,
      user: { _id: user._id, name: user.name, email: user.email, role: user.role }
    });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
};

// ── ADMIN ONLY: Create user (replaces public register) ─
exports.createUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    if (!name || !email || !password)
      return res.status(400).json({ success: false, message: 'Name, email and password required.' });

    if (await User.findOne({ email }))
      return res.status(400).json({ success: false, message: 'Email already registered.' });

    const user = await User.create({
      name, email, password,
      role: role || 'agent',
      createdBy: req.user._id
    });

    res.status(201).json({
      success: true,
      message: `${user.role} account created successfully.`,
      user: { _id: user._id, name: user.name, email: user.email, role: user.role }
    });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
};

// ── SYSTEM SETUP: Create initial admin account ─────────
exports.registerFirstAdmin = async (req, res) => {
  try {
    const adminExists = await User.findOne({ role: 'admin' });
    if (adminExists)
      return res.status(403).json({ success: false, message: 'Setup already complete. Contact your admin.' });

    const { name, email, password } = req.body;
    if (!name || !email || !password)
      return res.status(400).json({ success: false, message: 'All fields required.' });

    const user = await User.create({ name, email, password, role: 'admin' });
    const token = genToken(user._id);

    res.status(201).json({
      success: true,
      message: 'Admin account created!',
      token,
      user: { _id: user._id, name: user.name, email: user.email, role: user.role }
    });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
};

// ── AUTH: Get current user ────────────────────────────
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    res.status(200).json({ success: true, user });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
};

// ── AUTH: Update own profile ──────────────────────────
exports.updateProfile = async (req, res) => {
  try {
    const { name, email } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user._id, { name, email },
      { new: true, runValidators: true }
    ).select('-password');
    res.status(200).json({ success: true, user });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
};

// ── AUTH: Change password ─────────────────────────────
exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user._id).select('+password');
    if (!(await user.comparePassword(currentPassword)))
      return res.status(401).json({ success: false, message: 'Current password is incorrect.' });
    user.password = newPassword;
    await user.save();
    res.status(200).json({ success: true, message: 'Password changed successfully.' });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
};

// ── PUBLIC: Forgot password ───────────────────────────
exports.forgotPassword = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user)
      return res.status(404).json({ success: false, message: 'No account with that email.' });

    const token = crypto.randomBytes(32).toString('hex');
    user.resetPasswordToken  = crypto.createHash('sha256').update(token).digest('hex');
    user.resetPasswordExpire = Date.now() + 30 * 60 * 1000; // 30 mins
    await user.save();

    // Build reset URL
    const resetURL = `${process.env.CLIENT_URL}/reset-password/${token}`;

    // Send email
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: `"Mini CRM" <${process.env.EMAIL_USER}>`,
      to: user.email,
      subject: 'Password Reset Request — Mini CRM',
      html: `
        <div style="font-family:Inter,sans-serif;max-width:500px;margin:0 auto;padding:32px;background:#f8fafc;border-radius:16px;">
          <div style="background:#4f46e5;padding:20px;border-radius:12px;text-align:center;margin-bottom:24px;">
            <h1 style="color:#fff;margin:0;font-size:24px;">Mini CRM</h1>
          </div>
          <h2 style="color:#0f172a;">Reset Your Password</h2>
          <p style="color:#475569;">Hi <strong>${user.name}</strong>,</p>
          <p style="color:#475569;">You requested to reset your password. Click the button below. This link expires in <strong>30 minutes</strong>.</p>
          <a href="${resetURL}" style="display:inline-block;margin:24px 0;padding:12px 28px;background:#4f46e5;color:#fff;border-radius:10px;text-decoration:none;font-weight:600;font-size:15px;">
            Reset Password
          </a>
          <p style="color:#94a3b8;font-size:13px;">If you didn't request this, ignore this email. Your password won't change.</p>
          <p style="color:#94a3b8;font-size:12px;margin-top:24px;">Or copy this link:<br/><a href="${resetURL}" style="color:#4f46e5;">${resetURL}</a></p>
        </div>
      `,
    });

    res.status(200).json({
      success: true,
      message: `Password reset link sent to ${user.email}`,
    });

  } catch (e) {
    console.error('Email error:', e.message);
    res.status(500).json({ success: false, message: 'Failed to send email. Check email config.' });
  }
};

// ── PUBLIC: Reset password ────────────────────────────
exports.resetPassword = async (req, res) => {
  try {
    const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');
    const user = await User.findOne({
      resetPasswordToken:  hashedToken,
      resetPasswordExpire: { $gt: Date.now() }
    });
    if (!user)
      return res.status(400).json({ success: false, message: 'Invalid or expired reset token.' });

    user.password            = req.body.password;
    user.resetPasswordToken  = null;
    user.resetPasswordExpire = null;
    await user.save();

    const token = genToken(user._id);
    res.status(200).json({ success: true, message: 'Password reset successful.', token });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
};