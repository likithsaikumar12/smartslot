const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');
const User = require('./User');

const Turf = sequelize.define('Turf', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  name: { type: DataTypes.STRING, allowNull: false },
  category: { type: DataTypes.STRING, allowNull: false },
  location: { type: DataTypes.STRING, allowNull: false },
  address: { type: DataTypes.STRING, allowNull: false },
  rating: { type: DataTypes.FLOAT, defaultValue: 0 },
  reviews: { type: DataTypes.INTEGER, defaultValue: 0 },
  waitTime: { type: DataTypes.INTEGER, defaultValue: 0 },
  availableSlots: { type: DataTypes.INTEGER, defaultValue: 0 },
  discount: { type: DataTypes.FLOAT, defaultValue: 0 },
  price: { type: DataTypes.FLOAT, allowNull: false },
  image: { type: DataTypes.STRING, defaultValue: 'turf' },
  services: { type: DataTypes.JSONB, defaultValue: [] },
  openTime: { type: DataTypes.STRING, allowNull: false },
  closeTime: { type: DataTypes.STRING, allowNull: false },
  slots: { type: DataTypes.JSONB, defaultValue: [] },
  isApproved: { type: DataTypes.BOOLEAN, defaultValue: false }, // Admin approval
}, {
  timestamps: true,
  indexes: [
    { fields: ['location'] }
  ]
});

// Relationships
User.hasMany(Turf, { foreignKey: 'ownerId', as: 'businesses' });
Turf.belongsTo(User, { foreignKey: 'ownerId', as: 'owner' });

module.exports = Turf;
