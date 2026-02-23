const express = require('express');
const router = express.Router();
const CadreIncome = require('../models/CadreIncome');

// Get income with filters (monthly or custom date range)
router.get('/', async (req, res) => {
  try {
    const { cadreId, month, year, startDate, endDate } = req.query;
    let filter = {};

    if (cadreId) filter.cadreId = cadreId;

    // Monthly filter
    if (month && year) {
      const start = new Date(year, month - 1, 1);
      const end = new Date(year, month, 0, 23, 59, 59);
      filter.date = { $gte: start, $lte: end };
    }
    // Custom date range filter
    else if (startDate && endDate) {
      filter.date = { 
        $gte: new Date(startDate), 
        $lte: new Date(new Date(endDate).setHours(23, 59, 59)) 
      };
    }

    const incomes = await CadreIncome.find(filter)
      .populate('cadreId', 'name cadreId mobile')
      .sort({ date: -1 });
    
    res.json(incomes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get income summary for a cadre
router.get('/summary/:cadreId', async (req, res) => {
  try {
    const { month, year, startDate, endDate } = req.query;
    let filter = { cadreId: req.params.cadreId };

    if (month && year) {
      const start = new Date(year, month - 1, 1);
      const end = new Date(year, month, 0, 23, 59, 59);
      filter.date = { $gte: start, $lte: end };
    } else if (startDate && endDate) {
      filter.date = { 
        $gte: new Date(startDate), 
        $lte: new Date(new Date(endDate).setHours(23, 59, 59)) 
      };
    }

    const result = await CadreIncome.aggregate([
      { $match: filter },
      { $group: { _id: null, total: { $sum: '$amount' }, count: { $sum: 1 } } }
    ]);

    res.json({ 
      total: result[0]?.total || 0, 
      count: result[0]?.count || 0 
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add income entry
router.post('/', async (req, res) => {
  try {
    const income = new CadreIncome(req.body);
    const newIncome = await income.save();
    res.status(201).json(newIncome);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update income entry
router.put('/:id', async (req, res) => {
  try {
    const income = await CadreIncome.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!income) return res.status(404).json({ message: 'Income entry not found' });
    res.json(income);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete income entry
router.delete('/:id', async (req, res) => {
  try {
    const income = await CadreIncome.findByIdAndDelete(req.params.id);
    if (!income) return res.status(404).json({ message: 'Income entry not found' });
    res.json({ message: 'Income entry deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
