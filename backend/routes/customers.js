const express = require('express');
const router = express.Router();
const Customer = require('../models/Customer');
const DeletedCustomer = require('../models/DeletedCustomer');

// Get all customers
router.get('/', async (req, res) => {
  try {
    const customers = await Customer.find().sort({ createdAt: -1 });
    res.json(customers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Search customers
router.get('/search', async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) return res.json([]);
    
    const customers = await Customer.find({
      $or: [
        { name: { $regex: q, $options: 'i' } },
        { phone: { $regex: q, $options: 'i' } },
        { mobile: { $regex: q, $options: 'i' } },
        { email: { $regex: q, $options: 'i' } }
      ]
    }).sort({ createdAt: -1 });
    res.json(customers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get single customer
router.get('/:id', async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id);
    if (!customer) return res.status(404).json({ message: 'Customer not found' });
    res.json(customer);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create customer
router.post('/', async (req, res) => {
  try {
    const customer = new Customer(req.body);
    const newCustomer = await customer.save();
    res.status(201).json(newCustomer);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update customer
router.put('/:id', async (req, res) => {
  try {
    const customer = await Customer.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!customer) return res.status(404).json({ message: 'Customer not found' });
    res.json(customer);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete customer (move to bin)
router.delete('/:id', async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id);
    if (!customer) return res.status(404).json({ message: 'Customer not found' });
    
    const deletedCustomer = new DeletedCustomer({
      name: customer.name,
      phone: customer.phone || customer.mobile,
      mobile: customer.mobile,
      email: customer.email,
      address: customer.address,
      projectName: customer.projectName,
      plotNo: customer.plotNo,
      totalAmount: customer.totalAmount,
      balanceAmount: customer.balanceAmount,
      originalId: customer._id.toString(),
      createdAt: customer.createdAt
    });
    
    await deletedCustomer.save();
    await Customer.findByIdAndDelete(req.params.id);
    
    res.json({ message: 'Customer moved to bin' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
