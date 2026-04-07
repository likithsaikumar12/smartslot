const { Op } = require('sequelize');
const Turf = require('../models/Turf');

const getTurfs = async (req, res) => {
  try {
    const { location } = req.query;
    const whereClause = { isApproved: true };
    
    if (location) {
      whereClause[Op.or] = [
        { location: { [Op.iLike]: `%${location}%` } },
        { address: { [Op.iLike]: `%${location}%` } }
      ];
    }

    const turfs = await Turf.findAll({
      where: whereClause,
      order: [['name', 'ASC']],
    });
    res.json(turfs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getTurfById = async (req, res) => {
  try {
    const turf = await Turf.findByPk(req.params.id);
    if (!turf) {
      return res.status(404).json({ message: 'Turf not found' });
    }
    if (!turf.isApproved) {
      return res.status(404).json({ message: 'Turf not found' });
    }
    res.json(turf);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getTurfSlots = async (req, res) => {
  try {
    const turf = await Turf.findByPk(req.params.id);
    if (!turf) {
      return res.status(404).json({ message: 'Turf not found' });
    }
    if (!turf.isApproved) {
      return res.status(404).json({ message: 'Turf not found' });
    }
    res.json(turf.slots);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const searchLocations = async (req, res) => {
  try {
    const { q } = req.query;
    if (!q || typeof q !== 'string') return res.json([]);
    
    const locations = await Turf.findAll({
      attributes: [
        [Turf.sequelize.fn('DISTINCT', Turf.sequelize.col('location')), 'locationName']
      ],
      where: {
        location: { [Op.iLike]: `%${q}%` },
        isApproved: true
      },
      limit: 10,
      raw: true
    });
    
    res.json(locations.map(loc => loc.locationName));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getTurfs, getTurfById, getTurfSlots, searchLocations };
