const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,
    }
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  role: {
    type: DataTypes.ENUM('user', 'owner', 'admin'),
    defaultValue: 'user',
    allowNull: false,
  },
  // Owner verification state (admin controlled)
  isVerified: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    allowNull: false,
  },
  // pending | verified | rejected (only meaningful for owners)
  verificationStatus: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: null,
  },
  // Business owner profile fields (editable in profile page)
  businessName: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  businessAddress: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  businessType: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  businessDescription: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  businessProof: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  // Link to the primary Turf record created during owner registration
  primaryTurfId: {
    type: DataTypes.UUID,
    allowNull: true,
  },
  // OTP based forgot password functionality (from Login)
  forgot_otp: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  forgot_otp_expiry: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  // Token based reset password functionality (from Profile)
  reset_token: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  reset_token_expiry: {
    type: DataTypes.DATE,
    allowNull: true,
  },
}, {
  timestamps: true,
});

module.exports = User;
