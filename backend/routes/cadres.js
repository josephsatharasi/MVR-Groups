const express = require('express');
const router = express.Router();
const Cadre = require('../models/Cadre');
const DeletedCadre = require('../models/DeletedCadre');

// Get all cadres
router.get('/', async (req, res) => {
  try {
    const cadres = await Cadre.find().sort({ createdAt: -1 });
    res.json(cadres);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Search cadres
router.get('/search', async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) return res.json([]);
    
    const cadres = await Cadre.find({
      $or: [
        { name: { $regex: q, $options: 'i' } },
        { mobile: { $regex: q, $options: 'i' } },
        { email: { $regex: q, $options: 'i' } },
        { cadreId: { $regex: q, $options: 'i' } }
      ]
    }).sort({ createdAt: -1 });
    res.json(cadres);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get single cadre
router.get('/:id', async (req, res) => {
  try {
    const cadre = await Cadre.findById(req.params.id);
    if (!cadre) return res.status(404).json({ message: 'Cadre not found' });
    res.json(cadre);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create cadre
router.post('/', async (req, res) => {
  try {
    // Auto-generate cadreId if not provided
    if (!req.body.cadreId) {
      const lastCadre = await Cadre.findOne().sort({ cadreId: -1 });
      const maxId = lastCadre && lastCadre.cadreId ? parseInt(lastCadre.cadreId) : 200000;
      req.body.cadreId = (maxId + 1).toString();
    }
    
    const cadre = new Cadre(req.body);
    const newCadre = await cadre.save();
    res.status(201).json(newCadre);
  } catch (error) {
    console.error('Error creating cadre:', error);
    res.status(400).json({ message: error.message });
  }
});

// Update cadre
router.put('/:id', async (req, res) => {
  try {
    const cadre = await Cadre.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!cadre) return res.status(404).json({ message: 'Cadre not found' });
    res.json(cadre);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete cadre (move to bin)
router.delete('/:id', async (req, res) => {
  try {
    const cadre = await Cadre.findById(req.params.id);
    if (!cadre) return res.status(404).json({ message: 'Cadre not found' });
    
    const deletedCadre = new DeletedCadre({
      name: cadre.name,
      mobile: cadre.mobile,
      email: cadre.email,
      cadreId: cadre.cadreId,
      companyCode: cadre.companyCode,
      cadreRole: cadre.cadreRole,
      address: cadre.address,
      originalId: cadre._id.toString(),
      createdAt: cadre.createdAt
    });
    
    await deletedCadre.save();
    await Cadre.findByIdAndDelete(req.params.id);
    
    res.json({ message: 'Cadre moved to bin' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
