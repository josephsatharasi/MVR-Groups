const express = require('express');
const router = express.Router();
const DeletedCustomer = require('../models/DeletedCustomer');
const DeletedAgent = require('../models/DeletedAgent');
const Customer = require('../models/Customer');
const Agent = require('../models/Agent');

// Get all deleted items (customers and agents)
router.get('/', async (req, res) => {
  try {
    const deletedCustomers = await DeletedCustomer.find().sort({ deletedAt: -1 });
    const deletedAgents = await DeletedAgent.find().sort({ deletedAt: -1 });
    
    const customers = deletedCustomers.map(c => ({ ...c.toObject(), type: 'Customer' }));
    const agents = deletedAgents.map(a => ({ ...a.toObject(), type: 'Agent' }));
    
    res.json({ customers, agents });
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

// Restore deleted agent
router.post('/restore/agent/:id', async (req, res) => {
  try {
    const deletedAgent = await DeletedAgent.findById(req.params.id);
    if (!deletedAgent) return res.status(404).json({ message: 'Agent not found in bin' });
    
    const restoredAgent = new Agent({
      name: deletedAgent.name,
      mobile: deletedAgent.mobile,
      email: deletedAgent.email,
      agentId: deletedAgent.agentId,
      companyCode: deletedAgent.companyCode,
      caderRole: deletedAgent.caderRole,
      address: deletedAgent.address,
      createdAt: deletedAgent.createdAt
    });
    
    await restoredAgent.save();
    await DeletedAgent.findByIdAndDelete(req.params.id);
    
    res.json({ message: 'Agent restored successfully', agent: restoredAgent });
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

// Permanently delete agent
router.delete('/agent/:id', async (req, res) => {
  try {
    const deletedAgent = await DeletedAgent.findByIdAndDelete(req.params.id);
    if (!deletedAgent) return res.status(404).json({ message: 'Agent not found' });
    res.json({ message: 'Agent permanently deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
