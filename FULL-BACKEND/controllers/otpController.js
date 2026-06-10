const otplib = require('otplib');
const qrcode = require('qrcode');
const User = require('../models/User');

exports.generateOTP = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    const secret = otplib.authenticator.generateSecret();
    const otpauth = otplib.authenticator.keyuri(user.email, 'Class Connect Admin', secret);
    
    const qrCodeUrl = await qrcode.toDataURL(otpauth);
    
    await User.updateOne({ _id: user._id }, { $set: { otpSecret: secret } });

    res.status(200).json({
      qrCodeUrl,
      secret // optionally show the text secret for manual entry
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.verifyOTP = async (req, res) => {
  try {
    const { token } = req.body;
    const user = await User.findById(req.user.id).select('+otpSecret');
    
    if (!user || !user.otpSecret) return res.status(404).json({ error: 'User or secret not found' });

    const isValid = otplib.authenticator.check(token, user.otpSecret);
    
    if (isValid) {
      await User.updateOne({ _id: user._id }, { $set: { otpEnabled: true } });
      res.status(200).json({ verified: true });
    } else {
      res.status(400).json({ verified: false, message: 'Invalid OTP' });
    }
    } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getOTPStatus = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.status(200).json({ otpEnabled: user.otpEnabled });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.disableOTP = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    await User.updateOne({ _id: user._id }, { $set: { otpEnabled: false }, $unset: { otpSecret: "" } });
    res.status(200).json({ status: 'success', message: 'OTP disabled' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
