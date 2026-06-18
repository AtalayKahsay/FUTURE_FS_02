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
      return res.status(404).json({
        success: false,
        message: 'No account with that email.'
      });

    const token = crypto.randomBytes(32).toString('hex');

    user.resetPasswordToken = crypto
      .createHash('sha256')
      .update(token)
      .digest('hex');

    user.resetPasswordExpire = Date.now() + 30 * 60 * 1000;

    await user.save();

    const resetURL = `${process.env.CLIENT_URL}/reset-password/${token}`;
    
    // Send Email
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });

    try {

      await transporter.sendMail({
        from: `"Mini CRM" <${process.env.EMAIL_USER}>`,
        to: user.email,
        subject: 'Password Reset Request — Mini CRM',
        html: `
        <div style="font-family:Inter,sans-serif;max-width:500px;margin:auto;padding:32px;background:#f8fafc;border-radius:16px">

          <h1 style="color:#4f46e5;text-align:center">
            Mini CRM
          </h1>

          <h2>Reset Your Password</h2>

          <p>
            Hi <strong>${user.name}</strong>,
          </p>

          <p>
            You requested to reset your password.
            This link expires in <strong>30 minutes</strong>.
          </p>

          <a 
          href="${resetURL}"
          style="
          display:inline-block;
          padding:12px 28px;
          background:#4f46e5;
          color:white;
          border-radius:10px;
          text-decoration:none">
          Reset Password
          </a>

          <p style="margin-top:20px">
            ${resetURL}
          </p>

        </div>
        `,
      });


      console.log("✅ Reset email sent");


    } catch (emailError) {

      // Demo protection: keep app working if SMTP fails
      console.log("Email failed:", emailError.message);

      return res.status(200).json({
        success: true,
        message: "If this email exists, you will receive a password reset link shortly."
      });

    }


    res.status(200).json({
      success: true,
      message: `Password reset link sent to ${user.email}`,
    });


  } catch (e) {

    console.error("Forgot password error:", e.message);

    res.status(500).json({
      success:false,
      message:"Something went wrong."
    });

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