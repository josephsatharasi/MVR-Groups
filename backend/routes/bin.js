const express = require('express');
const router = express.Router();
const DeletedCustomer = require('../models/DeletedCustomer');
const DeletedCadre = require('../models/DeletedCadre');
const Customer = require('../models/Customer');
const Cadre = require('../models/Cadre');

// Get all deleted items (customers and cadres)
router.get('/', async (req, res) => {
  try {
    const deletedCustomers = await DeletedCustomer.find().sort({ deletedAt: -1 });
    const deletedCadres = await DeletedCadre.find().sort({ deletedAt: -1 });
    
    const customers = deletedCustomers.map(c => ({ ...c.toObject(), type: 'Customer' }));
    const cadres = deletedCadres.map(c => ({ ...c.toObject(), type: 'Cadre' }));
    
    res.json({ customers, cadres });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Restore deleted customer
router.post('/restore/customer/:id', async (req, res) => {
  try {
    const deletedCustomer = await DeletedCustomer.findById(req.params.id);
    if (!deletedCustomer) return res.status(404).json({ message: 'Customer not found in bin' });
    
    const restoredCustomer = new Customer({
      name: deletedCustomer.name,
      phone: deletedCustomer.phone,
      email: deletedCustomer.email,
      address: deletedCustomer.address,
      area: deletedCustomer.area,
      service: deletedCustomer.service,
      brand: deletedCustomer.brand,
      createdAt: deletedCustomer.createdAt
    });
    
    await restoredCustomer.save();
    await DeletedCustomer.findByIdAndDelete(req.params.id);
    
    res.json({ message: 'Customer restored successfully', customer: restoredCustomer });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Permanently delete customer
router.delete('/customer/:id', async (req, res) => {
  try {
    const deletedCustomer = await DeletedCustomer.findByIdAndDelete(req.params.id);
    if (!deletedCustomer) return res.status(404).json({ message: 'Customer not found' });
    res.json({ message: 'Customer permanently deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Restore deleted cadre
router.post('/restore/cadre/:id', async (req, res) => {
  try {
    const deletedCadre = await DeletedCadre.findById(req.params.id);
    if (!deletedCadre) return res.status(404).json({ message: 'Cadre not found in bin' });
    
    const restoredCadre = new Cadre({
      name: deletedCadre.name,
      mobile: deletedCadre.mobile,
      email: deletedCadre.email,
      cadreId: deletedCadre.cadreId,
      companyCode: deletedCadre.companyCode,
      cadreRole: deletedCadre.cadreRole,
      address: deletedCadre.address,
      createdAt: deletedCadre.createdAt
    });
    
    await restoredCadre.save();
    await DeletedCadre.findByIdAndDelete(req.params.id);
    
    res.json({ message: 'Cadre restored successfully', cadre: restoredCadre });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Permanently delete cadre
router.delete('/cadre/:id', async (req, res) => {
  try {
    const deletedCadre = await DeletedCadre.findByIdAndDelete(req.params.id);
    if (!deletedCadre) return res.status(404).json({ message: 'Cadre not found' });
    res.json({ message: 'Cadre permanently deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
